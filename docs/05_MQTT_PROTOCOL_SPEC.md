# MQTT Protocol Specification - Industrial IoT System

## Overview

- **Protocol:** MQTT 3.1.1+
- **Purpose:** Real-time telemetry data transmission from edge devices
- **Broker:** Eclipse Mosquitto
- **Use Case:** High-frequency sensor data with low latency requirements

---

## Broker Configuration

### Connection Details

#### Development

- **Host:** `localhost`
- **Port:** `1883` (TCP), `9001` (WebSocket)
- **Authentication:** Required (Username/Password)
- **Anonymous Access:** Disabled (Security requirement)

#### Production

- **Host:** `mqtt.industrial-iot.com` (example)
- **Port:** `8883` (TLS secured), `443` (WebSocket TLS)
- **Authentication:** Required with client certificates (recommended)
- **TLS/SSL:** Required for production

### Authentication

#### Username/Password Auth (Current)

```bash
# Edge Device Credentials
Username: edge_device
Password: edge_secure_passwd_2026

# Backend Service Credentials
Username: backend_service
Password: backend_secure_passwd_2026
```

#### Certificate-Based Auth (Future - Recommended)

```
# Production should use client certificates
# Prevents credential sharing
# Provides better security for IoT devices
```

---

## Topic Structure

### Topic Naming Convention

- **Format:** `iot/{category}/{assetCode}/{data-type}`
- **Case Sensitivity:** Lowercase
- **Wildcards:** `+` (single level), `#` (multi-level)

### Main Topics

#### Telemetry Ingestion

**Topic:** `iot/telemetry/{assetCode}`

**Examples:**

- `iot/telemetry/PMP-A-001` - Main Production Pump A
- `iot/telemetry/WH-B-015` - Wellhead B, unit 15
- `iot/telemetry/CMP-C-1234` - Compressor C, unit 1234

**QoS Level:** 0 (At most once)
**Reason:** High-frequency data, temporary message loss acceptable

#### Alert Broadcasting

**Topic:** `iot/alerts/{severity}/{assetCode}`

**Examples:**

- `iot/alerts/critical/PMP-A-001` - Critical alert for Pump A
- `iot/alerts/warning/WH-B-015` - Warning alert for Wellhead B

**QoS Level:** 1 (At least once)
**Reason:** Alerts must be guaranteed delivery

#### System Status

**Topic:** `iot/system/{status}`

**Examples:**

- `iot/system/online` - Device comes online
- `iot/system/offline` - Device goes offline
- `iot/system/maintenance` - Device enters maintenance mode

**QoS Level:** 1 (At least once)
**Reason:** System state changes must be reliable

---

## Message Formats

### Telemetry Payload

**Topic:** `iot/telemetry/{assetCode}`

```json
{
  "assetCode": "PMP-A-001",
  "timestamp": "2026-04-15T10:30:00Z",
  "temperature": 85.5,
  "pressure": 12.3,
  "vibration": {
    "x": 0.2,
    "y": 0.1,
    "z": 0.3
  },
  "deviceId": "SENSOR-PMP-A-001-TEMP",
  "quality": "Good"
}
```

**Field Descriptions:**

- `assetCode`: Asset identifier (matches Assets table)
- `timestamp`: Sensor reading timestamp in UTC (ISO 8601 format)
- `temperature`: Temperature in Celsius
- `pressure`: Pressure in Bar/PSI (unit depends on asset configuration)
- `vibration`: 3-axis vibration data (millimeters per second)
- `deviceId`: Source sensor/device identifier
- `quality`: Data quality flag (`Good`, `Suspect`, `Bad`)

**Validation Rules:**

- `assetCode`: Must exist in Assets table
- `timestamp`: Must be recent (within 1 hour of current time)
- `temperature`: Range -50 to 500 (reasonable industrial range)
- `pressure`: Range 0 to 10000 (reasonable industrial range)
- `vibration.x|y|z`: Range 0 to 50 (reasonable vibration range)

---

### Alert Payload

**Topic:** `iot/alerts/{severity}/{assetCode}`

```json
{
  "assetCode": "PMP-A-001",
  "alertType": "Temperature",
  "severity": "Critical",
  "message": "Temperature exceeded critical threshold of 95°C",
  "currentValue": 98.5,
  "threshold": 95.0,
  "timestamp": "2026-04-15T10:30:00Z",
  "alertId": "ALT-20260415-103000"
}
```

**Field Descriptions:**

