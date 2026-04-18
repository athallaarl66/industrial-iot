using IndustrialIot.Application.Repositories;
using IndustrialIot.Domain.Entities;
using IndustrialIot.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace IndustrialIot.Infrastructure.Repositories;

public class AlertRepository : IAlertRepository
{
    private readonly AppDbContext _context;

    public AlertRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Alert?> GetByIdAsync(Guid id)
    {
        return await _context.Alerts.FindAsync(id);
    }

    public async Task<List<Alert>> GetActiveAlertsAsync(Guid assetId)
    {
        return await _context.Alerts
            .Where(a => a.AssetId == assetId && !a.Acknowledged)
            .OrderByDescending(a => a.EdgeTimestamp)
            .ToListAsync();
    }

    public async Task<List<Alert>> GetRecentAlertsAsync(int count = 50)
    {
return await _context.Alerts
            .Include(a => a.Asset)
            .Where(a => !a.Resolved)
            .OrderByDescending(a => a.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<Alert?> GetLastAlertAsync(Guid assetId, string type)
    {
        return await _context.Alerts
            .Where(a => a.AssetId == assetId && a.Type == type)
            .OrderByDescending(a => a.EdgeTimestamp)
            .FirstOrDefaultAsync();
    }

    public async Task AddAsync(Alert alert)
    {
        _context.Alerts.Add(alert);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Alert alert)
    {
        _context.Alerts.Update(alert);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> AcknowledgeAsync(Guid id, DateTime acknowledgedAt)
    {
        var alert = await GetByIdAsync(id);
        if (alert == null) return false;

        alert.Acknowledged = true;
        alert.AcknowledgedAt = acknowledgedAt;
        await UpdateAsync(alert);

        return true;
    }
}

