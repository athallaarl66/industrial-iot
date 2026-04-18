namespace IndustrialIot.Application.DTOs.Telemetry;

public class TelemetryHistoryDto
{
    public decimal Temperature { get; set; }
    public decimal Pressure { get; set; }
    public decimal Vibration { get; set; }
    public DateTime Timestamp { get; set; } // UTC per ADR-009
}
