namespace IndustrialIot.Domain.Models;

public class AlertThresholds
{
    public const string SectionName = "AlertThresholds";

    public ThresholdLevel Temperature { get; set; } = new();
    public ThresholdLevel Pressure { get; set; } = new();
    public ThresholdLevel Vibration { get; set; } = new();
}

public class ThresholdLevel
{
    public decimal Warning { get; set; }
    public decimal Critical { get; set; }
}
