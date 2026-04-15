# Resolve Critical Gaps in Industrial IoT API

This plan addresses the three critical gaps identified to ensure the API can run correctly and has the necessary foundation for the remaining features.

## User Review Required

> [!WARNING]
> Please review the changes to the `Telemetry` entity. Adding new properties and a foreign key will require generating and applying a new Entity Framework Core migration (`AddTelemetryEnhancements`). Do you want me to run the database migration commands automatically after the code changes?

> [!IMPORTANT]
> For the Swagger XML Comments to work, I will update the `IndustrialIot.Api.csproj` to generate the documentation file. If there are other XML comment warnings, we can suppress them if they get too noisy.

## Proposed Changes

### 1. Repository Implementation
Implement the missing `IAssetRepository` interface and link it to Entity Framework Core.

#### [NEW] [AssetRepository.cs](file:///d:/Projects/industrial-iot/server/IndustrialIot.Infrastructure/Repositories/AssetRepository.cs)
- Implement `GetAllAsync`, `GetByIdAsync`, `IsCodeExistsAsync`, `AddAsync`, and `DeleteAsync`.
- Use `AsNoTracking` for read-only queries to optimize performance.
- Use `AppDbContext`.

### 2. Domain & Infrastructure Updates
Complete the `Telemetry` entity to include industry-standard properties.

#### [MODIFY] [Telemetry.cs](file:///d:/Projects/industrial-iot/server/IndustrialIot.Domain/Entities/Telemetry.cs)
- Add `public Asset? Asset { get; set; }` navigation property.
- Add `public decimal VibrationX { get; set; }`, `VibrationY`, `VibrationZ`.
- Add `public DateTime ReceivedAt { get; set; } = DateTime.UtcNow;`.
- Add `public string DataQuality { get; set; } = "Good";`.
- Add `public string DeviceId { get; set; } = string.Empty;`.

#### [MODIFY] [AppDbContext.cs](file:///d:/Projects/industrial-iot/server/IndustrialIot.Infrastructure/Persistence/AppDbContext.cs)
- Configure precision for the new `Vibration` properties (18, 2).
- Configure the `DataQuality` and `DeviceId` max lengths.
- explicitly configure the `.HasOne(t => t.Asset).WithMany().HasForeignKey(t => t.AssetId)` relationship (if not relying entirely on conventions).

### 3. API Service Registrations
Register all necessary dependencies to resolve runtime errors.

#### [MODIFY] [Program.cs](file:///d:/Projects/industrial-iot/server/IndustrialIot.Api/Program.cs)
- Register `IAssetRepository` to `AssetRepository` (Scoped).
- Register `IAssetService` to `AssetService` (Scoped).
- Add `builder.Services.AddHealthChecks();` and map the endpoint `app.MapHealthChecks("/health");`.
- Enable XML Comments in the Swagger generator configuration.

#### [MODIFY] [IndustrialIot.Api.csproj](file:///d:/Projects/industrial-iot/server/IndustrialIot.Api/IndustrialIot.Api.csproj)
- Add `<GenerateDocumentationFile>true</GenerateDocumentationFile>` to the `<PropertyGroup>` so Swagger can pick up XML comments.

## Open Questions

1. Do you want me to write and apply the `dotnet ef migrations add` command automatically to update the DB for the new `Telemetry` properties?
2. Are you fine with placing `AssetRepository` in `IndustrialIot.Infrastructure/Repositories/` (which exists) rather than `Persistence/` to keep DbContext and Repositories cleanly separated?

## Verification Plan

### Automated Tests
- Run `dotnet build` to ensure the clean architecture layers compile.
- Run `dotnet ef migrations add CompleteTelemetryEntity` to ensure the entity modifications are correctly interpreted by EF.

### Manual Verification
- Start the API and ensure `swagger` launches without DI exceptions.
- Verify `GET /health` returns a healthy status.
- Test hitting an `AssetsController` endpoint to confirm the repository logic runs without runtime instantiation errors.
