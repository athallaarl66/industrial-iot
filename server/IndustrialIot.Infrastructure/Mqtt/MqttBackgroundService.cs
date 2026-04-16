using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace IndustrialIot.Infrastructure.Mqtt;

public class MqttBackgroundService : BackgroundService
{
    private readonly MqttClientService _mqttClientService;
    private readonly ILogger<MqttBackgroundService> _logger;

    public MqttBackgroundService(
        MqttClientService mqttClientService,
        ILogger<MqttBackgroundService> logger)
    {
        _mqttClientService = mqttClientService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("MQTT Background Service starting...");

        // Start the message processing queue (runs independently of the connection)
        var processingTask = _mqttClientService.ProcessQueueAsync(stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                _logger.LogInformation("Attempting to connect to MQTT broker...");
                await _mqttClientService.StartAsync(stoppingToken);
                
                _logger.LogInformation("Successfully connected to MQTT broker. Monitoring connection...");
                
                // Keep the service alive while connected. 
                // If the processing task fails, we should detect it.
                await Task.WhenAny(processingTask, Task.Delay(Timeout.Infinite, stoppingToken));
                
                if (processingTask.IsCompleted && !stoppingToken.IsCancellationRequested)
                {
                    _logger.LogWarning("Telemetry processing task completed unexpectedly. Restarting processing queue...");
                    processingTask = _mqttClientService.ProcessQueueAsync(stoppingToken);
                }
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("MQTT Background Service cancellation requested.");
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "MQTT Background Service encountered an error during connection. Retrying in 10 seconds...");
                try 
                {
                    await Task.Delay(10000, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
            }
        }

        _logger.LogInformation("MQTT Background Service stopping...");
        await _mqttClientService.StopAsync();
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("MQTT Background Service is stopping...");
        await _mqttClientService.StopAsync();
        await base.StopAsync(cancellationToken);
    }
}