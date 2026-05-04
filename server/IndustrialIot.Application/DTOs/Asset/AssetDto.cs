using IndustrialIot.Domain.Enums;

namespace IndustrialIot.Application.DTOs.Asset;

public class AssetDto
{
    public Guid Id { get; set; }
    public string AssetCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Diubah jadi string untuk frontend
    public DateTime CreatedAt { get; set; }
    
    public decimal? WarningTemperature { get; set; }
    public decimal? CriticalTemperature { get; set; }
    public decimal? WarningPressure { get; set; }
    public decimal? CriticalPressure { get; set; }
    public decimal? WarningVibration { get; set; }
    public decimal? CriticalVibration { get; set; }
}

public class CreateAssetDto
{
    public string AssetCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;

    public decimal? WarningTemperature { get; set; }
    public decimal? CriticalTemperature { get; set; }
    public decimal? WarningPressure { get; set; }
    public decimal? CriticalPressure { get; set; }
    public decimal? WarningVibration { get; set; }
    public decimal? CriticalVibration { get; set; }
}
