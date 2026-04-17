const mqtt = require("mqtt");

const options = {
  host: "localhost",
  port: 1883,
  username: "backend_service",
  password: "backend_secure_passwd_2026",
  clientId: "telemetry-simulator",
};

const client = mqtt.connect(options);

const assets = ["PMP-A-001", "WH-B-015", "CMP-C-123"];

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  console.log("Publishing sample telemetry every 5 seconds...");
  console.log("Press Ctrl+C to stop");

  setInterval(() => {
    const assetCode = assets[Math.floor(Math.random() * assets.length)];
    const temp = (Math.random() * 20 + 60).toFixed(2); // 60-80°C
    const pressure = (Math.random() * 100 + 300).toFixed(2); // 300-400 PSI
    const vibration = (Math.random() * 5 + 1).toFixed(2); // 1-6 mm/s

    const payload = {
      assetCode,
      temperature: parseFloat(temp),
      pressure: parseFloat(pressure),
      vibration: parseFloat(vibration),
      timestamp: new Date().toISOString(),
    };

    const topic = `telemetry/${assetCode}`;

    client.publish(topic, JSON.stringify(payload), (err) => {
      if (err) {
        console.error("Publish error:", err);
      } else {
        console.log(`Published to ${topic}:`, payload);
      }
    });
  }, 5000);
});

client.on("error", (err) => {
  console.error("MQTT error:", err);
});
