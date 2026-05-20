import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Make environment variables available at build time
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'http://localhost:5234'),
    'import.meta.env.VITE_SIGNALR_HUB_URL': JSON.stringify(process.env.VITE_SIGNALR_HUB_URL || 'http://localhost:5234/telemetryhub'),
    'import.meta.env.VITE_APP_NAME': JSON.stringify(process.env.VITE_APP_NAME || 'Industrial IoT Dashboard'),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.VITE_APP_VERSION || '1.0.0'),
    'import.meta.env.VITE_ENABLE_DARK_MODE': JSON.stringify(process.env.VITE_ENABLE_DARK_MODE || 'true'),
    'import.meta.env.VITE_ENABLE_DEBUG_MODE': JSON.stringify(process.env.VITE_ENABLE_DEBUG_MODE || 'false'),
    'import.meta.env.VITE_AUTH_ENABLED': JSON.stringify(process.env.VITE_AUTH_ENABLED || 'false'),
    'import.meta.env.VITE_AUTH_TOKEN_KEY': JSON.stringify(process.env.VITE_AUTH_TOKEN_KEY || 'iiot_auth_token'),
  },
})
