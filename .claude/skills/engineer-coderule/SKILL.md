---
name: "Engineer Code Rules"
description: "Coding rules and standards enforcement for .NET/IoT backend development"
category: Development
tags: [code-rules, dotnet, clean-architecture, iot, industrial, standards]
---

# Engineer Code Rules

## Role Context
You are enforcing coding rules for an Industrial IoT Asset Monitoring & Predictive Dashboard system being built by a fresh graduate engineer.

## Project Standards

### Tech Stack
- **Backend:** .NET 8 Web API (Clean Architecture)
- **Frontend:** React + Vite + TypeScript + Tailwind + Shadcn UI
- **Database:** PostgreSQL (EF Core 8.0.*)
- **IoT Protocol:** Eclipse Mosquitto (MQTT)
- **Real-time:** SignalR (WebSockets)
- **Infrastructure:** Docker Compose

### Architecture Pattern
```
API Layer (Controllers, SignalR Hubs)
    ↓
Application Layer (Services, DTOs, Validators)
    ↓
Infrastructure Layer (EF Core, MQTT, External Services)
    ↓
Domain Layer (Entities, Enums, Value Objects)
```

## Coding Rules (STRICT)

### 1. API Standards

#### URL Patterns
- **DO:** RESTful URLs with nouns: `/api/v1/assets`, `/api/v1/telemetry`
- **DON'T:** Include HTTP methods in URLs: `/api/getUser`, `/api/deleteAsset`
- **Versioning:** Include version in URL: `/api/v1/`

#### Response Format
**Success Response (Must Follow):**
```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T? Data { get; set; }
    public string? ErrorCode { get; set; }
}
```

**Error Response (Must Follow):**
```csharp
// 400 Bad Request - Validation Error
// 404 Not Found - Resource doesn't exist
// 500 Internal Server Error - Server-side error
```

#### HTTP Status Codes
- **200 OK:** Successful GET/PUT/DELETE
- **201 Created:** Successful POST
- **400 Bad Request:** Invalid input, validation error
- **401 Unauthorized:** Authentication required
- **404 Not Found:** Resource doesn't exist
- **500 Internal Server Error:** Server-side error

**NEVER:** Return 200 OK if error occurred

---

### 2. Clean Architecture Rules

#### Layer Responsibilities

**API Layer (Controllers):**
- ONLY: Accept requests, return responses
- NEVER: Business logic, direct database access
- MUST: Use application services, not DbContext directly

**Application Layer (Services):**
- MUST: Business logic, validation orchestration
- MUST: Use repository interfaces
- NEVER: Access DbContext directly (use repositories)

**Infrastructure Layer (Repositories):**
- MUST: EF Core, external services
- MUST: Implement application interfaces
- NEVER: Business logic

**Domain Layer (Entities):**
- MUST: Business entities, enums, value objects
- MUST: Framework-agnostic (no EF Core references)
- NEVER: External dependencies

#### Dependency Flow
- Dependencies ALWAYS point inward (toward domain)
- Domain layer has NO dependencies
- Infrastructure implements application interfaces

---

### 3. Database Rules

#### Entity Framework Core Best Practices
- **READ Operations:** Always use `.AsNoTracking()`
- **ASYNC:** Always use async methods: `ToListAsync()`, `FirstOrDefaultAsync()`
- **N+1 Prevention:** Use `.Include()` for related data
- **Parameterized Queries:** Always use LINQ (never raw SQL)

#### Database Schema
- **Indexing:** Index `Timestamp` and `AssetId` in Telemetry table
- **Relationships:** Configure foreign keys properly
- **Constraints:** Use EF Core conventions + explicit configuration
- **Migrations:** Use EF Core migrations, never manual schema changes

#### Connection Management
- **NEVER** Hardcode connection strings
- **MUST:** Use appsettings.json or Environment Variables
- **SECRET Management:** Use .NET User Secrets for development
- **PRODUCTION:** Use environment variables or secret managers

---

### 4. Validation Rules

### Zero Trust Principle
- **NEVER** Trust client-side validation
- **MUST** Validate on server-side (FluentValidation)
- **ALWAYS** Sanitize error messages before returning to client

### FluentValidation Usage
- **MUST:** Create validators for all DTOs
- **MUST:** Register validators in DI container
- **SHOULD:** Provide meaningful error messages
- **NEVER** Skip validation for critical operations

### Input Sanitization
- **SQL Injection:** Prevented by EF Core parameterized queries
- **XSS:** Sanitize any HTML/script in user input
- **Error Exposure:** Never expose database errors to clients

---

### 5. IoT Specific Rules

### MQTT Data Processing
- **MUST:** Process telemetry asynchronously (non-blocking)
- **MUST:** Use UTC timestamps from edge devices
- **MUST:** Validate payload structure and ranges
- **SHOULD:** Buffer data for batch processing

### Timestamp Handling
- **Storage:** Always use UTC in database
- **Edge Data:** Use timestamp from device, not server time
- **Display:** Convert to local time in frontend only
- **Consistency:** All timestamps follow ISO 8601 format

### Alert Logic
- **MUST:** Prevent alert spam (state machine)
- **MUST:** Use consistent alert thresholds per asset
- **SHOULD:** Implement acknowledgment workflow
- **NEVER:** Create duplicate alerts for same condition within time window

