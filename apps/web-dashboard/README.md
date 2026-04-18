# Industrial IoT Web Dashboard

Enterprise-grade monitoring dashboard for Industrial IoT assets with real-time telemetry, alerts, and asset management capabilities.

## 🚀 Features

- **Real-time Monitoring**: Live telemetry updates via SignalR WebSockets
- **Asset Management**: Create, view, and delete industrial assets
- **Alert System**: Real-time alerts for temperature, pressure, and vibration anomalies
- **Dark Mode**: Industrial-grade dark theme for 24/7 monitoring environments
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Type-Safe**: Built with TypeScript for robust code quality
- **Production-Ready**: Proper error handling, logging, and environment configuration

## 📋 Prerequisites

- Node.js 18+ and npm
- Running Industrial IoT API backend
- Access to MQTT Broker (for telemetry data)
- PostgreSQL database (for historical data)

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.4 with TypeScript 6.0.2
- **Build Tool**: Vite 8.0.4
- **Styling**: Tailwind CSS v4 with custom industrial theme
- **Real-time**: SignalR (@microsoft/signalr v10.0.0)
- **Routing**: React Router DOM v7.14.1
- **State Management**: React Hooks (useState, useEffect, useCallback)

## 🏗️ Project Structure

```
apps/web-dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx       # Main app layout with sidebar
│   │   ├── Dashboard.tsx    # Dashboard overview with stats
│   │   ├── AssetForm.tsx    # Asset creation form
│   │   ├── AssetList.tsx    # Asset listing with real-time updates
│   │   └── DeleteDialog.tsx # Confirmation dialog
│   ├── pages/               # Page components
│   │   ├── DashboardPage.tsx
│   │   └── AssetsPage.tsx
│   ├── services/            # API and real-time services
│   │   ├── api.ts           # REST API client
│   │   └── signalr.ts       # SignalR connection manager
│   ├── contexts/            # React contexts
│   │   └── ThemeContext.tsx # Dark mode theme provider
│   ├── utils/               # Utility functions
│   │   └── errors.ts        # Error handling utilities
│   ├── config/              # Configuration
│   │   └── env.ts           # Environment variables
│   ├── types/               # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
├── public/                  # Static assets
├── .env                     # Environment variables (development)
├── .env.example             # Environment template
├── .env.production          # Environment variables (production)
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 Getting Started

### 1. Installation

```bash
cd apps/web-dashboard
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5234/api/v1
VITE_SIGNALR_HUB_URL=http://localhost:5234/telemetryhub

# Application Configuration
VITE_APP_NAME=Industrial IoT Dashboard
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_DEBUG_MODE=false

# Authentication (Future)
VITE_AUTH_ENABLED=false
VITE_AUTH_TOKEN_KEY=iiot_auth_token
```

### 3. Development Server

```bash
npm run dev
```

Dashboard will be available at `http://localhost:5173`

### 4. Production Build

```bash
npm run build
npm run preview
```

## 🎨 Features Overview

### Dashboard Page
- **Asset Statistics**: Total assets, running assets, active alerts
- **Status Distribution**: Real-time asset status breakdown
- **Recent Activity**: Live feed of asset status changes
- **Performance Metrics**: Temperature and pressure trends

### Assets Page
- **Asset Creation**: Form with validation for O&G asset codes
- **Asset Listing**: Table view with real-time telemetry updates
- **Asset Deletion**: Safe deletion with confirmation dialog
- **Real-time Updates**: Automatic updates via SignalR

### Theme System
- **Dark Mode**: Default industrial dark theme
- **Light Mode**: Alternative light theme
- **Persistence**: Theme preference saved to localStorage
- **Toggle**: Easy theme switching from header

## 📡 API Integration

### REST API Endpoints

```typescript
// Asset Management
GET    /api/v1/assets           // Get all assets
GET    /api/v1/assets/{id}      // Get specific asset
POST   /api/v1/assets           // Create new asset
DELETE /api/v1/assets/{id}      // Delete asset

// Alerts
GET    /api/v1/alerts           // Get recent alerts
POST   /api/v1/alerts/{id}/acknowledge // Acknowledge alert
```

