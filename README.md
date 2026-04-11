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

1. Prerequisites
Ensure you have the following installed on your machine:

Docker Desktop (Running)

.NET 8 SDK

Node.js (v18 or higher) & pnpm

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

3. Backend Setup (.NET)
Apply the database schema using EF Core Code-First migrations.

Bash
# Navigate to the server directory
cd server

# Update your appsettings.Development.json connection string to match your .env credentials
# "Host=localhost;Port=5433;Database=industrial_iot_db;Username=iot_admin;Password=your_secure_password"

# Apply database migrations
dotnet ef database update --project IndustrialIot.Infrastructure --startup-project IndustrialIot.Api

# Run the API
dotnet run --project IndustrialIot.Api
The Swagger UI documentation will be available at http://localhost:5xxx/swagger.

🔒 Security Standards
Zero Trust: MQTT Broker is secured with authentication (No anonymous access).

Secrets Management: Sensitive credentials are never committed to version control. Uses .env and User Secrets.

Data Protection: All APIs strictly validate incoming payloads to prevent injection attacks.

🌿 Git Flow & Contribution
This project follows strict branching strategies:

main : Production-ready code. Do NOT commit directly here.

develop : Integration branch for upcoming features.

feat/* : For new features (e.g., feat/mqtt-ingestion).

fix/* : For bug fixes (e.g., fix/db-connection-retry).

Create a Pull Request (PR) against the develop branch for any new changes.
```
