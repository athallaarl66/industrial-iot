using IndustrialIot.Application.Common;
using IndustrialIot.Application.DTOs.Asset;

namespace IndustrialIot.Application.Services;

public interface IAssetService
{
    Task<ApiResponse<List<AssetDto>>> GetAllAssetsAsync(CancellationToken cancellationToken = default);
    Task<ApiResponse<AssetDto>> GetAssetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ApiResponse<AssetDto>> CreateAssetAsync(CreateAssetDto dto, CancellationToken cancellationToken = default);
    Task<ApiResponse<bool>> DeleteAssetAsync(Guid id, CancellationToken cancellationToken = default);
}
