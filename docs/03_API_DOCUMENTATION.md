# API Documentation - Industrial IoT Asset Monitoring System

## Base URL
- **Development:** `http://localhost:5xxx/swagger`
- **Production:** `https://api.industrial-iot.com/swagger`
- **API Base Path:** `/api/v1`

---

## Authentication
Currently: **Not Implemented** (Authentication will be added in future phase)
- Planned: JWT Bearer Token authentication
- Public endpoints: Available for development only
- Production: All endpoints require authentication

---

## Response Format Standard

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ },
  "errorCode": null
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "errorCode": "ERROR_CODE"
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource not found
- `DUPLICATE_CODE` - AssetCode already exists
- `INTERNAL_SERVER_ERROR` - Server-side error

---

## HTTP Status Codes
- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Invalid input or validation error
- **401 Unauthorized** - Authentication required (future)
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server-side error

---

## Endpoints

### Asset Management

#### GET /api/v1/assets
Get all assets in the system.

**Response:** `ApiResponse<List<AssetDto>>`
```json
{
  "success": true,
  "message": "Berhasil mengambil data seluruh aset.",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "assetCode": "PMP-A-001",
      "name": "Main Production Pump A",
      "type": "Pump",
      "location": "Zone A",
      "status": "Running",
      "createdAt": "2026-04-15T10:30:00Z"
    }
  ],
  "errorCode": null
}
```

---

#### GET /api/v1/assets/{id}
Get specific asset by ID.

**Parameters:**
- `id` (UUID, path parameter) - Asset identifier

**Response:** `ApiResponse<AssetDto>`
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "assetCode": "PMP-A-001",
    "name": "Main Production Pump A",
    "type": "Pump",
    "location": "Zone A",
    "status": "Running",
    "createdAt": "2026-04-15T10:30:00Z"
  },
  "errorCode": null
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Aset tidak ditemukan.",
  "data": null,
  "errorCode": "NOT_FOUND"
}
```

---

#### POST /api/v1/assets
Create new asset in the system.

**Request Body:** `CreateAssetDto`
```json
{
  "assetCode": "PMP-A-001",
  "name": "Main Production Pump A",
  "type": "Pump",
  "location": "Zone A"
}
```

**Validation Rules:**
- `assetCode`:
  - Required field
  - Must match O&G format: `^[A-Z]{2,4}-[A-Z0-9]+-[0-9]{3,4}$`
  - Example: `PMP-A-001`, `WH-B-015`, `CMP-C-1234`
- `name`:
  - Required field
  - Maximum length: 100 characters
- `type`:
  - Required field
  - Examples: `Pump`, `Wellhead`, `Compressor`, `Valve`
- `location`:
  - Required field

**Response:** `ApiResponse<AssetDto>` (201 Created)
```json
{
  "success": true,
  "message": "Aset baru berhasil diregistrasikan.",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "assetCode": "PMP-A-001",
    "name": "Main Production Pump A",
    "type": "Pump",
    "location": "Zone A",
    "status": "Running",
    "createdAt": "2026-04-15T10:30:00Z"
  },
  "errorCode": null
}
```

**Error Response (400 - Validation Error):**
```json
{
  "success": false,
  "message": "Format AssetCode tidak valid. Gunakan standar O&G (contoh: PMP-A-001).",
  "data": null,
  "errorCode": "VALIDATION_ERROR"
}
```

**Error Response (400 - Duplicate):**
```json
{
  "success": false,
  "message": "AssetCode 'PMP-A-001' sudah digunakan di sistem.",
  "data": null,
  "errorCode": "DUPLICATE_CODE"
}
```

---

#### DELETE /api/v1/assets/{id}
Delete asset from the system.

**Parameters:**
- `id` (UUID, path parameter) - Asset identifier

**Response:** `ApiResponse<bool>`
```json
{
  "success": true,
  "message": "Aset berhasil dihapus secara permanen.",
  "data": true,
  "errorCode": null
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Aset tidak ditemukan.",
  "data": null,
  "errorCode": "NOT_FOUND"
}
```

---

### Telemetry Data

#### GET /api/v1/assets/{id}/telemetry
Get historical telemetry for a specific asset to render time-series charts.

**Parameters:**
- `id` (UUID, path parameter) - Asset identifier
- `limit` (int, query parameter) - Max records to return (default: 50)

**Response:** `ApiResponse<List<TelemetryHistoryDto>>`
```json
{
  "success": true,
  "message": "Berhasil mengambil riwayat telemetri.",
  "data": [
    {
      "temperature": 85.5,
      "pressure": 350.2,
      "vibration": 2.5,
      "timestamp": "2026-04-18T10:30:00Z"
    }
  ],
  "errorCode": null
}
```

---

## Data Models

### AssetDto
```typescript
interface AssetDto {
  id: string;           // UUID
  assetCode: string;    // Format: TIPE-LOKASI-NOMOR
  name: string;         // Asset name
  type: string;         // Asset type (Pump, Wellhead, etc.)
  location: string;      // Physical location
  status: string;       // Running, Warning, Critical, Maintenance
  createdAt: string;     // ISO 8601 datetime
}
```

### CreateAssetDto
```typescript
interface CreateAssetDto {
  assetCode: string;    // Format: TIPE-LOKASI-NOMOR
  name: string;         // Asset name
  type: string;         // Asset type
  location: string;      // Physical location
}
```

---

## API Conventions

### Naming
- URLs are RESTful
- Use plural nouns for collections (`/assets`)
- Use singular nouns for individual resources (`/assets/{id}`)
- Never include HTTP methods in URLs (avoid `/getAssets`)

### Versioning
- API versioning via URL path (`/api/v1/`)
- Backward compatibility maintained when possible

### Pagination
- Currently not implemented
- Will be added when data volume increases

### Filtering & Sorting
- Currently not implemented
- Will be added based on query requirements

---

## Future Endpoints (Planned)

### Telemetry Management (Planned)
- `POST /api/v1/telemetry` - Manual telemetry data ingestion
- `GET /api/v1/telemetry/{assetId}/latest` - Get latest telemetry data

### Alert Management
- `GET /api/v1/alerts` - Get all alerts
- `GET /api/v1/alerts/{id}` - Get specific alert
- `POST /api/v1/alerts/{id}/acknowledge` - Acknowledge alert
- `POST /api/v1/alerts/{id}/resolve` - Resolve alert

### User Management (Future)
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/users` - Get users (admin only)
- `POST /api/v1/users` - Create user (admin only)

