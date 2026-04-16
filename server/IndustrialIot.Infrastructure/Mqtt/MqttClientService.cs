using System.Text;
using System.Text.Json;
using IndustrialIot.Domain.Entities;
using IndustrialIot.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MQTTnet;

namespace IndustrialIot.Infrastructure.Mqtt;

public class MqttClientService : IAsyncDisposable
{
    private readonly IMqttClient _mqttClient;
    private readonly MqttSettings _settings;
    private readonly AppDbContext _dbContext;
    private readonly ILogger<MqttClientService> _logger;
    private readonly JsonSerializerOptions _jsonOptions;

    public MqttClientService(
        IOptions<MqttSettings> settings,
        AppDbContext dbContext,
        ILogger<MqttClientService> logger)
    {
        _settings = settings.Value;
        _dbContext = dbContext;
        _logger = logger;

        // Create MQTT client using factory
        var factory = new MqttFactory();
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
            var payloadSegment = e.ApplicationMessage.Payload;

            _logger.LogDebug("Received message on topic {Topic}", topic);

            // Convert ReadOnlySequence<byte> to string
            var payloadString = string.Empty;
            if (payloadSegment.IsSingleSegment)
            {
                // Fast path for single segment
                payloadString = Encoding.UTF8.GetString(payloadSegment.FirstSpan);
            }
            else
            {
                // Slow path for multiple segments
                var payloadArray = new byte[payloadSegment.Length];
                payloadSegment.CopyTo(payloadArray);
                payloadString = Encoding.UTF8.GetString(payloadArray);
            }

            _logger.LogDebug("Payload: {Payload}", payloadString);

            // Parse telemetry data
            var telemetryData = JsonSerializer.Deserialize<TelemetryMessage>(payloadString, _jsonOptions);

            if (telemetryData == null)
            {
                _logger.LogWarning("Failed to deserialize telemetry message from topic {Topic}", topic);
                return;
            }

            // Save to database
            await SaveTelemetryAsync(telemetryData, topic);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling MQTT message from topic {Topic}", e.ApplicationMessage.Topic);
        }
    }

    private async Task SaveTelemetryAsync(TelemetryMessage message, string topic)
    {
        try
        {
            // Extract asset ID from topic (format: telemetry/{assetId})
            var topicParts = topic.Split('/');
            var assetCode = topicParts.Length > 1 ? topicParts[1] : message.AssetCode ?? "unknown";

            // Find asset by code
            var asset = await _dbContext.Assets
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
                Timestamp = message.Timestamp.HasValue ? message.Timestamp.Value : DateTime.UtcNow
            };

            _dbContext.Telemetries.Add(telemetry);
            await _dbContext.SaveChangesAsync();

            _logger.LogInformation("Saved telemetry for asset {AssetCode}: Temp={Temp}°C, Pressure={Pressure}PSI, Vibration={Vibration}mm/s",
                assetCode, message.Temperature, message.Pressure, message.Vibration);

            // TODO: Implement alert checking and real-time notification
            await CheckAlertsAsync(asset, telemetry);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving telemetry data");
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
}