using Microsoft.AspNetCore.Mvc;
using IndustrialIot.Api.Common;
using IndustrialIot.Application.DTOs.Alert;
using IndustrialIot.Application.Services;
using IndustrialIot.Domain.Entities;

namespace IndustrialIot.Api.Controllers;


[ApiController]
[Route("api/v1/[controller]")]
public class AlertsController : ControllerBase
{
    private readonly IAlertService _alertService;

    public AlertsController(IAlertService alertService)
    {
        _alertService = alertService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<AlertDto>>>> GetRecentAlerts([FromQuery] int count = 50)
    {
        var alerts = await _alertService.GetRecentAlerts(count);
        // Map to DTOs (simple manual map for now, can use AutoMapper later)
        var dtos = alerts.Select(a => new AlertDto
        {
            Id = a.Id,
            AssetCode = a.Asset.AssetCode,
            AssetName = a.Asset.Name,
            Type = a.Type,
            Severity = a.Severity,
            Message = a.Message,
            CurrentValue = a.CurrentValue,
            Threshold = a.Threshold,
            EdgeTimestamp = a.EdgeTimestamp,
            Acknowledged = a.Acknowledged,
            AcknowledgedAt = a.AcknowledgedAt,
            Resolved = a.Resolved,
            ResolvedAt = a.ResolvedAt,
            CreatedAt = a.CreatedAt
        }).ToList();

        return Ok(ApiResponse<List<AlertDto>>.Ok(dtos, "Alerts retrieved successfully"));
    }

    [HttpPost("{id}/acknowledge")]

    public async Task<ActionResult<ApiResponse<bool>>> AcknowledgeAlert(Guid id)
    {
        var success = await _alertService.AcknowledgeAlertAsync(id);
        if (!success)
        {
            return NotFound(ApiResponse<bool>.Fail("Alert not found", "NOT_FOUND"));
        }

        return Ok(ApiResponse<bool>.Ok(true, "Alert acknowledged"));
    }
}


}

