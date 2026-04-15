using IndustrialIot.Application.Repositories;
using IndustrialIot.Domain.Entities;
using IndustrialIot.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace IndustrialIot.Infrastructure.Repositories;

public class AssetRepository : IAssetRepository
{
    private readonly AppDbContext _context;

    public AssetRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Asset>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        // Menggunakan AsNoTracking untuk operasi read-only agar EF Core lebih efisien dan hemat memori
        return await _context.Assets
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<Asset?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Assets.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<bool> IsCodeExistsAsync(string assetCode, CancellationToken cancellationToken = default)
    {
        return await _context.Assets
            .AsNoTracking()
            .AnyAsync(a => a.AssetCode == assetCode, cancellationToken);
    }

    public async Task AddAsync(Asset asset, CancellationToken cancellationToken = default)
    {
        await _context.Assets.AddAsync(asset, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Asset asset, CancellationToken cancellationToken = default)
    {
        _context.Assets.Remove(asset);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