---

## CORS Policy

### Development Configuration
- Allowed Origins: `http://localhost:5173` (Vite dev server)
- Allowed Methods: `GET`, `POST`, `PUT`, `DELETE`
- Allowed Headers: All headers
- Allow Credentials: `true` (required for SignalR)

### Production Configuration
- Must configure for production frontend domain
- Follow CORS security best practices
- Enable only necessary headers and methods

---

## Rate Limiting

**Currently:** Not Implemented

**Planned:**
- Token bucket algorithm
- Configurable per-endpoint limits
- DDoS protection for critical endpoints

---

## Health Checks

### GET /health
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-04-15T10:30:00Z"
}
```

---

## Error Handling

### Global Exception Handler
- All exceptions caught at global level
- Internal errors never exposed to clients
- Errors logged server-side (Serilog/ILogger)
- Standardized error format maintained

### Validation Errors
- Handled by FluentValidation
- Return 400 Bad Request
- Include specific validation messages
- Prevent invalid data from reaching business logic

### Database Errors
- Caught and logged internally
- Generic error message to clients
- Detailed error information logged for debugging

---

## Usage Examples

### cURL Examples

#### Get All Assets
```bash
curl -X GET http://localhost:5xxx/api/v1/assets \
  -H "Content-Type: application/json"
```

#### Get Specific Asset
```bash
curl -X GET http://localhost:5xxx/api/v1/assets/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "Content-Type: application/json"
```

#### Create Asset
```bash
curl -X POST http://localhost:5xxx/api/v1/assets \
  -H "Content-Type: application/json" \
  -d '{
    "assetCode": "PMP-A-001",
    "name": "Main Production Pump A",
    "type": "Pump",
    "location": "Zone A"
  }'
```

#### Delete Asset
```bash
curl -X DELETE http://localhost:5xxx/api/v1/assets/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "Content-Type: application/json"
```

---

## Integration with Frontend

### React/Fetch Example
```typescript
// Get all assets
const response = await fetch('http://localhost:5xxx/api/v1/assets');
const data = await response.json();

if (data.success) {
  console.log('Assets:', data.data);
} else {
  console.error('Error:', data.message, data.errorCode);
}

// Create new asset
const createResponse = await fetch('http://localhost:5xxx/api/v1/assets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    assetCode: 'PMP-A-001',
    name: 'Main Production Pump A',
    type: 'Pump',
    location: 'Zone A'
  })
});

const result = await createResponse.json();
if (!result.success) {
  // Handle validation errors or duplicates
  console.error('Error:', result.message);
}
```

---

## Maintenance & Updates

### API Version Management
- Version 1.0: Current implementation
- Breaking changes will increment major version
- Backward compatibility maintained for minor versions
- Deprecation notices provided before removal

### Documentation Updates
- This document updated with each API change
- Swagger documentation always in sync with code
- Breaking changes highlighted in release notes

---

## Support & Issues

### Reporting Issues
- GitHub Issues: [Repository URL]
- Include API endpoint, request data, and response
- Provide reproduction steps when possible

### API Support
- For production issues: Contact support team
- For development issues: GitHub Discussions
- Response time: Within 24-48 hours

---

*Last Updated: 2026-04-15*
*API Version: 1.0*