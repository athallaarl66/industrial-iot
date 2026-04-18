using IndustrialIot.Domain.Entities;

namespace IndustrialIot.Application.Repositories;

public interface ITelemetryRepository
{
    Task<List<Telemetry>> GetHistoryByAssetIdAsync(Guid assetId, int limit, CancellationToken cancellationToken = default);
}
