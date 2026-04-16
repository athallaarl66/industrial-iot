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

        try
        {
            // Start the message processing queue
            var processingTask = _mqttClientService.ProcessQueueAsync(stoppingToken);

            // Start the MQTT client
            await _mqttClientService.StartAsync(stoppingToken);

            // Wait for cancellation or processing task to complete
            await Task.WhenAny(processingTask, Task.Delay(Timeout.Infinite, stoppingToken));
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("MQTT Background Service cancellation requested.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "MQTT Background Service encountered an error");
            throw;
        }
        finally
        {
            _logger.LogInformation("MQTT Background Service stopping...");
            await _mqttClientService.StopAsync();
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("MQTT Background Service is stopping...");
        await _mqttClientService.StopAsync();
        await base.StopAsync(cancellationToken);
    }
}