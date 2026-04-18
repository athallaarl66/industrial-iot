using System.Text.Json.Serialization;

namespace IndustrialIot.Application.DTOs.Alert;

public class AlertDto
{
    public Guid Id { get; set; }
    
    public string AssetCode { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    
    public string Type { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    
    [JsonPropertyName("currentValue")]
    public decimal CurrentValue { get; set; }
    
    [JsonPropertyName("threshold")]
    public decimal Threshold { get; set; }
    
    [JsonPropertyName("edgeTimestamp")]
    public DateTime EdgeTimestamp { get; set; }
    
    public bool Acknowledged { get; set; }
    [JsonPropertyName("acknowledgedAt")]
    public DateTime? AcknowledgedAt { get; set; }
    
    public bool Resolved { get; set; }
    [JsonPropertyName("resolvedAt")]
    public DateTime? ResolvedAt { get; set; }
    
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
}

