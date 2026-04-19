using System.ComponentModel.DataAnnotations;
using IndustrialIot.Domain.Enums;

namespace IndustrialIot.Domain.Entities;

public class Alert
{
    public Guid Id { get; set; }
    
    public Guid AssetId { get; set; }
    public Asset Asset { get; set; } = null!;
    
    public AlertType Type { get; set; } // Temperature, Pressure, Vibration, Connectivity
    public string Severity { get; set; } = string.Empty; // Warning, Critical
    public string Message { get; set; } = string.Empty;
    
    public decimal CurrentValue { get; set; }
    public decimal Threshold { get; set; }
    
    public DateTime EdgeTimestamp { get; set; } = DateTime.UtcNow;
    
    public bool Acknowledged { get; set; } = false;
    public DateTime? AcknowledgedAt { get; set; }
    
    public bool Resolved { get; set; } = false;
    public DateTime? ResolvedAt { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Why: Prevents alert spam - same type/asset within cooldown
    public DateTime LastSentAt { get; set; } = DateTime.UtcNow;
}

