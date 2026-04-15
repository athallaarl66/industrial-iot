---
name: "Engineer Security & Data"
description: "Security and data protection guidelines for Industrial IoT system with Zero Trust mindset"
category: Development
tags: [security, data-protection, industrial-iot, zero-trust, enterprise]
---

# Engineer Security & Data

## Role Context
You are ensuring security and data protection for an Industrial IoT system being built by a fresh graduate engineer targeting enterprise O&G industry.

## Security Mindset

### Zero Trust Principle
- **NEVER** trust any input from clients (Frontend or Edge/Simulator)
- **ALWAYS** validate and sanitize all inputs server-side
- **ASSUME** all requests could be malicious
- **MINIMIZE** attack surface through proper architecture

### Defense in Depth
- **Multiple Layers:** Security at multiple levels (input, transport, storage)
- **Fail Securely:** Default to secure configurations
- **Least Privilege:** Minimum access required for each operation
- **Monitor & Alert:** Detect and respond to security incidents

---

## API Security Rules

### Authentication & Authorization

#### JWT Authentication (Required)
- **MUST:** Implement JWT for API authentication
- **Configuration:**
  ```csharp
  services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
      .AddJwtBearer(options => {
          options.TokenValidationParameters = new TokenValidationParameters
          {
              ValidateIssuer = true,
              ValidateAudience = true,
              ValidateLifetime = true,
              // Use secure key storage
              IssuerSigningKey = new SymmetricSecurityKey(jwtKey)
          };
      });
  ```

#### Role-Based Access Control (RBAC)
- **Roles:** Admin, Viewer, Engineer, Field Technician
- **Permissions:**
  - `Viewer`: Read-only dashboard access
  - `Engineer`: Can acknowledge alerts, view analytics
  - `Field Technician`: Can submit maintenance requests
  - `Admin`: Full access (CRUD assets, user management)
- **Implementation:**
  ```csharp
  [Authorize(Roles = "Admin,Engineer")]
  [HttpPost]
  public async Task<IActionResult> AcknowledgeAlert(Guid id)
  ```

### CORS Configuration
- **STRICT Policy:** Only allow authorized frontend origins
- **Configuration:**
  ```csharp
  builder.Services.AddCors(options =>
  {
      options.AddPolicy("FrontendCorsPolicy", policy =>
      {
          policy.WithOrigins("https://your-frontend-domain.com")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials(); // Required for SignalR
      });
  });
  ```
- **Never:** Use `AllowAnyOrigin()` in production

### Rate Limiting (Required)
- **Purpose:** Prevent DDoS and brute-force attacks
- **Implementation:**
  ```csharp
  services.AddRateLimiter(options =>
  {
      options.GlobalLimiter = PartitionedRateLimiter.CreateSlidingWindowLimiter(
          permitLimit: 100,
          window: TimeSpan.FromMinutes(1),
          queueProcessingOrder: QueueProcessingOrder.OldestFirst,
          partitionKey: "global"
      );
  });
  ```
- **Endpoints to Protect:** Authentication endpoints, admin operations

---

## Input Validation Security

### Server-Side Validation
- **FluentValidation:** All DTOs must have validators
- **Rule Examples:**
  ```csharp
  public class CreateAssetValidator : AbstractValidator<CreateAssetDto>
  {
      public CreateAssetValidator()
      {
          RuleFor(x => x.AssetCode)
              .NotEmpty()
              .Matches(@"^[A-Z]{2,4}-[A-Z0-9]+-[0-9]{3,4}$")
              .WithMessage("Format must match O&G standard");
          
          RuleFor(x => x.Temperature)
              .InclusiveBetween(-50, 500)
              .WithMessage("Temperature must be between -50 and 500");
      }
  }
  ```

### Data Sanitization
- **SQL Injection:** Prevented by EF Core parameterized queries
- **XSS Protection:** Sanitize HTML/script in user input
- **Error Messages:** Never expose database errors
- **File Uploads:** Validate file types, sizes, scan for malware

### Common Attack Patterns

