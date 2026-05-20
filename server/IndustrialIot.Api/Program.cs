using System.Text.Json;
using FluentValidation;
using IndustrialIot.Application.Repositories;
using IndustrialIot.Application.Services;
using IndustrialIot.Application.Validators;
using IndustrialIot.Infrastructure.Mqtt;
using IndustrialIot.Infrastructure.Persistence;
using IndustrialIot.Infrastructure.Repositories;
using IndustrialIot.Infrastructure.Services;
using IndustrialIot.Domain.Models;
using IndustrialIot.Domain.Enums;
using IndustrialIot.Application.Common.Security;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using System.Text;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// 1. Setup Database Connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// 2. Setup CORS (Zero Trust - Hanya izinkan Frontend React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // React Dev Server
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Penting untuk SignalR nanti
    });
});

// 2.5 Setup JWT & Authentication & Authorization
var jwtSection = builder.Configuration.GetSection(JwtOptions.SectionName);
builder.Services.Configure<JwtOptions>(jwtSection);
var jwtOptions = jwtSection.Get<JwtOptions>();

if (jwtOptions == null || string.IsNullOrEmpty(jwtOptions.Secret))
{
    throw new InvalidOperationException("JWT Secret is not configured.");
}

var key = Encoding.ASCII.GetBytes(jwtOptions.Secret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Dev environment
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtOptions.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtOptions.Audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
    
    // Konfigurasi SignalR JWT Auth (handshake WebSocket)
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/telemetryhub"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => 
        policy.RequireRole(UserRole.Admin.ToString()));
    options.AddPolicy("OperatorOrAdmin", policy => 
        policy.RequireRole(UserRole.Admin.ToString(), UserRole.Operator.ToString()));
});

// 3. Register Application Services & FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<CreateAssetValidator>();

// Register Repositories
builder.Services.AddScoped<IAssetRepository, AssetRepository>();
builder.Services.AddScoped<IAlertRepository, AlertRepository>();
builder.Services.AddScoped<ITelemetryRepository, TelemetryRepository>();

// Register Services
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IAlertService, AlertService>();
builder.Services.AddScoped<IndustrialIot.Application.Services.ITelemetryNotifier, IndustrialIot.Api.Services.TelemetryNotifier>();
builder.Services.AddScoped<IEmailService, ConsoleEmailService>();


// Register MQTT Services
builder.Services.Configure<MqttSettings>(
    builder.Configuration.GetSection(MqttSettings.SectionName));
builder.Services.Configure<AlertThresholds>(
    builder.Configuration.GetSection(AlertThresholds.SectionName));
builder.Services.AddSingleton<MqttClientService>();
builder.Services.AddHostedService<MqttBackgroundService>();

// Register Redis
var redisConnectionString = builder.Configuration.GetSection("Redis:ConnectionString").Value;
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    return ConnectionMultiplexer.Connect(redisConnectionString ?? "localhost:6379");
});

// Add Health Checks
builder.Services.AddHealthChecks();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSignalR().AddStackExchangeRedis(redisConnectionString ?? "localhost:6379");

// 4. Setup Swagger Documentation
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Industrial IoT API", Version = "v1" });
});

var app = builder.Build();

// 5. Global Exception Handler (Mencegah expose DB Error ke Client)
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var exception = exceptionHandlerPathFeature?.Error;

        var response = new 
        {
            success = false,
            message = "Terjadi kesalahan internal pada server.",
            errorCode = "INTERNAL_SERVER_ERROR",
            data = (object?)null
        };

        // Di Production, kita tidak mengirim stack trace, tapi me-log exception menggunakan Serilog.
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    });
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("FrontendCorsPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

app.MapHub<IndustrialIot.Api.Hubs.TelemetryHub>("/telemetryhub");

// 6. Automatic Database Migration & Seeding
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        await DatabaseSeeder.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Terjadi kesalahan saat memigrasikan atau melakukan seeding database.");
    }
}

app.Run();

