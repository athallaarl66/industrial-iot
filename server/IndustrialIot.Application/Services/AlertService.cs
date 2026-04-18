using IndustrialIot.Application.Repositories;
using IndustrialIot.Application.Services;
using IndustrialIot.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace IndustrialIot.Application.Services;

public class AlertService : IAlertService
{
    private readonly IAlertRepository _alertRepository;
    private readonly IAssetRepository _assetRepository;
    private readonly ILogger<AlertService> _logger;

    public AlertService(
        IAlertRepository alertRepository,
        IAssetRepository assetRepository,
        ILogger<AlertService> logger)
    {
        _alertRepository = alertRepository;
        _assetRepository = assetRepository;
        _logger = logger;
    }

    public async Task CreateAlertAsync(Guid assetId, string type, string severity, string message, decimal currentValue, decimal threshold)
    {
        // Check for recent duplicate (dedupe logic - why: prevent spam on continuous threshold breach)
        var lastAlert = await _alertRepository.GetLastAlertAsync(assetId, type);
        if (lastAlert != null && 
            (DateTime.UtcNow - lastAlert.LastSentAt).TotalMinutes < 5 && // 5min cooldown
            lastAlert.Severity == severity)
        {
            _logger.LogInformation("Duplicate alert skipped for asset {AssetId}, type {Type}", assetId, type);
            return;
        }

        var alert = new Alert
        {
            Id = Guid.NewGuid(),
            AssetId = assetId,
            Type = type,
            Severity = severity,
            Message = message,
            CurrentValue = currentValue,
            Threshold = threshold,
            EdgeTimestamp = DateTime.UtcNow,
            LastSentAt = DateTime.UtcNow
        };

        await _alertRepository.AddAsync(alert);
        _logger.LogInformation("Created alert {AlertId} for asset {AssetId}: {Severity} {Type}", alert.Id, assetId, severity, type);
    }

    public async Task<List<Alert>> GetActiveAlertsAsync(Guid assetId)
    {
        return await _alertRepository.GetActiveAlertsAsync(assetId);
    }


    public async Task<bool> AcknowledgeAlertAsync(Guid id)
    {
        return await _alertRepository.AcknowledgeAsync(id, DateTime.UtcNow);
    }

    public async Task<List<Alert>> GetActiveAlertsAsync(Guid assetId)
    {
        return await _alertRepository.GetActiveAlertsAsync(assetId);
    }

    public async Task<List<Alert>> GetRecentAlertsAsync(int count = 50)
    {
        return await _alertRepository.GetRecentAlertsAsync(count);
    }
}