**SQL Injection:**
```csharp
// BAD - Raw SQL (VULNERABLE)
var sql = $"SELECT * FROM Assets WHERE Id = '{id}'";

// GOOD - Parameterized (SECURE)
var asset = await context.Assets.FirstOrDefaultAsync(a => a.Id == id);
```

**XSS Attack:**
```csharp
// BAD - Direct output (VULNERABLE)
return Content(userInput);

// GOOD - Sanitized (SECURE)
return Content(System.Web.HttpUtility.HtmlEncode(userInput));
```

---

## Secrets Management

### NEVER Hardcode Secrets
- **FORBIDDEN:** API keys, JWT secrets, connection strings in source code
- **FORBIDDEN:** Passwords or sensitive data in GitHub
- **REQUIRED:** Use environment variables or secret managers

### Local Development
```csharp
// appsettings.Development.json
{
  "ConnectionStrings": {
    // NEVER commit to git
    "DefaultConnection": "Host=localhost;..."
  },
  "JwtSettings": {
    // NEVER commit to git
    "SecretKey": "development-only-secret"
  }
}
```

### Production Deployment
```bash
# Environment Variables
DB_PASSWORD=production-secure-password
JWT_SECRET=production-jwt-secret
MQTT_PASSWORD=mqtt-production-secret

# Or use secret managers
# AWS Secrets Manager
# Azure Key Vault
# HashiCorp Vault
```

### .NET User Secrets
```bash
# For local development
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;..."
dotnet user-secrets set "JwtSettings:SecretKey" "your-dev-secret"
```

---

## MQTT Security

### Broker Configuration

**Mosquitto Configuration (mosquitto.conf):**
```conf
# Authentication Required
allow_anonymous false

# Password File
password_file /mosquitto/config/passwords.txt

# TLS for Production
listener 8883
protocol mqtt
cafile /mosquitto/certs/ca.crt
certfile /mosquitto/certs/server.crt
keyfile /mosquitto/certs/server.key
```

### Client Authentication
```csharp
// NEVER hardcode credentials
var mqttClientOptions = new MqttClientOptionsBuilder()
    .WithClientId("industrial-iot-backend")
    .WithCredentials(
        Environment.GetEnvironmentVariable("MQTT_BACKEND_USER"),
        Environment.GetEnvironmentVariable("MQTT_BACKEND_PASSWORD")
    )
    .Build();
```

### Access Control Lists (Future)
```python
# ACL Configuration
# Pattern write iot/telemetry/%u  (devices only publish to their topics)
# Pattern read iot/telemetry/+  (backend reads all telemetry)
# Pattern write iot/alerts/+  (alert service publishes alerts)
```

---

## SignalR Security

### JWT Authentication
```csharp
// SignalR Hub Authentication
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});

builder.Services.AddAuthentication()
    .AddJwtBearer(...);

builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});

// Require auth in Hub
[Authorize]
public class TelemetryHub : Hub
{
    public async Task JoinAssetGroup(string assetCode)
    {
        // User already authenticated via JWT
    }
}
```

### Client-Side Authentication
```typescript
const connection = new HubConnectionBuilder()
    .withUrl('/api/telemetryhub')
    .withAutomaticReconnect()
    .withAccessTokenProvider(() => {
        // Get JWT token
        return localStorage.getItem('jwt_token');
    })
    .build();
```

---

## Database Security

### Connection Security
- **TLS/SSL:** Required for production connections
- **Connection String:** Never commit to version control
- **Credential Management:** Use environment variables

### Least Privilege Access
```bash
# Separate database roles
iot_user_read   # Read-only for analytics
iot_user_write  # Write access for telemetry ingestion  
iot_user_admin   # Full admin access
```

### Database Security Features
- **Prepared Statements:** EF Core prevents SQL injection
- **Input Validation:** Server-side validation before DB operations
- **Error Handling:** Never expose DB errors to clients
- **Audit Logging:** Log all critical operations

---

## Infrastructure Security

### Docker Configuration
```yaml
# docker-compose.yml
services:
  api:
    environment:
      # Never hardcode in docker-compose.yml
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - MQTT_PASSWORD=${MQTT_PASSWORD}
    # Don't expose ports unnecessarily
    ports:
      - "5443:5443"  # HTTPS only, no HTTP
```

