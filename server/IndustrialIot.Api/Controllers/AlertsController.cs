using Microsoft.AspNetCore.Mvc;
using IndustrialIot.Application.Common;
using IndustrialIot.Application.DTOs.Alert;
using IndustrialIot.Application.Services;

using Microsoft.AspNetCore.Authorization;

namespace IndustrialIot.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize(Policy = "OperatorOrAdmin")]
public class AlertsController : ControllerBase
{
    private readonly IAlertService _alertService;

    public AlertsController(IAlertService alertService)
    {
        _alertService = alertService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<AlertDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRecentAlerts([FromQuery] int count = 50)
    {
        var dtos = await _alertService.GetRecentAlertsDtosAsync(count);
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
