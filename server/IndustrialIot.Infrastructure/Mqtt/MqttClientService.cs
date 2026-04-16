using System.Buffers;
using System.Text;
using System.Text.Json;
using System.Threading.Channels;
using IndustrialIot.Domain.Entities;
using IndustrialIot.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MQTTnet;
using MQTTnet.Client;

namespace IndustrialIot.Infrastructure.Mqtt;

public class MqttClientService : IAsyncDisposable
{
    private readonly IMqttClient _mqttClient;
    private readonly MqttSettings _settings;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<MqttClientService> _logger;
    private readonly JsonSerializerOptions _jsonOptions;
    private readonly Channel<TelemetryMessage> _channel;

    public MqttClientService(
        IOptions<MqttSettings> settings,
        IServiceScopeFactory scopeFactory,
        ILogger<MqttClientService> logger)
    {
        _settings = settings.Value;
        _scopeFactory = scopeFactory;
        _logger = logger;

        // Bounded channel to prevent memory issues under high load
        _channel = Channel.CreateBounded<TelemetryMessage>(new BoundedChannelOptions(10000)
        {
            FullMode = BoundedChannelFullMode.Wait
        });

        // Create MQTT client using factory
        var factory = new MQTTnet.MqttFactory();
        _mqttClient = factory.CreateMqttClient();

        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
    }

    public async Task StartAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var options = new MqttClientOptionsBuilder()
                .WithClientId(_settings.ClientId)
                .WithTcpServer(_settings.Host, _settings.Port)
                .WithCredentials(_settings.Username, _settings.Password)
                .WithCleanSession()
                .WithProtocolVersion(MQTTnet.Formatter.MqttProtocolVersion.V311)
                .Build();

            _logger.LogInformation("Connecting to MQTT broker at {Host}:{Port}...", _settings.Host, _settings.Port);

            var result = await _mqttClient.ConnectAsync(options, cancellationToken);

            if (result.ResultCode != MqttClientConnectResultCode.Success)
            {
                _logger.LogError("Failed to connect to MQTT broker: {ResultCode}", result.ResultCode);
                throw new Exception($"MQTT connection failed: {result.ResultCode}");
            }

            _logger.LogInformation("Successfully connected to MQTT broker");

            // Subscribe to telemetry topics
            if (_settings.Topics.Length > 0)
            {
                await SubscribeToTopicsAsync(cancellationToken);
            }

            // Set up message handler
            _mqttClient.ApplicationMessageReceivedAsync += HandleMessageAsync;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting MQTT client service");
            throw;
        }
    }

    private async Task SubscribeToTopicsAsync(CancellationToken cancellationToken)
    {
        foreach (var topic in _settings.Topics)
        {
            var topicFilter = new MqttTopicFilterBuilder()
                .WithTopic(topic)
                .Build();

            await _mqttClient.SubscribeAsync(topicFilter, cancellationToken);
            _logger.LogInformation("Subscribed to topic: {Topic}", topic);
        }
    }

    private async Task HandleMessageAsync(MqttApplicationMessageReceivedEventArgs e)
    {
        try
        {
            var topic = e.ApplicationMessage.Topic;
            var payload = e.ApplicationMessage.PayloadSegment;

            _logger.LogDebug("Received message on topic {Topic}", topic);

            // Convert ArraySegment<byte> to string
            var payloadString = Encoding.UTF8.GetString(payload);

            _logger.LogDebug("Payload: {Payload}", payloadString);

            // Parse telemetry data
            var telemetryData = JsonSerializer.Deserialize<TelemetryMessage>(payloadString, _jsonOptions);

            if (telemetryData == null)
            {
                _logger.LogWarning("Failed to deserialize telemetry message from topic {Topic}", topic);
                return;
            }

            // Set raw topic for processing later
            telemetryData.RawTopic = topic;

            // Write to channel (Producer)
            await _channel.Writer.WriteAsync(telemetryData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling MQTT message from topic {Topic}", e.ApplicationMessage.Topic);
        }
    }

    public async Task ProcessQueueAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting telemetry processing queue consumer...");

        try
        {
            await foreach (var message in _channel.Reader.ReadAllAsync(cancellationToken))
            {
                try
                {
                    await SaveTelemetryAsync(message);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing telemetry message from channel");
                }
            }
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("Telemetry processing queue consumer stopped.");
        }
    }

    private async Task SaveTelemetryAsync(TelemetryMessage message)
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        try
        {
            // Extract asset ID from topic (format: telemetry/{assetId})
            var topic = message.RawTopic ?? string.Empty;
            var topicParts = topic.Split('/');
            var assetCode = topicParts.Length > 1 ? topicParts[1] : message.AssetCode ?? "unknown";

            // Find asset by code
            var asset = await dbContext.Assets
                .FirstOrDefaultAsync(a => a.AssetCode == assetCode);

            if (asset == null)
            {
                _logger.LogWarning("Asset with code {AssetCode} not found", assetCode);
                return;
            }

            var telemetry = new Telemetry
            {
                AssetId = asset.Id,
                Temperature = (decimal)message.Temperature,
                Pressure = (decimal)message.Pressure,
                Vibration = (decimal)message.Vibration,
                EdgeTimestamp = message.Timestamp ?? DateTime.UtcNow,
                IngestionTimestamp = DateTime.UtcNow
            };

            dbContext.Telemetries.Add(telemetry);
            await dbContext.SaveChangesAsync();

            _logger.LogInformation("Saved telemetry for asset {AssetCode}: Temp={Temp}°C, EdgeTime={EdgeTime}",
                assetCode, message.Temperature, telemetry.EdgeTimestamp);

            await CheckAlertsAsync(asset, telemetry);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving telemetry data for asset {AssetCode}", message.AssetCode);
        }
    }

    private async Task CheckAlertsAsync(Asset asset, Telemetry telemetry)
    {
        // TODO: Implement alert logic based on thresholds
        // For now, just log if values are outside normal ranges
        if (telemetry.Temperature > 100)
        {
            _logger.LogWarning("High temperature alert for asset {AssetCode}: {Temperature}°C",
                asset.AssetCode, telemetry.Temperature);
        }

        if (telemetry.Pressure > 500)
        {
            _logger.LogWarning("High pressure alert for asset {AssetCode}: {Pressure}PSI",
                asset.AssetCode, telemetry.Pressure);
        }

        if (telemetry.Vibration > 10)
        {
            _logger.LogWarning("High vibration alert for asset {AssetCode}: {Vibration}mm/s",
                asset.AssetCode, telemetry.Vibration);
        }

        await Task.CompletedTask;
    }

    public async Task StopAsync()
    {
        try
        {
            if (_mqttClient.IsConnected)
            {
                await _mqttClient.DisconnectAsync();
                _logger.LogInformation("Disconnected from MQTT broker");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error disconnecting from MQTT broker");
        }
    }

    public async ValueTask DisposeAsync()
    {
        await StopAsync();
        _mqttClient.Dispose();
    }
}

// DTO for MQTT message parsing
public class TelemetryMessage
{
    public string? AssetCode { get; set; }
    public double Temperature { get; set; }
    public double Pressure { get; set; }
    public double Vibration { get; set; }
    public DateTime? Timestamp { get; set; }
    [System.Text.Json.Serialization.JsonIgnore]
    public string? RawTopic { get; set; }
}