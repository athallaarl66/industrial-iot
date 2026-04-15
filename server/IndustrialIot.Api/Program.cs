using System.Text.Json;
using FluentValidation;
using IndustrialIot.Application.Repositories;
using IndustrialIot.Application.Services;
using IndustrialIot.Application.Validators;
using IndustrialIot.Infrastructure.Mqtt;
using IndustrialIot.Infrastructure.Persistence;
using IndustrialIot.Infrastructure.Repositories;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

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

// 3. Register Application Services & FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<CreateAssetValidator>();

// Register Repositories
builder.Services.AddScoped<IAssetRepository, AssetRepository>();

// Register Services
builder.Services.AddScoped<IAssetService, AssetService>();

// Register MQTT Services
builder.Services.Configure<MqttSettings>(
    builder.Configuration.GetSection(MqttSettings.SectionName));
builder.Services.AddSingleton<MqttClientService>();
builder.Services.AddHostedService<MqttBackgroundService>();

// Add Health Checks
builder.Services.AddHealthChecks();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

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
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();