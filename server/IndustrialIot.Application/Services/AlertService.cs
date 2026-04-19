using IndustrialIot.Application.DTOs.Alert;
using IndustrialIot.Application.Repositories;
using IndustrialIot.Application.Services;
using IndustrialIot.Domain.Entities;
using IndustrialIot.Domain.Enums;
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

    public async Task CreateAlertAsync(Guid assetId, AlertType type, string severity, string message, decimal currentValue, decimal threshold)
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

    public async Task<bool> AcknowledgeAlertAsync(Guid id)
    {
        return await _alertRepository.AcknowledgeAsync(id, DateTime.UtcNow);
    }

    public async Task<List<Alert>> GetRecentAlertsAsync(int count = 50)
    {
        return await _alertRepository.GetRecentAlertsAsync(count);
    }

    public async Task<List<AlertDto>> GetRecentAlertsDtosAsync(int count = 50)
    {
        var alerts = await _alertRepository.GetRecentAlertsAsync(count);
        return alerts.Select(a => new AlertDto
        {
            Id = a.Id,
            AssetCode = a.Asset.AssetCode,
            AssetName = a.Asset.Name,
            Type = a.Type.ToString(),
            Severity = a.Severity,
            Message = a.Message,
            CurrentValue = a.CurrentValue,
            Threshold = a.Threshold,
            EdgeTimestamp = a.EdgeTimestamp,
            Acknowledged = a.Acknowledged,
            AcknowledgedAt = a.AcknowledgedAt,
            Resolved = a.Resolved,
            ResolvedAt = a.ResolvedAt,
            CreatedAt = a.CreatedAt
        }).ToList();
    }

    // Checks if threshold breached and creates alert if cooldown passed
    public async Task<bool> CheckAndCreateAlertIfNeededAsync(Guid assetId, AlertType type, string severity, string message, decimal currentValue, decimal threshold)
    {
        var lastAlert = await _alertRepository.GetLastAlertAsync(assetId, type);
        if (lastAlert != null && 
            (DateTime.UtcNow - lastAlert.LastSentAt).TotalMinutes < 5)
        {
            _logger.LogInformation("Alert cooldown active for {AssetId}/{Type}", assetId, type);
            return false;
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
            LastSentAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow
        };

        await _alertRepository.AddAsync(alert);
        _logger.LogInformation("Alert created {AlertId} for {AssetId}: {Severity} {Type}", alert.Id, assetId, severity, type);
        return true;
    }

    public async Task<bool> ResolveAlertAsync(Guid id)
    {
        var alert = await _alertRepository.GetByIdAsync(id);
        if (alert == null) return false;

        alert.Resolved = true;
        alert.ResolvedAt = DateTime.UtcNow;
        await _alertRepository.UpdateAsync(alert);
        _logger.LogInformation("Alert {AlertId} resolved", id);
        return true;
    }
}

