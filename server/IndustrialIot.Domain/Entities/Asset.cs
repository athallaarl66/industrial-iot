using IndustrialIot.Domain.Enums;

namespace IndustrialIot.Domain.Entities;

public class Asset
{
    public Guid Id { get; set; }
    public string AssetCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public AssetStatus Status { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}