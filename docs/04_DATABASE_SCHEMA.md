# Database Schema Documentation - Industrial IoT System

## Database Overview
- **Database Name:** `industrial_iot_db`
- **Type:** PostgreSQL 16
- **Architecture:** Relational (ACID compliant)
- **Access:** Via Entity Framework Core + Npgsql

---

## Tables & Schema

### Assets Table
Master data for industrial assets/machines.

#### Columns
| Column | Type | Constraints | Description |
|---------|-------|-------------|-------------|
| `Id` | UUID | Primary Key | Unique identifier for each asset |
| `AssetCode` | VARCHAR(50) | Unique, Not Null | O&G standard format (e.g., PMP-A-001) |
| `Name` | TEXT | Not Null | Human-readable asset name |
| `Type` | TEXT | Not Null | Asset type (Pump, Wellhead, Compressor, Valve) |
| `Location` | TEXT | Not Null | Physical location (e.g., Zone A, Zone B) |
| `Status` | INTEGER | Not Null | Operational status (0=Running, 1=Warning, 2=Critical, 3=Maintenance) |
| `CreatedAt` | TIMESTAMP | Not Null | Registration timestamp (UTC) |

#### Indexes
- `PK_Assets` - Primary key on `Id`
- `IX_Assets_AssetCode` - Unique index on `AssetCode`

#### Relationships
- **One-to-Many:** Assets → Telemetries

---

### Telemetries Table
Time-series sensor data for industrial assets.

#### Columns
| Column | Type | Constraints | Description |
|---------|-------|-------------|-------------|
| `Id` | BIGINT | Primary Key, Auto-Increment | Unique telemetry record identifier |
| `AssetId` | UUID | Foreign Key, Not Null | Reference to Assets table |
| `Temperature` | NUMERIC(18,2) | Not Null | Temperature reading (Celsius) |
| `Pressure` | NUMERIC(18,2) | Not Null | Pressure reading (Bar/PSI) |
| `Timestamp` | TIMESTAMP | Not Null, Indexed | Sensor reading timestamp (UTC) |

#### Planned Enhancements
```sql
-- Additional columns for production (not yet implemented)
ALTER TABLE Telemetries ADD COLUMN VibrationX NUMERIC(18,2);
ALTER TABLE Telemetries ADD COLUMN VibrationY NUMERIC(18,2);
ALTER TABLE Telemetries ADD COLUMN VibrationZ NUMERIC(18,2);
ALTER TABLE Telemetries ADD COLUMN ReceivedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE Telemetries ADD COLUMN DataQuality VARCHAR(20) DEFAULT 'Good';
ALTER TABLE Telemetries ADD COLUMN DeviceId VARCHAR(100);
```

#### Indexes
- `PK_Telemetries` - Primary key on `Id`
- `IX_Telemetries_AssetId` - Index on `AssetId` (for asset-specific queries)
- `IX_Telemetries_Timestamp` - Index on `Timestamp` (for time-range queries)

#### Relationships
- **Many-to-One:** Telemetries → Assets

---

## Entity Relationships

```
┌──────────────────┐
│     Assets       │
├──────────────────┤
│ Id (PK)         │
│ AssetCode       │
│ Name            │
│ Type            │
│ Location        │
│ Status          │
│ CreatedAt       │
└────────┬─────────┘
         │ 1
         │
         │ N
┌────────▼─────────┐
│   Telemetries    │
├──────────────────┤
│ Id (PK)         │
│ AssetId (FK)     │◄───
│ Temperature     │
│ Pressure        │
│ Timestamp       │
└──────────────────┘
```

---

## Data Types & Precision

### Numeric Precision
- **Temperature:** NUMERIC(18,2) - Supports -99,999,999,999,999.99 to 99,999,999,999,999.99
- **Pressure:** NUMERIC(18,2) - Same precision, suitable for industrial sensors
- **Vibration:** NUMERIC(18,2) - 3-axis vibration data (planned)

### UUID Usage
- **Primary Keys:** UUID for better distribution in distributed systems
- **Foreign Keys:** UUID maintains referential integrity
- **Advantages:** No auto-increment conflicts, easier replication

### Timestamp Handling
- **UTC Always:** All timestamps stored in UTC
- **With Time Zone:** PostgreSQL `timestamp with time zone`
- **Format:** ISO 8601 for application layer

---

## Indexing Strategy

### Why These Indexes?

#### AssetCode Index
- **Purpose:** Fast lookup by asset code
- **Usage:** Validation (check duplicates), admin searches
- **Type:** Unique index (prevents duplicates at DB level)

#### AssetId Index
- **Purpose:** Fast filtering by asset
- **Usage:** Get telemetry history for specific asset
- **Type:** Non-unique index (many records per asset)

#### Timestamp Index
- **Purpose:** Fast time-range queries
- **Usage:** Chart data aggregation, historical analysis
- **Type:** Non-unique index (many records per timestamp)

### Performance Considerations
- Indexes improve read performance but slow down writes
- Optimal for high-read, low-write scenarios (IoT monitoring)
- Monitor index usage and remove unused indexes

---

## Data Retention Policy (Planned)

### Current State
- **No automatic data retention**
- All telemetry data stored indefinitely
- Database size grows continuously

