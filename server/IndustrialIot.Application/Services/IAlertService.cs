using IndustrialIot.Domain.Entities;

namespace IndustrialIot.Application.Services;

public interface IAlertService
{
    Task CreateAlertAsync(Guid assetId, string type, string severity, string message, decimal currentValue, decimal threshold);
    Task<bool> AcknowledgeAlertAsync(Guid id);
    Task<List<Alert>> GetActiveAlertsAsync(Guid assetId);
    Task<List<Alert>> GetRecentAlertsAsync(int count = 50);
}


