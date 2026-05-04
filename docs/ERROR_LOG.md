D:\Projects\industrial-iot\scripts>node mqtt-telemetry-simulator.js
◇ injected env (3) from ..\infra\.env // tip: ◈ secrets for agents [www.dotenvx.com]
D:\Projects\industrial-iot\scripts\mqtt-telemetry-simulator.js:15
password: process.env.MQTT_PASSWORD || (() => { throw new Error("MQTT_PASSWORD env var is required. See infra/.env.example"); })(),
^

Error: MQTT_PASSWORD env var is required. See infra/.env.example
at D:\Projects\industrial-iot\scripts\mqtt-telemetry-simulator.js:15:57
at Object.<anonymous> (D:\Projects\industrial-iot\scripts\mqtt-telemetry-simulator.js:15:131)
at Module.\_compile (node:internal/modules/cjs/loader:1706:14)
at Object..js (node:internal/modules/cjs/loader:1839:10)
at Module.load (node:internal/modules/cjs/loader:1441:32)
at Function.\_load (node:internal/modules/cjs/loader:1263:12)
at TracingChannel.traceSync (node:diagnostics_channel:322:14)
at wrapModuleLoad (node:internal/modules/cjs/loader:237:24)
at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
at node:internal/main/run_main_module:36:49

Node.js v22.20.0

D:\Projects\industrial-iot\scripts>


di @script keknya tapi cek lainnya dlu

---

## ✅ RESOLVED — 2026-04-22

**Root Cause:** `infra/.env` hanya berisi DB credentials. Variable `MQTT_PASSWORD` (dan MQTT lainnya) tidak ada, sehingga simulator langsung throw sebelum bisa connect ke broker.

**Fix Applied:** Tambahkan MQTT credentials ke `infra/.env`:
```
MQTT_HOST=localhost
MQTT_PORT=1883
MQTT_USERNAME=edge_device
MQTT_PASSWORD=edge_secure_passwd_2026
```