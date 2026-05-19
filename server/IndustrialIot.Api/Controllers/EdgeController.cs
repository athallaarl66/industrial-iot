using IndustrialIot.Domain.Entities;
using IndustrialIot.Infrastructure.Persistence;
using IndustrialIot.Infrastructure.Mqtt;
using IndustrialIot.Application.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace IndustrialIot.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class EdgeController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly MqttSettings _mqttSettings;

    public EdgeController(AppDbContext context, IOptions<MqttSettings> mqttSettings)
    {
        _context = context;
        _mqttSettings = mqttSettings.Value;
    }

    // =================================================================
    // Webhook Endpoints for Mosquitto mosquitto-go-auth HTTP Backend
    // =================================================================

    /// <summary>
    /// Validates the username and password (token) for MQTT connection.
    /// </summary>
    [HttpPost("auth")]
    [AllowAnonymous]
    public async Task<IActionResult> Authenticate([FromBody] MqttAuthRequest request)
    {
        if (request == null) return BadRequest();

        // 1. Check if it's the backend service
        if (request.Username == _mqttSettings.Username && request.Password == _mqttSettings.Password)
        {
            return Ok(); // Authenticated
        }

        // 2. Check if it's an edge device using a valid active token
        // The token is passed as the password. Username can be the asset code or "edge_device"
        var credential = await _context.EdgeCredentials
            .FirstOrDefaultAsync(c => c.Token == request.Password && c.IsActive);

        if (credential != null)
        {
            return Ok(); // Authenticated
        }

        return Unauthorized();
    }

    /// <summary>
    /// Checks if the MQTT client has superuser privileges.
    /// </summary>
    [HttpPost("superuser")]
    [AllowAnonymous]
    public IActionResult Superuser([FromBody] MqttSuperuserRequest request)
    {
        if (request == null) return BadRequest();

        // backend_service is superuser to bypass ACL checks and read/write all topics
        if (request.Username == _mqttSettings.Username)
        {
            return Ok(); // Is Superuser
        }

        return StatusCode(StatusCodes.Status403Forbidden); // Not Superuser
    }

    /// <summary>
    /// Checks if the MQTT client is authorized to publish or subscribe to a topic.
    /// </summary>
    [HttpPost("acl")]
    [AllowAnonymous]
    public async Task<IActionResult> CheckAcl([FromBody] MqttAclRequest request)
    {
        if (request == null) return BadRequest();

        // 1. Backend service is allowed everything
        if (request.Username == _mqttSettings.Username)
        {
            return Ok(); // Authorized
        }

        // 2. Check edge device permissions
        EdgeCredential? credential = null;

        // Try looking up by Token (if username is the token)
        credential = await _context.EdgeCredentials
            .FirstOrDefaultAsync(c => c.Token == request.Username && c.IsActive);

        // Try looking up by AssetCode (if username is the AssetCode)
        if (credential == null)
        {
            credential = await _context.EdgeCredentials
                .FirstOrDefaultAsync(c => c.AssetCode == request.Username && c.IsActive);
        }

        if (credential == null)
        {
            // If the username is a generic "edge_device", let's check if the client ID contains the asset code or if we can allow it
            if (request.Username == "edge_device")
            {
                // In local development, if they just use "edge_device", allow publishing to telemetry if they have at least one active credential
                var hasAnyActive = await _context.EdgeCredentials.AnyAsync(c => c.IsActive);
                if (hasAnyActive && request.Topic.StartsWith("iot/telemetry/"))
                {
                    return Ok();
                }
            }
            return StatusCode(StatusCodes.Status403Forbidden);
        }

        // We found a valid credential!
        // Now check if they are trying to write (acc = 2) to their specific telemetry topic:
        // Topic format: iot/telemetry/{AssetCode}
        var expectedTelemetryTopic = $"iot/telemetry/{credential.AssetCode}";
        
        // Also allow write to system topics: iot/system/online, iot/system/offline
        if (request.Acc == 2) // Publish/Write
        {
            if (request.Topic == expectedTelemetryTopic || 
                request.Topic == "iot/system/online" || 
                request.Topic == "iot/system/offline" ||
                request.Topic.StartsWith($"iot/system/online/{credential.AssetCode}") ||
                request.Topic.StartsWith($"iot/system/offline/{credential.AssetCode}"))
            {
                return Ok(); // Authorized
            }
        }

        return StatusCode(StatusCodes.Status403Forbidden);
    }

    // =================================================================
    // Provisioning & Management Endpoints (Admin Only)
    // =================================================================

    [HttpGet("credentials")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> GetCredentials()
    {
        var credentials = await _context.EdgeCredentials
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
        return Ok(ApiResponse<object>.Ok(credentials, "Daftar kredensial edge berhasil diambil."));
    }

    [HttpPost("credentials")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> ProvisionCredential([FromBody] ProvisionRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.AssetCode))
        {
            return BadRequest(ApiResponse<object>.Fail("Asset code tidak boleh kosong.", "VALIDATION_ERROR"));
        }

        // Verify asset exists
        var assetExists = await _context.Assets.AnyAsync(a => a.AssetCode == request.AssetCode);
        if (!assetExists)
        {
            return NotFound(ApiResponse<object>.Fail($"Asset dengan kode {request.AssetCode} tidak ditemukan.", "NOT_FOUND"));
        }

        // Generate token: iot_token_xxxxxxxx
        var tokenBytes = new byte[16];
        RandomNumberGenerator.Fill(tokenBytes);
        var token = "iot_token_" + Convert.ToHexString(tokenBytes).ToLower();

        var credential = new EdgeCredential
        {
            Id = Guid.NewGuid(),
            AssetCode = request.AssetCode,
            Token = token,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _context.EdgeCredentials.AddAsync(credential);
        await _context.SaveChangesAsync();

        return Created("", ApiResponse<EdgeCredential>.Ok(credential, "Kredensial edge berhasil diprovisikan."));
    }

    [HttpPost("credentials/{id:guid}/revoke")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> RevokeCredential(Guid id)
    {
        var credential = await _context.EdgeCredentials.FindAsync(id);
        if (credential == null)
        {
            return NotFound(ApiResponse<object>.Fail("Kredensial tidak ditemukan.", "NOT_FOUND"));
        }

        credential.IsActive = false;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<bool>.Ok(true, "Kredensial berhasil dicabut."));
    }
}

public class MqttAuthRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Clientid { get; set; } = string.Empty;
}

public class MqttSuperuserRequest
{
    public string Username { get; set; } = string.Empty;
    public string Clientid { get; set; } = string.Empty;
}

public class MqttAclRequest
{
    public string Username { get; set; } = string.Empty;
    public string Clientid { get; set; } = string.Empty;
    public string Topic { get; set; } = string.Empty;
    public int Acc { get; set; }
}

public class ProvisionRequest
{
    public string AssetCode { get; set; } = string.Empty;
}
