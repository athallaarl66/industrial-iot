namespace IndustrialIot.Domain.Enums;

/// <summary>
/// Status operasional dari aset industri.
/// </summary>
public enum AssetStatus
{
    Running = 0,
    Warning = 1,
    Critical = 2,
    Maintenance = 3
}