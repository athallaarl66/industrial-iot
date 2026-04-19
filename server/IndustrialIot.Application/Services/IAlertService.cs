using IndustrialIot.Application.DTOs.Alert;
using IndustrialIot.Domain.Entities;
using IndustrialIot.Domain.Enums;

namespace IndustrialIot.Application.Services;

public interface IAlertService
{
    Task CreateAlertAsync(Guid assetId, AlertType type, string severity, string message, decimal currentValue, decimal threshold);
    Task<bool> AcknowledgeAlertAsync(Guid id);
    Task<List<Alert>> GetRecentAlertsAsync(int count = 50);
    Task<List<AlertDto>> GetRecentAlertsDtosAsync(int count = 50);
    Task<bool> CheckAndCreateAlertIfNeededAsync(Guid assetId, AlertType type, string severity, string message, decimal currentValue, decimal threshold);
    Task<bool> ResolveAlertAsync(Guid id);
}