### Planned Retention Strategy
```sql
-- Archive old data (not yet implemented)
-- Move telemetry older than 6 months to archive table
INSERT INTO TelemetryArchive
SELECT * FROM Telemetries
WHERE Timestamp < NOW() - INTERVAL '6 months';

-- Delete archived data
DELETE FROM Telemetries
WHERE Timestamp < NOW() - INTERVAL '6 months';

-- Create monthly partitions (planned)
CREATE TABLE Telemetries_202604 PARTITION OF Telemetries
FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
```

### Data Aggregation (Planned)
- **Raw data:** Keep 3-6 months for detailed analysis
- **Hourly averages:** Keep 1-2 years for trends
- **Daily summaries:** Keep indefinitely for historical records

---

## Migration History

### Initial Migration
**Migration Name:** `InitialCreate`
**Date:** 2026-04-11
**Changes:**
- Created `Assets` table with proper constraints
- Created `Telemetries` table with indexes
- Established foreign key relationship

### Planned Migrations
1. **AddTelemetryEnhancements** - Add vibration, quality, device ID fields
2. **CreateAlertsTable** - Add alert management system
3. **CreateUsersTable** - Add authentication & authorization
4. **AddDataRetentionPolicy** - Implement archival strategy
5. **AddTablePartitioning** - Improve performance for large datasets

---

## Database Performance

### Expected Data Volume
**Assumptions:**
- Assets: 10-100 industrial machines
- Telemetry frequency: Every 3 seconds
- Retention period: 6 months (raw data)

**Growth Calculation:**
```
Records per hour per asset: 1,200 (3600 seconds / 3)
Records per day per asset: 28,800
Records per day (100 assets): 2,880,000
Records per month: ~86,400,000
Records per 6 months: ~518,400,000
```

### Performance Optimization
- **Index Strategy:** Optimized for read-heavy workloads
- **Query Optimization:** Use `AsNoTracking()` for read-only operations
- **Connection Pooling:** EF Core connection pooling enabled
- **Batch Operations:** Consider batch inserts for high-volume scenarios

### Monitoring Needed
- **Query Performance:** Monitor slow queries
- **Index Usage:** Verify indexes are being used
- **Table Size:** Monitor growth and plan partitioning
- **Connection Count:** Monitor database connection pool

---

## Security Considerations

### Database Access Control
- **Principle of Least Privilege:** Separate roles for read/write
- **Connection Security:** SSL/TLS for production connections
- **Credentials:** Never hardcoded, use environment variables

### Data Protection
- **SQL Injection:** Prevented by EF Core parameterized queries
- **Data Validation:** Application layer validation before database
- **Audit Logging:** Track critical operations (planned)

---

## Backup & Recovery

### Current State
- **Volume Persistence:** Docker volumes for database data
- **Location:** `infra/db_data/` directory
- **Backup Strategy:** Manual backup required

### Recommended Strategy
```bash
# Daily backups (automated via cron)
pg_dump -h localhost -U iot_admin industrial_iot_db > backup_$(date +%Y%m%d).sql

# Point-in-time recovery (if WAL archiving enabled)
# Recovery to specific timestamp possible
```

### Disaster Recovery
- **RPO (Recovery Point Objective):** < 24 hours
- **RTO (Recovery Time Objective):** < 4 hours
- **Strategy:** Regular backups + WAL archiving

---

## Database Constraints & Validation

### AssetCode Format
- **Regex:** `^[A-Z]{2,4}-[A-Z0-9]+-[0-9]{3,4}$`
- **Examples:** `PMP-A-001`, `WH-B-015`, `CMP-C-1234`
- **Purpose:** Standardize asset identification across O&G operations

### Asset Status Values
- **0:** Running (Normal operation)
- **1:** Warning (Degraded performance)
- **2:** Critical (Failure imminent)
- **3:** Maintenance (Scheduled/unscheduled)

### Data Integrity
- **Foreign Key Constraints:** Prevent orphaned telemetry records
- **Not Null Constraints:** Ensure required data is always present
- **Unique Constraints:** Prevent duplicate asset codes

---

## Connection String Configuration

### Development Connection String
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5433;Database=industrial_iot_db;Username=iot_admin;Password=your_secure_password"
  }
}
```

### Production Connection String (Planned)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=production-db.amazonaws.com;Port=5432;Database=industrial_iot_db;Username=iot_user;Password=prod_password;SSL Mode=Require;Timeout=30;Command Timeout=300"
  }
}
```

### Environment Variables
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password (never commit to git)
- `DB_NAME` - Database name
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5433)

---

## Maintenance Operations

### Common SQL Queries

#### Check Database Size
```sql
SELECT pg_size_pretty(pg_database_size('industrial_iot_db'));
```

#### Check Table Sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### Analyze Index Usage
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

#### Remove Unused Indexes
```sql
-- Run this periodically to identify unused indexes
-- Consider removing indexes with idx_scan = 0
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_stat_user_indexes
WHERE schemaname = 'public' AND idx_scan = 0;
```

---

## Performance Monitoring

### Key Metrics to Monitor
1. **Query Latency:** Average query execution time
2. **Connection Pool Usage:** Active vs idle connections
3. **Index Hit Ratio:** Percentage of queries using indexes
4. **Table Bloat:** Storage wasted by deleted records
5. **Disk Usage:** Database growth rate

### Recommended Tools
- **pg_stat_statements:** Query performance tracking
- **pg_stat_activity:** Connection monitoring
- **EXPLAIN ANALYZE:** Query optimization
- **pgAdmin:** Visual database management

---

*Last Updated: 2026-04-15*
*PostgreSQL Version: 16*
*EF Core Version: 8.0*