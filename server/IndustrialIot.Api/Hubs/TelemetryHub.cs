using Microsoft.AspNetCore.SignalR;

namespace IndustrialIot.Api.Hubs;

public class TelemetryHub : Hub
{
    /// <summary>
    /// Client joins asset-specific group for targeted updates
    /// </summary>
    public async Task JoinAsset(string assetCode)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"asset-{assetCode}");
        await Clients.Group($"asset-{assetCode}").SendAsync("JoinedAsset", assetCode);
    }

    /// <summary>
    /// Client leaves asset group
    /// </summary>
    public async Task LeaveAsset(string assetCode)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"asset-{assetCode}");
    }

    /// <summary>
    /// Broadcast to all connected clients (fallback for global alerts)
    /// </summary>
    public async Task SendGlobalAlert(string message)
    {
        await Clients.All.SendAsync("GlobalAlert", message);
    }
}
