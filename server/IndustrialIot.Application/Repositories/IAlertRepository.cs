using IndustrialIot.Domain.Entities;

namespace IndustrialIot.Application.Repositories;

public interface IAlertRepository
{
    Task<Alert?> GetByIdAsync(Guid id);
    Task<List<Alert>> GetActiveAlertsAsync(Guid assetId);
    Task<List<Alert>> GetRecentAlertsAsync(int count = 50);
    Task<Alert?> GetLastAlertAsync(Guid assetId, string type);
    Task AddAsync(Alert alert);
    Task UpdateAsync(Alert alert);
    Task<bool> AcknowledgeAsync(Guid id, DateTime acknowledgedAt);
}

