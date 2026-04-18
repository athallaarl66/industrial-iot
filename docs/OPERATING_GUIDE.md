# 📖 Operating Guide: How to use Industrial IoT Core

This guide provides a step-by-step walkthrough for initializing, provisioning, and monitoring assets within the Industrial IoT platform.

---

## Step 1: Initialize the Infrastructure
Before using the dashboard, ensuring the underlying data pipelines and database are operational:
1. **Start Containers**: Ensure your Docker containers (Postgres & MQTT) are running:
   ```bash
   cd infra
   docker-compose up -d
   ```
2. **Start Backend**: Launch the .NET API:
   ```bash
   cd server
   dotnet run --project IndustrialIot.Api
   ```
3. **Start Frontend**: Launch the React dashboard:
   ```bash
   cd apps/web-dashboard
   pnpm dev
   ```

## Step 2: Provision Industrial Assets
1. Open the Dashboard at `http://localhost:5173/assets`.
2. Use the **"Provision Node"** sidebar form to add your first hardware asset.
   - **Schema**: Use a standardized code like `PMP-ZONE-001` (Type-Location-Serial).
   - **Category**: Select the appropriate equipment type (Pump, Valve, etc.).
3. Once authorized, the asset will appear in the **Hardware Inventory** registry with an "Awaiting Uplink" status.

## Step 3: Trigger Live Telemetry via Simulator
To simulate real field activity, use the included Node.js edge simulator:
1. Open a new terminal.
2. Run the simulator script:
   ```bash
   node scripts/mqtt-telemetry-simulator.js
   ```
This script acts as a virtual gateway, sending high-frequency sensor packets (temp, pressure, vibration) to the MQTT broker for each provisioned asset.

## Step 4: Monitor the Command Center
1. Navigate to the **"Command Center"** (Home Dashboard).
2. **Aggregated Health**: Watch the KPI cards update as telemetry flows in:
   - **Running**: Assets operating within safe parameters.
   - **Warning**: Assets showing anomalies (e.g., rising vibration).
   - **Critical**: Assets exceeding safety thresholds (requires immediate attention).
3. **Health Index**: A percentage-based distribution of fleet health.
4. **Active Fleet Deployment**: A visual grid representing your facility's digital twin.
   > [!NOTE]
   > The Fleet Grid is currently a visualization layer placeholder designed for future CAD/GIS integration.

## Step 5: Understanding Alerts
The system continuously monitors telemetry for threshold violations:
1. **Real-time Detection**: The simulator will automatically trigger specific alert states if sensor values exceed pre-defined industrial bounds.
2. **Alert Management Hub**: Navigate to the **Alerts** page to view the centralized feed.
   > [!IMPORTANT]
   > The "Alerts Management" module is currently being provisioned. While backend alerts are being logged, the centralized UI is in "Awaiting Uplink" status.

## Step 6: Decommissioning Assets
When a node is taken offline or moved:
1. Go to the **Asset Registry** page.
2. Locate the asset and click the **Delete/Bin** icon.
3. Confirm the **Termination of Node Synchronization**. This safely removes the asset from the database and closes its specific real-time telemetry route.

---

## 🛠️ Troubleshooting & FAQ

### 1. No data appearing on the Dashboard?
- **Check MQTT Broker**: Ensure the `infra` containers are running (`docker ps`).
- **Check Simulator**: Ensure the `node scripts/mqtt-telemetry-simulator.js` is active and showing "Packet Sent" logs.
- **SignalR Connection**: Refresh the page; the dashboard uses active WebSockets which may timeout if the backend is restarted.

### 2. Assets stuck in "Awaiting Uplink"?
- The asset is created in the database but hasn't received its first telemetry packet yet. Ensure the Simulator is running and the `AssetId` in the simulator matches the one provisioned.

### 3. Backend connection errors?
- Verify the .NET API is running on `https://localhost:7053`. If you changed the port, update the `VITE_API_URL` in `apps/web-dashboard/.env`.

---

> [!TIP]
> Always ensure the Simulator is running if you want to see the Dashboard shift states in real-time. Without active telemetry, the system will maintain its "Last Known State".

