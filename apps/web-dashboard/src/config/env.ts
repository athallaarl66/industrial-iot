/**
 * Environment Configuration
 * Centralized environment variable access with type safety
 */

export interface AppConfig {
  api: {
    baseUrl: string;
  };
  signalr: {
    hubUrl: string;
  };
  app: {
    name: string;
    version: string;
  };
  features: {
    darkMode: boolean;
    debugMode: boolean;
    authEnabled: boolean;
  };
  auth: {
    tokenKey: string;
  };
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, fallback: string): string {
  return import.meta.env[key] || fallback;
}

/**
 * Parse boolean environment variable
 */
function getBoolEnvVar(key: string, fallback: boolean): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return fallback;
  return value === 'true' || value === '1';
}

/**
 * Application configuration
 */
export const config: AppConfig = {
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5234'),
  },
  signalr: {
    hubUrl: getEnvVar('VITE_SIGNALR_HUB_URL', 'http://localhost:5234/telemetryhub'),
  },
  app: {
    name: getEnvVar('VITE_APP_NAME', 'Industrial IoT Dashboard'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  },
  features: {
    darkMode: getBoolEnvVar('VITE_ENABLE_DARK_MODE', true),
    debugMode: getBoolEnvVar('VITE_ENABLE_DEBUG_MODE', false),
    authEnabled: getBoolEnvVar('VITE_AUTH_ENABLED', false),
  },
  auth: {
    tokenKey: getEnvVar('VITE_AUTH_TOKEN_KEY', 'iiot_auth_token'),
  },
};

export default config;
