using System;

namespace IndustrialIot.Domain.Entities;

public class EdgeCredential
{
    public Guid Id { get; set; }
    public string AssetCode { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
