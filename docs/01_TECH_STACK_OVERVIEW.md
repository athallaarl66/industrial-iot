# Tech Stack Overview - Industrial IoT Asset Monitoring System

## System Architecture Overview
This project uses a modern, enterprise-grade technology stack optimized for real-time IoT data processing and visualization.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Client)                      │
│  React + TypeScript + Vite + Tailwind + Shadcn UI        │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS/WebSocket
┌───────────────────────▼─────────────────────────────────────┐
│                  Backend (API Layer)                       │
│  .NET 8 Web API + Clean Architecture                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼────────┐ ┌──▼──────────┐ ┌──▼────────────────────┐
│   PostgreSQL     │ │   Mosquitto  │ │   SignalR Hub        │
│   (Data Store)   │ │  (MQTT)     │ │ (Real-time Comm)     │
└──────────────────┘ └─────────────┘ └───────────────────────┘
        │               │               │
        └───────────────┴───────────────┘
                        │
            ┌───────────▼────────────────┐
            │   Docker Compose          │
            │   (Infrastructure)        │
            └───────────────────────────┘
```

---

## Frontend Technology Stack

### Core Framework
- **React:** 19.2.4
- **TypeScript:** 6.0.2
- **Vite:** 8.0.4 (Build tool & dev server)

#### Why React 19?
- **Latest Features:** Latest React improvements and optimizations
- **Component-based:** Modular, reusable component architecture
- **Large Ecosystem:** Extensive library support
- **Performance:** Virtual DOM for efficient rendering

#### Why TypeScript?
- **Type Safety:** Catch errors at compile time
- **Better IDE Support:** IntelliSense and refactoring
- **Documentation:** Types serve as documentation
- **Maintainability:** Easier to maintain large codebases

#### Why Vite?
- **Fast Development:** Lightning-fast HMR (Hot Module Replacement)
- **Modern Build:** Optimized production builds
- **Simple Config:** Minimal configuration required
- **Plugin System:** Extensible via plugins

---

### UI Framework & Styling
- **Tailwind CSS:** Utility-first CSS framework
- **Shadcn UI:** Modern component library
- **Recharts:** Data visualization library

#### Why Tailwind CSS?
- **Utility-first:** Rapid UI development
- **Responsive:** Mobile-first design built-in
- **Customizable:** Easy theming and customization
- **Small Bundle:** Tree-shaking unused styles

#### Why Shadcn UI?
- **Modern Components:** Beautiful, accessible components
- **Customizable:** Full control over components
- **React 19 Support:** Latest React features
- **TypeScript:** Built-in TypeScript support

#### Why Recharts?
- **Real-time Updates:** Efficient for live data
- **Industrial Charts:** Line, bar, gauge charts for sensor data
- **Responsive:** Adapts to different screen sizes
- **Customizable:** Deep customization options

---

### Development Tools
- **ESLint:** Code linting and style checking
- **TypeScript ESLint:** Type-aware linting rules
- **React Hooks ESLint:** React-specific rules
- **React Refresh ESLint:** Fast refresh optimization

---

## Backend Technology Stack

### Core Framework
- **.NET:** 8.0
- **C#:** 12 (latest language features)
- **Platform:** Cross-platform (Windows, Linux, macOS)

#### Why .NET 8?
- **Enterprise-Grade:** Used by Fortune 500 companies
- **High Performance:** One of the fastest web frameworks
- **Cross-Platform:** Deploy on any OS
- **Modern C#:** Latest language features and performance improvements
- **Long-term Support:** LTS version with extended support

---

### Architecture Pattern
- **Pattern:** Clean Architecture with Domain-Driven Design
- **Layers:** Domain → Application → Infrastructure → API

#### Why Clean Architecture?
- **Testability:** Easy to unit test each layer
- **Maintainability:** Clear separation of concerns
- **Flexibility:** Replace implementations without affecting business logic
- **Enterprise Standard:** Used in large-scale enterprise applications

---

### Database & ORM
- **Database:** PostgreSQL 16
- **ORM:** Entity Framework Core 8.0.*
- **Provider:** Npgsql.EntityFrameworkCore.PostgreSQL 8.0.*

#### Why PostgreSQL?
- **ACID Compliant:** Reliable transaction handling
- **Time-Series Support:** Optimized for historical data queries
- **Advanced Features:** JSON support, window functions, indexing
- **Open Source:** No licensing costs, large community
- **Enterprise Support:** Available from various vendors

#### Why Entity Framework Core?
- **Developer Productivity:** Database-first or code-first approach
- **Type Safety:** LINQ queries with compile-time checking
- **Migrations:** Automated database schema management
- **Change Tracking:** Automatic change detection
- **LINQ Providers:** Translate C# to efficient SQL

---

### Validation & API Documentation
- **Validation:** FluentValidation 12.1.1
- **API Documentation:** Swashbuckle.AspNetCore 6.6.2

#### Why FluentValidation?
- **Zero Trust:** Server-side validation (not client-side only)
- **Separation:** Validation logic separated from business logic
- **Reusability:** Validation rules can be reused
- **Integration:** Works seamlessly with .NET dependency injection

#### Why Swashbuckle?
- **Auto-Generated:** No manual Swagger documentation needed
- **Interactive UI:** Built-in Swagger UI for testing
- **Type Safety:** Reflects actual C# types
- **Industry Standard:** Widely used in .NET ecosystem

---

### Real-Time Communication
- **SignalR:** ASP.NET Core SignalR
- **Protocol:** WebSockets with fallback to Server-Sent Events

#### Why SignalR?
- **Real-time Updates:** Push data to clients without polling
- **Automatic Reconnection:** Handles network interruptions gracefully
- **Scaling:** Horizontal scaling with Redis backplane (planned)
- **Type-Safe:** Strongly-typed client and server code

---

### IoT Communication
- **Protocol:** MQTT 3.1.1+
- **Broker:** Eclipse Mosquitto
- **Library:** MQTTnet (planned implementation)

#### Why MQTT?
- **Lightweight:** Small header overhead, low bandwidth usage
- **Publish-Subscribe:** Efficient for one-to-many communication
- **Quality of Service:** Configurable delivery guarantees
- **IoT Standard:** Widely used in IoT applications

#### Why Eclipse Mosquitto?
- **Lightweight:** Minimal resource requirements
- **Mature:** Stable, well-tested broker
- **Open Source:** No licensing costs
- **Extensible:** Plugin system for custom features

---

## Infrastructure Technology Stack

### Containerization
- **Docker:** Latest stable version
- **Docker Compose:** Multi-container orchestration
- **Dockerfile:** Multi-stage builds for optimization

#### Why Docker?
- **Consistency:** Same environment across development and production
- **Isolation:** No dependency conflicts between services
- **Portability:** Deploy on any Docker-capable platform
- **Scalability:** Easy horizontal scaling
- **Enterprise Standard:** Widely adopted in DevOps practices

#### Why Multi-stage Builds?
- **Image Size:** Smaller final images for faster deployment
- **Security:** Build tools not included in final image
- **Caching:** Efficient use of Docker layer caching
- **Production Ready:** Optimized for production runtime

---

### Database Infrastructure
- **Container:** PostgreSQL 16-alpine
- **Volume Persistence:** Docker volumes for data durability
- **Port Mapping:** 5433:5432 (avoid port conflicts)

#### Why Alpine Linux?
- **Image Size:** Minimal footprint (~200MB vs ~500MB)
- **Security:** Smaller attack surface
- **Performance:** Optimized for containerized workloads
- **Official Image:** Maintained by PostgreSQL team

---

### MQTT Broker Infrastructure
- **Container:** Eclipse Mosquitto latest
- **Volume Persistence:** Config and data persistence
- **Port Mapping:** 1883:1883 (TCP), 9001:9001 (WebSocket)

---

## Development Environment

### Local Development Setup
- **IDE:** Visual Studio Code (recommended) or Visual Studio
- **Git:** Version control with Git Flow branching
- **Docker Desktop:** Container orchestration
- **.NET CLI:** Command-line tools for .NET development
- **Node.js:** Frontend development server and build tools

### Code Quality Tools
- **ESLint:** Frontend linting
- **SonarQube (optional):** Code quality analysis
- **Pre-commit Hooks:** Automated code quality checks

---

## Production Environment (Planned)

### Deployment Platform
- **Cloud Provider:** AWS/Azure/GCP (to be determined)
- **Compute:** App Service/Container Service
- **Database:** Managed PostgreSQL (RDS/Azure Database)
- **Message Broker:** Managed MQTT service or self-hosted
- **CDN:** Frontend static asset delivery

### CI/CD Pipeline
- **GitHub Actions:** Automated testing and deployment
- **Docker Registry:** Container image management
- **Environment Variables:** Secure configuration management
- **Monitoring:** Application performance monitoring (APM)

---

## Version Management

### Semantic Versioning
- **Major:** Breaking changes (e.g., 1.0 → 2.0)
- **Minor:** New features, backward compatible (e.g., 1.0 → 1.1)
- **Patch:** Bug fixes, backward compatible (e.g., 1.0.0 → 1.0.1)

### Dependency Updates
- **Frontend:** Regular updates to React ecosystem
- **Backend:** Regular updates to .NET packages
- **Security:** Prompt updates for security vulnerabilities
- **Testing:** Regression testing after dependency updates

---

## Performance Characteristics

### Expected Performance
- **API Response Time:** < 100ms for database queries
- **MQTT Latency:** < 50ms from device to broker
- **SignalR Latency:** < 100ms from server to client
- **Database Query Time:** < 50ms for indexed queries

### Scalability Targets
- **Concurrent Users:** Support 100+ simultaneous dashboard users
- **IoT Devices:** Support 1000+ edge devices
- **Data Throughput:** Handle 10,000+ telemetry messages/second
- **Database Storage:** Optimize for 100GB+ of historical data

---

## Security Measures

### Current Security
- **Input Validation:** FluentValidation for all inputs
- **SQL Injection Prevention:** EF Core parameterized queries
- **CORS Configuration:** Controlled access from allowed origins
- **MQTT Authentication:** Username/password for broker access

### Planned Security
- **JWT Authentication:** API token-based authentication
- **Role-Based Access Control:** User permissions and roles
- **Rate Limiting:** API request throttling
- **HTTPS/TLS:** Encrypted all communications
- **Certificate Management:** SSL/TLS certificates for production

---

## Monitoring & Observability (Planned)

### Application Monitoring
- **APM Tool:** Application Performance Monitoring
- **Logging:** Structured logging with Serilog
- **Health Checks:** Endpoint for system health monitoring
- **Metrics:** Performance metrics and custom counters

### Infrastructure Monitoring
- **Container Monitoring:** Docker container health
- **Database Monitoring:** Query performance and connection pooling
- **MQTT Monitoring:** Broker metrics and message throughput
- **Alerting:** Automated alerts for system issues

---

## Technology Selection Rationale

### Enterprise Readiness
- **Proven Technologies:** All technologies have enterprise adoption
- **Long-term Support:** LTS versions with extended support
- **Community Support:** Large, active communities for all technologies
- **Documentation:** Extensive documentation and learning resources

### Development Efficiency
- **Type Safety:** TypeScript and C# for compile-time error checking
- **Developer Experience:** Modern tooling and IDE support
- **Rapid Development:** Fast build times and hot reloading
- **Testing Support:** Built-in testing frameworks and tools

### Performance & Scalability
- **High Performance:** Optimized for real-time and high-throughput scenarios
- **Scalable Architecture:** Clean architecture for easy scaling
- **Database Optimization:** Indexing strategies and query optimization
- **Caching:** Planned implementation for frequently accessed data

---

## Future Technology Enhancements

### Planned Additions
- **Redis:** Caching layer and SignalR backplane
- **TimescaleDB:** Advanced time-series database extension for PostgreSQL
- **Grafana:** Visualization of system metrics and performance
- **Prometheus:** Metrics collection and alerting
- **Elasticsearch:** Full-text search for logs and alerts
- **Kubernetes:** Container orchestration for production scaling

### Evaluation Candidates
- **Microservices Architecture:** Split monolith into services
- **Event Sourcing:** Event-driven architecture for data consistency
- **GraphQL:** Alternative to REST for flexible querying
- **gRPC:** High-performance RPC for service-to-service communication

---

*Last Updated: 2026-04-15*
*Documentation Version: 1.0*