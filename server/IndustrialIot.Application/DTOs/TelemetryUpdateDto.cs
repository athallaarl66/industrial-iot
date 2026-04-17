namespace IndustrialIot.Application.DTOs;

public class TelemetryUpdateDto
{
    public string AssetCode { get; set; } = string.Empty;
    public decimal Temperature { get; set; }
    public decimal Pressure { get; set; }
    public decimal Vibration { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime IngestionTimestamp { get; set; }
    public string? AlertMessage { get; set; }
}
