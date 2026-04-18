# Technical Change Log: Dashboard Hardening & Stabilization

This document records the major architectural and functional upgrades implemented during the **Stabilization & Digital Twin** phase (April 2026).

---

## 1. Backend: Telemetry History Persistence
- **WHAT**: Implemented `GET /api/v1/assets/{id}/telemetry` and corresponding infrastructure.
- **WHY**: The frontend required historical data to render time-series charts. Standard entity fetching was too heavy for high-frequency telemetry.
- **HOW**: 
    - Created a specialized **Telemetry Repository** to execute optimized SQL queries.
    - Used `AsNoTracking()` and explicit indexing/ordering in EF Core.
    - Added a lightweight `TelemetryHistoryDto` to minimize payload size.

## 2. Frontend: Digital Twin Visualization
- **WHAT**: Created the `AssetGrid` cockpit and the `AssetDigitalTwin` analytics page.
- **WHY**: To provide sub-second visibility into asset health and predictive trend analysis.
- **HOW**:
    - **AssetGrid**: Orchestrates all assets and maintains a **SignalR** link for live status pulses.
    - **History Charts**: Leveraged `recharts` to build smoothed area charts for Temperature, Pressure, and Vibration.
    - **Route Orchestration**: Integrated a dynamic routing pattern `/assets/:id` to handle hundreds of individual asset cockpits.

## 3. Infrastructure: Broker & Build Stabilization
- **WHAT**: Aligned MQTT protocols and resolved environment conflicts.
- **WHY**: Mismatched topic formats between the simulator and backend caused data loss. Missing project paths caused build failures for developers.
- **HOW**:
    - **Protocol Spec**: Standardized topics to `iot/telemetry/{assetCode}` across all layers.
    - **Build Hardening**: Pinned `MQTTnet` versions and corrected startup command paths in the Operating Guide.
    - **DevOps**: Created PowerShell scripts (`db-update.ps1`, `db-migrate.ps1`) to automate complex EF commands.

## 4. Automation: Dynamic Telemetry Simulation
- **WHAT**: Upgraded the simulator to fetch live assets from the Registry.
- **WHY**: Manual asset configuration in the simulator was error-prone and didn't support newly provisioned nodes.
- **HOW**:
    - Implemented **Auto-Discovery**: Simulator calls `GET /api/v1/assets` on startup.
    - Implemented **Staggered Publishing**: Used a round-robin scheduling algorithm to distribute MQTT traffic evenly, preventing CPU spikes.

---

_Project State: **Production Ready (v1.0-Hardened)**_