### Network Security
- **Firewall Rules:** Restrict access to necessary ports only
- **VPN/SSH:** Secure access to production servers
- **Security Groups:** AWS/GCP security group configurations
- **Monitoring:** Intrusion detection and response

---

## Data Protection

### Sensitive Data
- **Identify:** Classify data sensitivity levels
- **Encrypt:** Encrypt sensitive data at rest and in transit
- **Access Logs:** Track who accesses what data
- **Retention:** Follow data retention policies

### Privacy
- **PII:** Minimize collection of personally identifiable information
- **Consent:** Obtain user consent for data collection
- **Anonymization:** Anonymize data for analytics when possible
- **Compliance:** Follow GDPR, industry regulations

### Data Integrity
- **Validation:** Validate data quality and ranges
- **Auditing:** Track data changes and access
- **Backups:** Regular, secure backup strategy
- **Recovery:** Test restore procedures regularly

---

## Industrial IoT Specific Security

### Device Security
- **Authentication:** Strong credentials for IoT devices
- **Certificates:** Use client certificates for production
- **Firmware Updates:** Secure update mechanism
- **Physical Security:** Consider device physical protection

### Telemetry Security
- **Timestamp Validation:** Reject data with suspicious timestamps
- **Rate Limiting:** Prevent data flooding from compromised devices
- **Anomaly Detection:** Monitor for unusual patterns
- **Data Quality:** Flag suspicious or invalid sensor data

### Alert Security
- **Verification:** Require acknowledgment from authorized personnel
- **Escalation:** Auto-escalate unacknowledged critical alerts
- **Audit Trail:** Log all alert interactions
- **False Positive Reduction:** Implement machine learning to reduce spam

---

## Security Checklist

### Development Phase
- [ ] No hardcoded credentials or secrets
- [ ] All inputs validated server-side
- [ ] CORS policy configured correctly
- [ ] Environment variables for sensitive data
- [ ] SQL injection prevention (EF Core)
- [ ] XSS protection implemented
- [ ] Authentication/authorization designed
- [ ] Error messages sanitized

### Production Deployment
- [ ] TLS/SSL for all communications
- [ ] Strong JWT secret management
- [ ] Rate limiting implemented
- [ ] MQTT authentication required
- [ ] SignalR authentication required
- [ ] Database connections secured
- [ ] Monitoring and alerting configured
- [ ] Security audit completed
- [ ] Penetration testing performed

---

## Security Incident Response

### Detection
- **Monitoring:** Real-time security monitoring
- **Alerting:** Automated security alerts
- **Logging:** Comprehensive security logging
- **Analysis:** Security log analysis

### Response Process
1. **Containment:** Isolate affected systems
2. **Investigation:** Determine scope and impact
3. **Communication:** Notify stakeholders appropriately
4. **Remediation:** Fix security vulnerabilities
5. **Recovery:** Restore normal operations
6. **Post-Mortem:** Document lessons learned

---

## Compliance & Regulations

### Industry Standards
- **ISO 27001:** Information security management
- **IEC 62443:** Industrial communication security
- **NIST:** Cybersecurity framework
- **OWASP:** Top 10 security risks

### Regulatory Compliance
- **GDPR:** Data protection and privacy
- **Industry Regulations:** O&G sector requirements
- **Data Retention:** Follow legal requirements
- **Reporting:** Incident reporting obligations

---

## Security Testing

### Types of Testing
- **Unit Testing:** Validate security logic
- **Integration Testing:** Test authentication flows
- **Penetration Testing:** Simulate attacks
- **Vulnerability Scanning:** Automated security scans
- **Code Review:** Security-focused code reviews

### Testing Tools
- **OWASP ZAP:** Web application security
- **Burp Suite:** Advanced security testing
- **SonarQube:** Code quality and security
- **SQLMap:** SQL injection testing

---

*Security and data protection for Industrial IoT project*
*Focus: Zero Trust, Defense in Depth, Compliance*