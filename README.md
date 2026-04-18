# 🏭 Industrial IoT Asset Monitoring & Predictive Dashboard

An enterprise-grade monorepo system for monitoring industrial assets, handling high-throughput telemetry data via MQTT, and visualizing predictive alerts in real-time.

Built with a "Secure by Design" mindset and structured using Domain-Driven Design (Clean Architecture).

## 🛠️ Tech Stack

- **Backend:** .NET 8 Web API (Clean Architecture)
- **Frontend:** React + Vite + TypeScript + Tailwind + Shadcn UI
- **Database:** PostgreSQL (Relational & Time-Series Data)
- **Messaging Protocol:** Eclipse Mosquitto (MQTT Broker)
- **Real-time Comm:** SignalR (WebSockets)
- **Infrastructure:** Docker Compose (Containerized Infra)

## 📂 Repository Structure

This project follows a monorepo approach:

```text
/industrial-iot
├── /apps                  # Frontend applications
│   ├── /web-dashboard     # React SPA for monitoring
│   └── /simulator-edge    # Script for generating mock telemetry data
├── /infra                 # Containerized infrastructure (DB, MQTT)
│   └── docker-compose.yml
└── /server                # Backend .NET Solution
    ├── /IndustrialIot.Domain         # Enterprise logic & Entities
    ├── /IndustrialIot.Application    # Use cases & DTOs
    ├── /IndustrialIot.Infrastructure # EF Core & MQTT persistence
    └── /IndustrialIot.Api            # Controllers & SignalR Hubs


## 🚀 Getting Started (Local Development)

### 1. Prerequisites
```

Docker Desktop
.NET 8 SDK
Node.js 18+ + pnpm
Git

````

### 2. Clone & Infrastructure
```bash
git clone https://github.com/athallaarl66/industrial-iot.git
cd industrial-iot
cp infra/.env.example infra/.env  # edit DB_PASSWORD
docker compose up -d  # Postgres(5433) + MQTT
````

2. Infrastructure Setup (Database & MQTT)
   We use Docker to spin up the infrastructure locally to ensure a clean development environment without port collisions.

Bash

# Navigate to the infra directory

cd infra

# Create your environment variables file

cp .env.example .env

# Edit the .env file and set your DB credentials

# DB_USER=iot_admin

# DB_PASSWORD=your_secure_password

# DB_NAME=industrial_iot_db

# Start the containers in detached mode

docker-compose up -d
Note: The local PostgreSQL database is mapped to port 5433 to avoid collision with any existing local Postgres instances.

### 3. Backend (.NET API + DB)

```bash
cd server
dotnet ef database update  # from IndustrialIot.Api dir
dotnet run --project IndustrialIot.Api  # https://localhost:7xxx/swagger
```

**Test Alerts:** `GET /api/v1/alerts?count=10`

### 4. Frontend (Dashboard)

```bash
cd apps/web-dashboard
pnpm install
pnpm dev  # http://localhost:5173
```

### 5. Test Full Stack (Generate Telemetry + Alerts)

```bash
node scripts/mqtt-telemetry-simulator.js  # creates alerts automatically
```

**Verify:**

- Dashboard → Assets/Alerts (live updates via SignalR)
- API Swagger → Alerts endpoint
- DB: `docker exec -it infra_db_1 psql -U iot_admin -d industrial_iot_db -c "SELECT * FROM \"Alerts\" LIMIT 5;"`

### 🔒 Security & Best Practices

- Zero Trust MQTT auth
- .env secrets (never commit)
- FluentValidation on all APIs
- EF Core Includes for N+1 prevention

🌿 Git Flow & Contribution
This project follows strict branching strategies:

main : Production-ready code. Do NOT commit directly here.

develop : Integration branch for upcoming features.

feat/\* : For new features (e.g., feat/mqtt-ingestion).

fix/\* : For bug fixes (e.g., fix/db-connection-retry).

Create a Pull Request (PR) against the develop branch for any new changes.

```

```
