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
using IndustrialIot.Application.DTOs;
using IndustrialIot.Application.Services;
using MQTTnet.Client;
using IndustrialIot.Domain.Enums;
using IndustrialIot.Domain.Models;
using StackExchange.Redis;

namespace IndustrialIot.Infrastructure.Mqtt;

public class MqttClientService : IAsyncDisposable
{
    private readonly IMqttClient _mqttClient;
    private readonly MqttSettings _settings;
    private readonly AlertThresholds _thresholds;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<MqttClientService> _logger;
    private readonly JsonSerializerOptions _jsonOptions;
    private readonly Channel<TelemetryMessage> _channel;
    private readonly IConnectionMultiplexer _redis;

    public MqttClientService(
        IOptions<MqttSettings> settings,
        IOptions<AlertThresholds> thresholds,
        IServiceScopeFactory scopeFactory,
        ILogger<MqttClientService> logger,
        IConnectionMultiplexer redis)
    {
        _settings = settings.Value;
        _thresholds = thresholds.Value;
        _scopeFactory = scopeFactory;
        _logger = logger;
        _redis = redis;

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
            // Extract asset ID from topic (format: iot/telemetry/{assetCode})
            var topic = message.RawTopic ?? string.Empty;
            var topicParts = topic.Split('/');
            var assetCode = topicParts.Length > 2 ? topicParts[2] : message.AssetCode ?? "unknown";

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

            // Cache latest telemetry in Redis
            var db = _redis.GetDatabase();
            var cacheKey = $"telemetry:{assetCode}";
            var cacheValue = JsonSerializer.Serialize(new
            {
                assetCode,
                temperature = telemetry.Temperature,
                pressure = telemetry.Pressure,
                vibration = telemetry.Vibration,
                timestamp = telemetry.EdgeTimestamp,
                status = asset.Status.ToString()
            });
            await db.StringSetAsync(cacheKey, cacheValue, TimeSpan.FromHours(1));

            _logger.LogInformation("Saved telemetry for asset {AssetCode}: Temp={Temp}°C, EdgeTime={EdgeTime}",
                assetCode, message.Temperature, telemetry.EdgeTimestamp);

            await CheckAlertsAsync(asset, telemetry, dbContext);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saving telemetry data for asset {AssetCode}", message.AssetCode);
        }
    }

    private async Task CheckAlertsAsync(Asset asset, Telemetry telemetry, AppDbContext dbContext)
    {
        using var notifierScope = _scopeFactory.CreateScope();
        var notifier = notifierScope.ServiceProvider.GetRequiredService<IndustrialIot.Application.Services.ITelemetryNotifier>();
        var alertService = notifierScope.ServiceProvider.GetRequiredService<IAlertService>();
        
        // DELEGATE BUSINESS LOGIC TO DOMAIN ENTITY (Rich Domain Model)
        var previousStatus = asset.Status;
        var (newStatus, triggeredType, alertMessage, breachedThreshold) = asset.EvaluateHealth(
            telemetry.Temperature, 
            telemetry.Pressure, 
            telemetry.Vibration, 
            _thresholds);

        asset.Status = newStatus;

        // Save updated asset status
        dbContext.Assets.Update(asset);
        await dbContext.SaveChangesAsync();

        if (asset.Status != previousStatus)
        {
            _logger.LogInformation("Asset {AssetCode} status changed from {Old} to {New}", asset.AssetCode, previousStatus, asset.Status);
        }

        // Send telemetry update
        var updateDto = new IndustrialIot.Application.DTOs.TelemetryUpdateDto
        {
            AssetCode = asset.AssetCode,
            Temperature = telemetry.Temperature,
            Pressure = telemetry.Pressure,
            Vibration = telemetry.Vibration,
            Status = asset.Status.ToString(),
            IngestionTimestamp = telemetry.IngestionTimestamp,
            AlertMessage = alertMessage
        };
        await notifier.PublishTelemetryUpdateAsync(updateDto);

        if (triggeredType.HasValue && !string.IsNullOrEmpty(alertMessage) && breachedThreshold.HasValue)
        {
            decimal currentValue = triggeredType.Value switch
            {
                AlertType.Temperature => telemetry.Temperature,
                AlertType.Pressure => telemetry.Pressure,
                _ => telemetry.Vibration
            };

            await alertService.CreateAlertAsync(asset.Id, triggeredType.Value, asset.Status.ToString(), alertMessage, currentValue, breachedThreshold.Value);
        }
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