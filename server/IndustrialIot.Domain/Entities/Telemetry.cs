namespace IndustrialIot.Domain.Entities;

public class Telemetry
{
    public long Id { get; set; }
    public Guid AssetId { get; set; }
    public decimal Temperature { get; set; }
    public decimal Pressure { get; set; }
    public DateTime Timestamp { get; set; }
}