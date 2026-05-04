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

    // Custom Thresholds (Optional)
    public decimal? WarningTemperature { get; set; }
    public decimal? CriticalTemperature { get; set; }
    public decimal? WarningPressure { get; set; }
    public decimal? CriticalPressure { get; set; }
    public decimal? WarningVibration { get; set; }
    public decimal? CriticalVibration { get; set; }

    /// <summary>
    /// Business Logic: Evaluates the asset health based on telemetry data.
    /// Returns a tuple of (NewStatus, AlertType, AlertMessage) if a threshold is violated.
    /// </summary>
    public (AssetStatus Status, AlertType? TriggeredAlertType, string? AlertMessage, decimal? BreachedThreshold) EvaluateHealth(
        decimal temperature, 
        decimal pressure, 
        decimal vibration, 
        AlertThresholds thresholds)
    {
        // 1. Check Temperature
        decimal critTemp = CriticalTemperature ?? thresholds.Temperature.Critical;
        decimal warnTemp = WarningTemperature ?? thresholds.Temperature.Warning;

        if (temperature > critTemp)
            return (AssetStatus.Critical, AlertType.Temperature, $"Critical high temperature: {temperature}°C", critTemp);
        
        if (temperature > warnTemp)
            return (AssetStatus.Warning, AlertType.Temperature, $"High temperature: {temperature}°C", warnTemp);

        // 2. Check Pressure
        decimal critPress = CriticalPressure ?? thresholds.Pressure.Critical;
        decimal warnPress = WarningPressure ?? thresholds.Pressure.Warning;

        if (pressure > critPress)
            return (AssetStatus.Critical, AlertType.Pressure, $"Critical high pressure: {pressure} PSI", critPress);
        
        if (pressure > warnPress)
            return (AssetStatus.Warning, AlertType.Pressure, $"High pressure: {pressure} PSI", warnPress);

        // 3. Check Vibration
        decimal critVib = CriticalVibration ?? thresholds.Vibration.Critical;
        decimal warnVib = WarningVibration ?? thresholds.Vibration.Warning;

        if (vibration > critVib)
            return (AssetStatus.Critical, AlertType.Vibration, $"Critical high vibration: {vibration} mm/s", critVib);
        
        if (vibration > warnVib)
            return (AssetStatus.Warning, AlertType.Vibration, $"High vibration: {vibration} mm/s", warnVib);

        // 4. All good
        return (AssetStatus.Running, null, null, null);
    }
}