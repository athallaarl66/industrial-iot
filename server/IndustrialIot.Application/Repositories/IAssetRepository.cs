using IndustrialIot.Domain.Entities;

namespace IndustrialIot.Application.Repositories;

public interface IAssetRepository
{
    Task<List<Asset>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Asset?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> IsCodeExistsAsync(string assetCode, CancellationToken cancellationToken = default);
    Task AddAsync(Asset asset, CancellationToken cancellationToken = default);
    Task DeleteAsync(Asset asset, CancellationToken cancellationToken = default);
}
