using IndustrialIot.Application.Repositories;
using IndustrialIot.Domain.Entities;
using IndustrialIot.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace IndustrialIot.Infrastructure.Repositories;

public class TelemetryRepository : ITelemetryRepository
{
    private readonly AppDbContext _context;

    public TelemetryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Telemetry>> GetHistoryByAssetIdAsync(Guid assetId, int limit, CancellationToken cancellationToken = default)
    {
        return await _context.Telemetries
            .AsNoTracking() // Performance per ADR-001
            .Where(t => t.AssetId == assetId)
            .OrderByDescending(t => t.EdgeTimestamp) // Key index per ADR-001/Architecture
            .Take(limit)
            .ToListAsync(cancellationToken);
    }
}
