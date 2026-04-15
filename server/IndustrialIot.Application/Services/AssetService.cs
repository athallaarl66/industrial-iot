using IndustrialIot.Application.Common;
using IndustrialIot.Application.DTOs.Asset;
using IndustrialIot.Application.Repositories;
using IndustrialIot.Domain.Entities;
using IndustrialIot.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace IndustrialIot.Application.Services;

public class AssetService : IAssetService
{
    private readonly IAssetRepository _assetRepository;
    private readonly ILogger<AssetService> _logger;

    public AssetService(IAssetRepository assetRepository, ILogger<AssetService> logger)
    {
        _assetRepository = assetRepository;
        _logger = logger;
    }

    public async Task<ApiResponse<List<AssetDto>>> GetAllAssetsAsync(CancellationToken cancellationToken = default)
    {
        var assets = await _assetRepository.GetAllAsync(cancellationToken);

        var assetDtos = assets.Select(a => new AssetDto
        {
            Id = a.Id,
            AssetCode = a.AssetCode,
            Name = a.Name,
            Type = a.Type,
            Location = a.Location,
            Status = a.Status.ToString(),
            CreatedAt = a.CreatedAt
        }).ToList();

        return ApiResponse<List<AssetDto>>.Ok(assetDtos, "Berhasil mengambil data seluruh aset.");
    }

    public async Task<ApiResponse<AssetDto>> GetAssetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var asset = await _assetRepository.GetByIdAsync(id, cancellationToken);
        if (asset == null)
            return ApiResponse<AssetDto>.Fail("Aset tidak ditemukan.", "NOT_FOUND");

        var assetDto = new AssetDto
        {
            Id = asset.Id,
            AssetCode = asset.AssetCode,
            Name = asset.Name,
            Type = asset.Type,
            Location = asset.Location,
            Status = asset.Status.ToString(),
            CreatedAt = asset.CreatedAt
        };

        return ApiResponse<AssetDto>.Ok(assetDto);
    }

    public async Task<ApiResponse<AssetDto>> CreateAssetAsync(CreateAssetDto dto, CancellationToken cancellationToken = default)
    {
        try
        {
            var isCodeExists = await _assetRepository.IsCodeExistsAsync(dto.AssetCode, cancellationToken);
            if (isCodeExists)
                return ApiResponse<AssetDto>.Fail($"AssetCode '{dto.AssetCode}' sudah digunakan di sistem.", "DUPLICATE_CODE");

            var newAsset = new Asset
            {
                Id = Guid.NewGuid(),
                AssetCode = dto.AssetCode,
                Name = dto.Name,
                Type = dto.Type,
                Location = dto.Location,
                Status = AssetStatus.Running,
                CreatedAt = DateTime.UtcNow
            };

            await _assetRepository.AddAsync(newAsset, cancellationToken);

            var resultDto = new AssetDto
            {
                Id = newAsset.Id,
                AssetCode = newAsset.AssetCode,
                Name = newAsset.Name,
                Type = newAsset.Type,
                Location = newAsset.Location,
                Status = newAsset.Status.ToString(),
                CreatedAt = newAsset.CreatedAt
            };

            return ApiResponse<AssetDto>.Ok(resultDto, "Aset baru berhasil diregistrasikan.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error saat menyimpan aset baru ke database.");
            throw;
        }
    }

    public async Task<ApiResponse<bool>> DeleteAssetAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var asset = await _assetRepository.GetByIdAsync(id, cancellationToken);
        if (asset == null)
            return ApiResponse<bool>.Fail("Aset tidak ditemukan.", "NOT_FOUND");

        await _assetRepository.DeleteAsync(asset, cancellationToken);
        return ApiResponse<bool>.Ok(true, "Aset berhasil dihapus secara permanen.");
    }
}