- `assetCode`: Affected asset identifier
- `alertType`: Type of alert (`Temperature`, `Pressure`, `Vibration`, `Connection`)
- `severity`: Alert severity (`Warning`, `Critical`)
- `message`: Human-readable alert description
- `currentValue`: Actual sensor value that triggered alert
- `threshold`: Threshold value that was exceeded
- `timestamp`: When alert was generated
- `alertId`: Unique alert identifier

**Severity Levels:**

- `Warning`: Degraded performance, needs attention
- `Critical`: Immediate action required, potential equipment damage

---

### System Status Payload

**Topic:** `iot/system/{status}`

**Online Message:**

```json
{
  "assetCode": "PMP-A-001",
  "status": "Online",
  "timestamp": "2026-04-15T10:30:00Z",
  "reason": "Power restored after maintenance"
}
```

**Offline Message:**

```json
{
  "assetCode": "PMP-A-001",
  "status": "Offline",
  "timestamp": "2026-04-15T10:35:00Z",
  "reason": "Connection lost after 5 failed heartbeats"
}
```

**Maintenance Message:**

```json
{
  "assetCode": "PMP-A-001",
  "status": "Maintenance",
  "timestamp": "2026-04-15T10:30:00Z",
  "reason": "Scheduled maintenance - bearing replacement",
  "expectedDuration": "2 hours"
}
```

---

## QoS (Quality of Service) Levels

### QoS 0: At Most Once (Fire and Forget)

**Use Cases:**

- High-frequency telemetry data
- Temporary message loss acceptable
- Bandwidth conservation needed

**Examples:**

- Temperature readings every 3 seconds
- Pressure readings every 3 seconds
- Vibration data every 3 seconds

**Behavior:**

- No acknowledgment required
- Fastest delivery
- Possible message loss
- No duplicate delivery

---

### QoS 1: At Least Once (Guaranteed Delivery)

**Use Cases:**

- Critical system messages
- Alerts and notifications
- State changes

**Examples:**

- Critical temperature alerts
- Equipment offline warnings
- Maintenance mode changes

**Behavior:**

- Acknowledgment required
- Guaranteed delivery
- Possible duplicate delivery
- Slower than QoS 0

---

### QoS 2: Exactly Once (Guaranteed Once)

**Use Cases:**

- Not currently used in this system
- Could be used for financial transactions
- Could be used for critical commands

**Examples:**

- (Future) Equipment control commands
- (Future) Configuration updates

**Behavior:**

- Four-way handshake
- Guaranteed delivery
- No duplicates
- Slowest QoS level

---

## Retained Messages

### Current Configuration

- **Retained Messages:** Enabled for system status topics
- **Purpose:** New subscribers receive current status immediately

### Retained Topics

- `iot/system/online` - Current online status of devices
- `iot/system/offline` - Current offline status of devices

### Non-Retained Topics

- `iot/telemetry/*` - Historical data not retained
- `iot/alerts/*` - Historical alerts not retained

**Reason:**

- Prevent memory bloat on broker
- Redundant for real-time data
- System state is sufficient for initial load

---

## Last Will and Testament (LWT)

### Purpose

- Notify system when device disconnects unexpectedly
- Differentiate between normal shutdown and failure
- Trigger offline alerts automatically

### LWT Configuration

**Topic:** `iot/system/offline/{assetCode}`
**Payload:**

```json
{
  "assetCode": "PMP-A-001",
  "status": "Offline",
  "timestamp": "2026-04-15T10:35:00Z",
  "reason": "Unexpected disconnection (Last Will triggered)"
}
```

**Behavior:**

- If device disconnects unexpectedly → LWT message published
- If device disconnects gracefully → Device publishes goodbye message
- Helps differentiate between planned and unplanned outages

---

## Security Considerations

### Authentication Requirements

- **No Anonymous Access:** Strictly enforced
- **Credential Management:** Environment variables (never hardcoded)
- **User Roles:** Separate credentials for edge devices and backend

### Transport Security

#### Development

- **Plain TCP:** Allowed for localhost
- **WebSocket:** Supported on port 9001
- **TLS/SSL:** Not required for development

#### Production

- **TLS/SSL Required:** All connections must be encrypted
- **Client Certificates:** Recommended for device authentication
- **Port 8883:** TLS-secured MQTT port
- **Port 443:** TLS-secured WebSocket port

### Access Control Lists (ACLs)

**Planned Feature:**

```python
# Mosquitto ACL Configuration
# Edge devices can only publish to their topics
pattern write iot/telemetry/PMP-A-001/%u

# Backend can read all telemetry
pattern read iot/telemetry/+

# Alert service can publish alerts
pattern write iot/alerts/+

# Dashboard can subscribe to all topics
pattern read #
```

### Message Validation

- **Backend Validation:** All messages validated before processing
- **JSON Schema:** Validate payload structure
- **Type Checking:** Ensure data types are correct
- **Range Validation:** Verify sensor values are reasonable