### SignalR Events

```typescript
// Real-time telemetry updates
"TelemetryUpdate" -> {
  assetCode: string,
  temperature: number,
  pressure: number,
  vibration: number,
  status: string,
  ingestionTimestamp: string,
  alertMessage?: string
}

// Alert notifications
"AlertUpdate" -> {
  assetCode: string,
  message: string,
  severity: string
}
```

## 🔧 Configuration

### Build Configuration

The project uses Vite for fast development and optimized production builds:

- **Development**: Hot Module Replacement (HMR) for instant updates
- **Production**: Code splitting, tree shaking, and asset optimization
- **TypeScript**: Strict type checking enabled

### Tailwind CSS Configuration

Custom industrial theme with:
- **Primary Colors**: Professional blue shades
- **Status Colors**: Green (running), Yellow (warning), Red (critical)
- **Dark Mode**: Slate-based dark theme for 24/7 operations
- **Responsive**: Mobile-first responsive design

## 🐛 Error Handling

The application includes comprehensive error handling:

- **API Errors**: User-friendly error messages for network issues
- **Validation Errors**: Inline form validation with clear messages
- **Connection Errors**: Graceful handling of SignalR disconnections
- **Logging**: Structured error logging (debug mode)

## 🔒 Security Considerations

**Current Status**: Authentication not yet implemented (Phase 6)

**Planned Security Features**:
- JWT-based authentication
- Role-based access control (RBAC)
- Secure token storage
- API request signing
- CORS policy enforcement

## 📊 Performance

- **Build Size**: ~314KB (gzipped: ~95KB)
- **First Load JS**: ~316KB
- **CSS**: ~33KB (gzipped: ~6KB)
- **Lighthouse Score**: Optimized for performance

## 🧪 Testing

**Status**: Testing infrastructure not yet implemented (Phase 7)

**Planned Testing**:
- Component tests (React Testing Library)
- Integration tests (API services)
- E2E tests (Playwright/Cypress)

## 🚀 Deployment

### Docker Deployment

```dockerfile
# Multi-stage build (to be implemented)
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

### Environment Variables

Production deployment requires:
- `VITE_API_BASE_URL`: Production API endpoint
- `VITE_SIGNALR_HUB_URL`: Production SignalR endpoint
- `VITE_ENABLE_DARK_MODE`: Set to `true`
- `VITE_ENABLE_DEBUG_MODE`: Set to `false`

## 📝 Development Guidelines

### Code Style

- **Functional Components**: Use React functional components with hooks
- **TypeScript**: Strict typing for all components and functions
- **Naming**: camelCase for variables, PascalCase for components
- **Error Handling**: Always handle errors gracefully with user-friendly messages
- **Comments**: Explain "why" not "what" - code should be self-documenting

### Best Practices

1. **State Management**: Use React hooks for local state
2. **API Calls**: Centralize in service layer
3. **Error Handling**: Use utility functions for consistent error messages
4. **Type Safety**: Leverage TypeScript for catch errors at compile time
5. **Performance**: Use `useCallback` and `useMemo` for expensive operations

## 🐛 Known Issues

- Authentication system not yet implemented
- No offline support
- Limited mobile optimization
- Chart library not yet integrated

## 🗺️ Roadmap

### Phase 5: Alert System (70% Complete)
- [ ] Active alerts dashboard
- [ ] Alert filtering and search
- [ ] Alert notification preferences

### Phase 6: Security (0% Complete)
- [ ] JWT authentication
- [ ] RBAC implementation
- [ ] Secure token storage

### Phase 7: Testing (0% Complete)
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

### Phase 8: Deployment (0% Complete)
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Production deployment

## 📄 License

This project is part of the Industrial IoT Asset Monitoring System.

## 🤝 Contributing

This is a portfolio project for demonstrating industrial IoT development skills. For questions or suggestions, please refer to the main project documentation.

## 📞 Support

For issues, questions, or contributions, please refer to the main project documentation at `/docs/`.

---

**Built with ❤️ for Industrial IoT Portfolio Project**
