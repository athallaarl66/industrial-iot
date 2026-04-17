using IndustrialIot.Api.Hubs;
using IndustrialIot.Application.DTOs;
using IndustrialIot.Application.Services;
using Microsoft.AspNetCore.SignalR;

namespace IndustrialIot.Api.Services;

public class TelemetryNotifier : ITelemetryNotifier
{
    private readonly IHubContext<TelemetryHub> _hubContext;

    public TelemetryNotifier(IHubContext<TelemetryHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task PublishTelemetryUpdateAsync(TelemetryUpdateDto dto)
    {
        await _hubContext.Clients.Group($"asset-{dto.AssetCode}").SendAsync("TelemetryUpdate", dto);
    }

    public async Task PublishAlertAsync(string assetCode, string message, string severity)
    {
        await _hubContext.Clients.Group($"asset-{assetCode}").SendAsync("AlertUpdate", new
        {
            assetCode,
            message,
            severity
        });
    }
}