---

## Connection Management

### Connection Lifecycle

#### Device Connection

```
1. Edge device authenticates with credentials
2. Subscribe to system topics (alerts, status)
3. Begin publishing telemetry data
4. Maintain connection with keep-alive
5. Handle disconnects and reconnect automatically
```

#### Backend Connection

```
1. Backend service authenticates with credentials
2. Subscribe to all telemetry topics
3. Subscribe to system status topics
4. Process incoming messages in real-time
5. Store valid data to database
6. Broadcast alerts to connected clients
```

### Reconnection Strategy

- **Automatic Reconnect:** Devices reconnect on disconnect
- **Exponential Backoff:** Prevent server overload
- **Heartbeat:** Regular messages to maintain connection
- **Timeout Handling:** Disconnect if no heartbeat received

### Error Handling

- **Connection Refused:** Wrong credentials or server down
- **Authentication Failure:** Invalid username/password
- **Network Issues:** Handle with retry logic
- **Malformed Messages:** Log and reject invalid payloads

---

## Performance Considerations

### Message Throughput

**Expected Load:**

- Assets: 10-100 devices
- Frequency: 1 message per 3 seconds per device
- Total Throughput: 3.3-33 messages/second

**Broker Capacity:**

- Mosquitto can handle thousands of concurrent connections
- Current load is well within capacity
- Plan for 10x growth in device count

### Message Size

**Average Payload Size:** ~200 bytes
**Throughput Calculation:**

- 33 messages/second × 200 bytes = 6.6 KB/second
- Well within typical network capacity

### Latency Requirements

- **Target:** < 100ms end-to-end latency
- **Measurement:** Device → MQTT → Backend → Database
- **Monitoring:** Track and alert on latency degradation

---

## Testing & Debugging

### Development Tools

#### Mosquitto CLI Tools

```bash
# Subscribe to all topics (for debugging)
mosquitto_sub -h localhost -u edge_device -P edge_secure_passwd_2026 -v -t "iot/#"

# Publish test message
mosquitto_pub -h localhost -u edge_device -P edge_secure_passwd_2026 -t "iot/telemetry/PMP-A-001" -m '{"assetCode":"PMP-A-001","temperature":85.5}'

# Monitor broker statistics
mosquitto_sub -h localhost -u backend_service -P backend_secure_passwd_2026 -t "$SYS/broker/load/+" -v
```

#### MQTT Explorer

- **GUI Client:** MQTT Explorer / MQTT.fx
- **Purpose:** Visual debugging of topics and messages
- **Platform:** Windows, macOS, Linux

### Integration Testing

#### Test Scenarios

1. **Single Device Load:** Test with 1 device sending data
2. **Multi-Device Load:** Test with 10-100 devices
3. **Network Failure:** Test behavior during disconnection
4. **Message Validation:** Send invalid messages
5. **Alert Generation:** Trigger alerts via threshold exceedance

#### MQTT Simulator

Use `scripts/mqtt-telemetry-simulator.js` for automated testing:

```bash
cd scripts
node mqtt-telemetry-simulator.js --asset PMP-A-001 --interval 3s
```

Creds: edge_device / edge_secure_passwd_2026

---

## Monitoring & Logging

### Broker Metrics

- **Connections:** Active vs idle connections
- **Message Rates:** Messages published/received per second
- **Storage:** Disk usage for retained messages
- **Errors:** Authentication failures, connection errors

### Application Metrics

- **Processing Latency:** Time from receive to database save
- **Error Rate:** Percentage of invalid messages
- **Reconnection Rate:** Frequency of device reconnects
- **Alert Generation:** Number of alerts per hour

### Logging

- **Application Logs:** All MQTT interactions logged
- **Broker Logs:** Connection errors, authentication failures
- **Performance Logs:** Latency, throughput metrics

---

## Future Enhancements

### MQTT v5 Features

- **Shared Subscriptions:** Reduce bandwidth for multiple consumers
- **Topic Aliases:** Reduce header overhead
- **User Properties:** Pass metadata without payload changes
- **Reason Codes:** Better error handling

### Advanced Security

- **Dynamic Security Plugins:** Real-time permission management
- **Authentication Integration:** LDAP/Active Directory integration
- **Message Encryption:** Payload-level encryption (end-to-end)

### Broker Improvements

- **Clustering:** High availability for production
- **Load Balancing:** Distribute connections across brokers
- **Persistent Sessions:** Better handling of device reconnects

---

_Last Updated: 2026-04-15_
_MQTT Version: 3.1.1+_
_Mosquitto Version: Latest_
