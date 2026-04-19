using IndustrialIot.Domain.Enums;
using IndustrialIot.Domain.Models;

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

    /// <summary>
    /// Business Logic: Evaluates the asset health based on telemetry data.
    /// Returns a tuple of (NewStatus, AlertType, AlertMessage) if a threshold is violated.
    /// </summary>
    public (AssetStatus Status, AlertType? TriggeredAlertType, string? AlertMessage) EvaluateHealth(
        decimal temperature, 
        decimal pressure, 
        decimal vibration, 
        AlertThresholds thresholds)
    {
        // 1. Check Temperature
        if (temperature > thresholds.Temperature.Critical)
            return (AssetStatus.Critical, AlertType.Temperature, $"Critical high temperature: {temperature}°C");
        
        if (temperature > thresholds.Temperature.Warning)
            return (AssetStatus.Warning, AlertType.Temperature, $"High temperature: {temperature}°C");

        // 2. Check Pressure
        if (pressure > thresholds.Pressure.Critical)
            return (AssetStatus.Critical, AlertType.Pressure, $"Critical high pressure: {pressure} PSI");
        
        if (pressure > thresholds.Pressure.Warning)
            return (AssetStatus.Warning, AlertType.Pressure, $"High pressure: {pressure} PSI");

        // 3. Check Vibration
        if (vibration > thresholds.Vibration.Critical)
            return (AssetStatus.Critical, AlertType.Vibration, $"Critical high vibration: {vibration} mm/s");
        
        if (vibration > thresholds.Vibration.Warning)
            return (AssetStatus.Warning, AlertType.Vibration, $"High vibration: {vibration} mm/s");

        // 4. All good
        return (AssetStatus.Running, null, null);
    }
}