### Concurrency Handling
- **High-Throughput:** Use async/await throughout
- **Race Conditions:** Use proper locking mechanisms
- **Resource Management:** Dispose resources properly
- **Scalability:** Design for horizontal scaling

---

### 6. Code Quality Rules

#### Naming Conventions
- **Classes:** PascalCase: `AssetService`, `CreateAssetDto`
- **Methods:** PascalCase: `GetAllAssetsAsync()`, `ValidateTelemetry()`
- **Variables:** camelCase: `assetId`, `isValid`
- **Constants:** PascalCase: `MaxTemperature`, `CriticalThreshold`

#### Code Structure
- **Methods:** Single responsibility, < 50 lines if possible
- **Classes:** Single responsibility, < 500 lines if possible
- **DRY:** Don't Repeat Yourself - extract common logic
- **KISS:** Keep It Simple, Stupid - avoid over-engineering

#### Comments
- **MUST** Explain "why" code exists (edge cases, design decisions)
- **MUST NOT** Explain "what" code does (self-evident from naming)
- **SHOULD** Be concise and to-the-point
- **NEVER** Use AI-like or overly formal language

#### Error Handling
- **TRY-CATCH:** Wrap potentially failing operations
- **LOGGING:** Use Serilog/ILogger for internal errors
- **SANITIZATION:** Never expose raw exceptions to clients
- **USER MESSAGES:** Provide actionable, friendly error messages

---

### 7. Security Rules

### Authentication & Authorization
- **JWT:** Must use for API authentication (when implemented)
- **RBAC:** Role-Based Access Control (when implemented)
- **Authorization:** Check permissions for sensitive operations
- **Token Expiration:** Reasonable timeout (1-2 hours)

### API Security
- **CORS:** Strict policy, only allow authorized origins
- **Rate Limiting:** Implement to prevent DDoS/brute-force
- **Input Validation:** All inputs validated server-side
- **SQL Injection:** Prevented by EF Core parameterized queries

### MQTT Security
- **NO ANONYMOUS:** Always require authentication
- **TLS/SSL:** Required for production
- **Credentials:** Never hardcoded, use environment variables
- **ACL:** Implement access control lists (future)

---

### 8. Frontend Rules

### Component Design
- **Reusable Components:** Extract common UI patterns
- **Sub-Components:** Split if logic differs
- **Props Interface:** Clear prop requirements with TypeScript
- **State Management:** Consider Redux/Zustand if complex

### Validation
- **Inline Validation:** Validate each field individually
- **Real-time Feedback:** Show errors immediately
- **Custom Dialogs:** Use custom delete dialogs, NOT `window.confirm()`
- **Loading States:** Disable buttons and show loading during API calls

### Styling
- **Theme:** Industrial system (Dark Mode recommended)
- **Colors:** Consistent status colors (Green=Normal, Yellow=Warning, Red=Critical)
- **Responsive:** Mobile-first design approach
- **Performance:** Optimize re-renders for high-frequency updates

---

## Code Review Checklist

### Before Committing
- [ ] Follows Clean Architecture layering
- [ ] Uses correct HTTP status codes
- [ ] Returns consistent API response format
- [ ] Validates all inputs (FluentValidation)
- [ ] Uses async/await properly
- [ ] Handles exceptions gracefully
- [ ] Comments explain "why" not "what"
- [ ] No hardcoded credentials or connection strings
- [ ] Follows naming conventions
- [ ] No over-engineering for simple requirements

### Industrial IoT Specific
- [ ] MQTT processing is non-blocking
- [ ] Uses UTC timestamps consistently
- [ ] Prevents alert spam (state machine)
- [ ] Handles high-throughput scenarios
- [ ] Proper concurrency handling

---

## Common Violations (AVOID THESE)

### Architecture Violations
❌ Business logic in Controllers
❌ DbContext accessed from Controllers directly
❌ Domain entities referenced in Infrastructure layer
❌ Dependencies pointing outward from domain

### Code Quality Violations  
❌ Variable names like `temp`, `data`, `item`
❌ Comments explaining what code does
❌ Methods > 100 lines without splitting
❌ Complex patterns for simple requirements

### Security Violations
❌ Client-side validation only
❌ Exposed database error messages
❌ Hardcoded credentials or connection strings
❌ Missing authentication for sensitive endpoints

### Performance Violations
❌ Synchronous database calls in async methods
❌ Missing AsNoTracking on read queries
❌ N+1 queries (missing `.Include()`)
❌ Blocking MQTT message processing

---

## Enforcement

### AI Behavior
1. **Check code against all rules above**
2. **Point out violations clearly with file/line references**
3. **Provide concrete examples of correct implementation**
4. **Explain why rules matter (architectural thinking)**
5. **Help engineer understand "why" not just "how"**

### For Fresh Graduate
- **Educational approach:** Explain reasoning behind rules
- **Mentor mindset:** Help them think like architects
- **Practical focus:** Show real examples from their codebase
- **Growth oriented:** Connect rules to career goals

---

*Code rules for Industrial IoT project*
*Focus: Clean Architecture, Enterprise Standards, Security, Performance*