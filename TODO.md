# Industrial IoT - TODO List

Current Progress: Phases 1-3 Complete. Continuing to Phase 4: Real-Time Updates & Phase 5: Alert System.

## Phase 3 Completion (MQTT)

- [x] Create MQTT simulator/test client for E2E testing

## Phase 4: Real-Time Updates with SignalR (0/8)

1. [ ] Backend: Add NuGet Microsoft.AspNetCore.SignalR to IndustrialIot.Api.csproj
2. [ ] Backend: Create TelemetryHub.cs in Controllers or Hubs folder for broadcasting telemetry/alerts
3. [ ] Backend: Register SignalR in Program.cs, MapHub('/telemetryhub')
4. [ ] Backend: Inject SignalR into MqttClientService.CheckAlertsAsync to send live updates
5. [ ] Backend: Create ITelemetryRepository, TelemetryRepository for querying latest telemetry
6. [ ] Backend: TelemetryController for GET latest telemetry per asset (fallback/polling)
7. [ ] Frontend: npm install @microsoft/signalr types
8. [ ] Frontend: Create signalr.ts service, update Dashboard/AssetList for live metrics/status

## Phase 5: Basic Alert System (0/5)

1. [ ] Domain: Create Alert entity/enum
2. [ ] Infrastructure: Migration + AlertRepository
3. [ ] Application: AlertService, rules config (thresholds per type)
4. [ ] Update CheckAlertsAsync: Create alerts, update asset status, emit via SignalR
5. [ ] Frontend: Alerts list/notification UI

## Follow-up

- Test: docker-compose up -d, dotnet run, npm dev, MQTT sim pub telemetry, verify DB/SignalR/UI updates
- Update PROJECT_CHECKLIST.md after each phase

First step completed: TODO.md created.
