namespace IndustrialIot.Application.Services;

using IndustrialIot.Application.DTOs;

public interface ITelemetryNotifier
{
    Task PublishTelemetryUpdateAsync(TelemetryUpdateDto dto);
    Task PublishAlertAsync(string assetCode, string message, string severity);
}
