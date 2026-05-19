const mqtt = require("mqtt");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../infra/.env") });

// Parse command line arguments
const args = process.argv.slice(2);
const assetArgIndex = args.indexOf("--asset");
const tokenArgIndex = args.indexOf("--token");
const usernameArgIndex = args.indexOf("--username");
const hostArgIndex = args.indexOf("--host");
const portArgIndex = args.indexOf("--port");

const customAsset = assetArgIndex !== -1 ? args[assetArgIndex + 1] : null;
const customToken = tokenArgIndex !== -1 ? args[tokenArgIndex + 1] : null;
const customUsername = usernameArgIndex !== -1 ? args[usernameArgIndex + 1] : null;
const customHost = hostArgIndex !== -1 ? args[hostArgIndex + 1] : null;
const customPort = portArgIndex !== -1 ? args[portArgIndex + 1] : null;

/**
 * CONFIGURATION
 * Credentials are loaded from environment variables or command-line overrides.
 */
const MQTT_OPTIONS = {
  host: customHost || process.env.MQTT_HOST || "localhost",
  port: parseInt(customPort || process.env.MQTT_PORT || "1883"),
  username: customUsername || customAsset || process.env.MQTT_USERNAME || "edge_device",
  password: customToken || process.env.MQTT_PASSWORD || (() => { throw new Error("MQTT_PASSWORD env var is required. See infra/.env.example"); })(),
  clientId: `telemetry-simulator-${customAsset || Math.random().toString(16).substring(2, 8)}`,
};

const API_BASE_URL = "http://localhost:5234/api/v1";
const SYNC_INTERVAL_MS = 60000; // Refetch assets every 1 minute
const PUBLISH_INTERVAL_MS = 3000; // Publish telemetry every 3 seconds per asset (staggered)

// Fallback assets if API is unreachable
const FALLBACK_ASSETS = ["PMP-A-001", "WH-B-015", "CMP-C-123", "PMP-BDG-001"];

let activeAssets = [...FALLBACK_ASSETS];
let client = null;

/**
 * Fetch registered assets from the Backend API
 */
async function fetchAssets() {
  if (customAsset) {
    activeAssets = [customAsset];
    console.log(`🔒 Static Asset Mode Enabled: Monitoring [${customAsset}]`);
    return;
  }

  try {
    console.log("🔄 Syncing asset registry from API...");
    const response = await fetch(`${API_BASE_URL}/assets`);
    
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      const codes = result.data.map(a => a.assetCode);
      if (codes.length > 0) {
        activeAssets = codes;
        console.log(`✅ Registry synced. Monitoring ${activeAssets.length} nodes: [${activeAssets.join(", ")}]`);
        return;
      }
    }
    throw new Error("Invalid API response format");
  } catch (err) {
    console.warn(`⚠️ API Link offline (${err.message}). Using fallback registry.`);
    activeAssets = [...FALLBACK_ASSETS];
  }
}

/**
 * Generate synthetic industrial telemetry
 */
function generateTelemetry(assetCode) {
  return {
    assetCode,
    temperature: parseFloat((Math.random() * 20 + 65).toFixed(2)), // 65-85°C
    pressure: parseFloat((Math.random() * 50 + 350).toFixed(2)),   // 350-400 PSI
    vibration: parseFloat((Math.random() * 4 + 1).toFixed(2)),     // 1-5 mm/s
    timestamp: new Date().toISOString(),
  };
}

/**
 * Start the simulation loop
 */
async function startSimulation() {
  console.log("🚀 Industrial IoT Telemetry Simulator Starting...");
  
  // Initial sync
  await fetchAssets();

  // Connect to MQTT Broker
  client = mqtt.connect(MQTT_OPTIONS);

  client.on("connect", () => {
    console.log("📡 Connected to MQTT Broker");
    
    // Set up periodic sync
    setInterval(fetchAssets, SYNC_INTERVAL_MS);

    // Staggered Publishing Loop
    // To prevent "heavy" load, we rotate through assets one by one
    let currentIndex = 0;
    
    setInterval(() => {
      if (activeAssets.length === 0) return;

      const assetCode = activeAssets[currentIndex];
      const payload = generateTelemetry(assetCode);
      const topic = `iot/telemetry/${assetCode}`;

      client.publish(topic, JSON.stringify(payload), { qos: 0 }, (err) => {
        if (err) {
          console.error(`❌ [${assetCode}] Publish failed:`, err.message);
        } else {
          console.log(`📤 [${assetCode}] Published: Temp=${payload.temperature}°C, Pres=${payload.pressure}PSI`);
        }
      });

      // Move to next asset
      currentIndex = (currentIndex + 1) % activeAssets.length;
    }, PUBLISH_INTERVAL_MS / activeAssets.length); // Dynamic stagger based on asset count
    
    console.log(`⏱️  Telemetry cadence: 1 update every ${Math.round(PUBLISH_INTERVAL_MS / activeAssets.length)}ms`);
    console.log("Press Ctrl+C to shutdown.");
  });

  client.on("error", (err) => {
    console.error("🚨 MQTT Client Error:", err.message);
  });
}

// Global Rejection Handler
process.on("unhandledRejection", (reason) => {
  console.error("🔥 Critical Error:", reason);
});

startSimulation();
