using FluentValidation;
using IndustrialIot.Application.Common;
using IndustrialIot.Application.DTOs.Auth;
using IndustrialIot.Application.Common.Security;
using IndustrialIot.Application.Services;
using IndustrialIot.Domain.Entities;
using IndustrialIot.Domain.Enums;
using IndustrialIot.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace IndustrialIot.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly JwtOptions _jwtOptions;
    private readonly IValidator<LoginRequest> _loginValidator;
    private readonly IValidator<RegisterRequest> _registerValidator;

    public AuthController(
        AppDbContext context,
        IEmailService emailService,
        IOptions<JwtOptions> jwtOptions,
        IValidator<LoginRequest> loginValidator,
        IValidator<RegisterRequest> registerValidator)
    {
        _context = context;
        _emailService = emailService;
        _jwtOptions = jwtOptions.Value;
        _loginValidator = loginValidator;
        _registerValidator = registerValidator;
    }

    /// <summary>
    /// Melakukan autentikasi pengguna dan mengembalikan JWT token.
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<AuthResponse>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        // 1. Validasi input
        var validationResult = await _loginValidator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
            return BadRequest(ApiResponse<AuthResponse>.Fail(errors, "VALIDATION_ERROR"));
        }

        // 2. Cari pengguna berdasarkan username
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Username == request.Username, cancellationToken);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(ApiResponse<AuthResponse>.Fail("Username atau password salah.", "UNAUTHORIZED"));
        }

        // 3. Buat JWT Token
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_jwtOptions.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(_jwtOptions.ExpiryHours),
            Issuer = _jwtOptions.Issuer,
            Audience = _jwtOptions.Audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        // 4. Update data login terakhir
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);

        var authResponse = new AuthResponse
        {
            Token = tokenString,
            Username = user.Username,
            Role = user.Role.ToString()
        };

        return Ok(ApiResponse<AuthResponse>.Ok(authResponse, "Login berhasil."));
    }

    /// <summary>
    /// Mendaftarkan pengguna baru (Operator atau Admin baru).
    /// Khusus diakses oleh Admin. OTP dan Kredensial akan dicetak ke Console logs.
    /// </summary>
    [HttpPost("register")]
    [Authorize(Policy = "AdminOnly")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        // 1. Validasi input
        var validationResult = await _registerValidator.ValidateAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
            return BadRequest(ApiResponse<string>.Fail(errors, "VALIDATION_ERROR"));
        }

        // 2. Cek apakah username sudah terpakai
        var userExists = await _context.Users.AnyAsync(u => u.Username == request.Username, cancellationToken);
        if (userExists)
        {
            return BadRequest(ApiResponse<string>.Fail("Username sudah digunakan.", "USERNAME_ALREADY_TAKEN"));
        }

        // 3. Generate OTP Code 6-digit secara acak
        var random = new Random();
        var otpCode = random.Next(100000, 999999).ToString();

        var newUser = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            OtpCode = otpCode,
            OtpExpiredAt = DateTime.UtcNow.AddMinutes(15),
            CreatedAt = DateTime.UtcNow
        };

        await _context.Users.AddAsync(newUser, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        // 4. Kirim notifikasi kredensial & OTP melalui Console Mock Mailer
        var emailSubject = "Kredensial Akun Monitoring IoT Anda";
        var emailBody = 
            $"Halo {request.Username},\n\n" +
            $"Akun Anda telah berhasil dibuat oleh Administrator.\n" +
            $"Berikut kredensial login Anda:\n" +
            $"- Username: {request.Username}\n" +
            $"- Temporary Password: {request.Password}\n" +
            $"- Akses Role: {request.Role}\n\n" +
            $"Gunakan KODE OTP berikut untuk verifikasi awal login Anda:\n" +
            $"KODE OTP: {otpCode} (Berlaku 15 menit)\n\n" +
            $"Terima kasih,\nTim Enterprise IoT Admin";

        await _emailService.SendEmailAsync(request.Email, emailSubject, emailBody);

        return CreatedAtAction(nameof(Login), null, ApiResponse<string>.Ok(
            $"Pendaftaran user {request.Username} sukses. Kredensial & OTP telah dikirim ke Log Konsol Backend.",
            "Registrasi berhasil."));
    }
}
