using FluentValidation;
using IndustrialIot.Application.Common;
using IndustrialIot.Application.DTOs.Asset;
using IndustrialIot.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace IndustrialIot.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AssetsController : ControllerBase
{
    private readonly IAssetService _assetService;
    private readonly IValidator<CreateAssetDto> _createAssetValidator;

    public AssetsController(IAssetService assetService, IValidator<CreateAssetDto> createAssetValidator)
    {
        _assetService = assetService;
        _createAssetValidator = createAssetValidator;
    }

    /// <summary>
    /// Mengambil semua daftar master Asset O&G di sistem.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<AssetDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllAssets(CancellationToken cancellationToken)
    {
        var response = await _assetService.GetAllAssetsAsync(cancellationToken);
        return Ok(response);
    }

    /// <summary>
    /// Mengambil data Asset spesifik berdasarkan Id.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<AssetDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<AssetDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAssetById(Guid id, CancellationToken cancellationToken)
    {
        var response = await _assetService.GetAssetByIdAsync(id, cancellationToken);
        if (!response.Success) return NotFound(response);
        
        return Ok(response);
    }

    /// <summary>
    /// Mendaftarkan Asset/Mesin baru ke dalam sistem.
    /// Menerapkan validasi O&G Naming Convention.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<AssetDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<AssetDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsset([FromBody] CreateAssetDto dto, CancellationToken cancellationToken)
    {
        // Zero Trust Validation
        var validationResult = await _createAssetValidator.ValidateAsync(dto, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
            return BadRequest(ApiResponse<AssetDto>.Fail(errors, "VALIDATION_ERROR"));
        }

        var response = await _assetService.CreateAssetAsync(dto, cancellationToken);
        if (!response.Success)
            return BadRequest(response); // Contoh kegagalan: AssetCode duplicate.

        return CreatedAtAction(nameof(GetAssetById), new { id = response.Data?.Id }, response);
    }

    /// <summary>
    /// Menghapus secara hardware data Asset dari sistem.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAsset(Guid id, CancellationToken cancellationToken)
    {
        var response = await _assetService.DeleteAssetAsync(id, cancellationToken);
        if (!response.Success) return NotFound(response);

        return Ok(response);
    }
}
