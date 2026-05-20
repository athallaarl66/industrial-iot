# 📖 Operating Guide: Industrial IoT Core

Welcome to the **Industrial IoT Core** operating manual. This document serves as a comprehensive guide for developers, system operators, and stakeholders to understand, deploy, and demonstrate the platform's capabilities.

---

## 🚀 1. Product Vision & Industry Context

### What is Industrial IoT Core?

**Industrial IoT Core** is a next-generation "Digital Twin" and Asset Intelligence platform. It bridges the gap between raw edge sensor data and high-stakes operational decision-making. By capturing real-time telemetry, the system provides a "Bird's-eye view" of global fleet health.

### 🏭 Industry Verticals

This platform is designed for environments where equipment failure is not an option:

- **🛢️ Oil & Gas (O&G)**: Monitoring offshore drilling rigs, subsea pipelines, and refinery pumps.
- **🏭 Manufacturing**: Tracking the health of assembly line motors, industrial fans, and robotic arms.
- **⛏️ Mining**: Monitoring ventilation systems, heavy-duty conveyor belts, and massive crushing machines.
- **⚡ Renewable Energy**: Tracking vibrations in wind turbine bearings and thermal profiles of solar inverters.

### ⚙️ Example Assets (Nodes)

- **Centrifugal Pumps**: Monitoring vibration, flow rate, and motor temperature to prevent "dry run" failures.
- **Industrial Compressors**: Tracking discharge pressure and power consumption for energy optimization.
- **Electric Motors**: Real-time analysis of torque and bearing health to predict maintenance cycles.

---

## 🏗️ 2. System Architecture

The platform follows a "Decoupled Pillar" architecture:

1.  **The Edge (Simulator)**: Acts as the physical machine. It generates sensor packets (JSON) and sends them via the MQTT protocol.
2.  **The Broker (Mosquitto)**: The "Postal Service" that routes data between the Edge and the Backend.
3.  **The Brain (.NET API)**: Subscribes to telemetry, applies business logic (threshold checks), and persists data to PostgreSQL.
4.  **The Command Center (React UI)**: Displays live health status via **SignalR (WebSockets)** for sub-second synchronization.

---

## 🏁 3. Quick-Start Demo (5-Minute Walkthrough)

To demonstrate the platform to a stakeholder, follow this terminal orchestration:

### Step A: Start the Engine (Infrastructure)

```powershell
# Terminal 1
cd infra
docker-compose up -d
```

### Step B: Launch the Brain & UI

```powershell
# Terminal 2 - Backend
cd server
dotnet run --project IndustrialIot.Api/IndustrialIot.Api.csproj

# Terminal 3 - Frontend
cd apps/web-dashboard
npm run dev
```

> **Action**: Open browser to `http://localhost:5173`.
> 
> **Note**: On first launch, you will be redirected to the login page. Default admin credentials are seeded automatically by the system.

### Step C: Trigger the Simulation

```powershell
# Terminal 4 - Simulation
cd scripts
# Ensure npm packages are installed (dotenv)
npm install
# Start the simulator
node mqtt-telemetry-simulator.js
```

> **Result**: Watch the **Command Center** cards and the **Activity Feed** update automatically as sensor data arrives!
> [!IMPORTANT]
> **Environment Setup**: The simulator now strictly adheres to security rules and requires `MQTT_PASSWORD` to be set. It will automatically load variables from `../infra/.env`. Make sure you have completed the infrastructure setup in Step A.
> 
> **Auto-Discovery**: The simulator fetches assets dynamically. Ensure the **Backend (Brain)** is running before starting the simulator.

---

## 🛠️ 4. Feature Deep-Dive

### 📂 4.1. Asset Provisioning (Registry)

Before a machine can send data, it must be "Provisioned" in the registry:

1.  Navigate to the **Assets** page.
2.  Use the **Provision Node** form to register a new ID (e.g., `PMP-A-001`).
3.  The system will generate a secure identity for the node.

### 📊 4.2. Health Index & KPI Cards

- **🟢 Running**: Machine is healthy and within standard operating baselines.
- **🟡 Warning**: Anomalous data detected (e.g., vibration > 5.0mm/s). Action is recommended.
- **🔴 Critical**: Threshold violation (e.g., temperature > 90°C). Immediate inspection required.

### 📈 4.3. Digital Twin & Analytics Stream

Every asset is paired with its **Digital Twin Dashboard**:

1.  **Selection**: Click on any asset card from the main dashboard.
2.  **Live Telemetry**: View real-time temperature, pressure, and vibration profiles synced via SignalR.
3.  **Historical Trends**: Analyze the last 50 data points using high-fidelity Area Charts. Use this to identify degradation patterns before they trigger a `Critical` status.

### 🛡️ 4.4. Alert Management

The system automatically logs every threshold violation.

> [!NOTE]
> The **Alerts Hub** UI is currently in "Awaiting Uplink" status. While backend alerts are functional and stored in the database, the dedicated management dashboard is being provisioned for the next release.

### 🔐 4.5. Authentication

The platform now requires authentication for accessing the Command Center.

**Login Flow:**
1. Navigate to `http://localhost:5173/login`
2. Enter your credentials
3. Access granted to all protected routes

**User Management:**
- Default admin user is automatically seeded on first startup
- Additional users can be created via the API (Admin role required)
- JWT tokens are used for session management

---

## 💾 5. Database Management

The system uses Entity Framework Core (EF) for schema management. We've provided helper scripts to simplify these operations:

### 🚀 Update Database

Applies all pending migrations to the live PostgreSQL instance.

```powershell
./scripts/db-update.ps1
```

### 🏗️ Create New Migration

Generates a new migration file after you've modified the Domain/Infrastructure models.

```powershell
./scripts/db-migrate.ps1 -Name "DescriptionOfChange"
```

### 🌱 Auto-Seeding

The system automatically seeds the default admin user on first startup via `DatabaseSeeder`. No manual seeding is required.

---

## ⚡ 6. Redis Caching

The platform uses Redis for high-performance telemetry caching and SignalR backplane scaling.

**Requirements:**
- Redis container is included in `docker-compose.yml`
- Port 6379 must be available
- Configured in `appsettings.json` under `Redis:ConnectionString`

**Purpose:**
- Cache latest telemetry per asset for fast retrieval
- Enable SignalR horizontal scaling across multiple backend instances
- Reduce database load for frequently accessed data

---

---

## 🔧 7. Troubleshooting & FAQ

**Q: I don't see any data in the dashboard.**

> **A**: Verify that the Simulator is running. Check the simulator logs for `[MQTT] Packet Sent`. Ensure the Asset ID in the simulator exists in your dashboard's registry.

**Q: The Dashboard says "Disconnected" or "Retrying".**

> **A**: Ensure the .NET Backend is running. The UI relies on a SignalR connection to the API at `https://localhost:7053`.

**Q: Docker containers won't start.**

> **A**: Ensure Port 5433 (Postgres) and Port 1883 (MQTT) are not being used by other local applications.

---

> [!TIP]
> This platform is built for scale. You can run hundreds of simulators simultaneously to test the high-throughput ingestion engine of the .NET backend.
