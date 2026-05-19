import type { Asset, CreateAssetForm as CreateAssetDto } from '../types';
import { config } from '../config/env';
import { parseApiError, getUserFriendlyError, logError } from '../utils/errors';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
}

export interface EdgeCredential {
  id: string;
  assetCode: string;
  token: string;
  isActive: boolean;
  createdAt: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
        headers: {
          ...headers,
          ...options.headers,
        },
        ...options,
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }

      const data = await response.json();

      if (!response.ok) {
        const error = parseApiError(data);
        logError(error, `API ${options.method || 'GET'} ${endpoint}`);

        return {
          success: false,
          message: getUserFriendlyError(error),
          data: null as T,
          errorCode: error.code || 'UNKNOWN_ERROR',
        };
      }

      return data;
    } catch (error) {
      const parsedError = parseApiError(error);
      logError(parsedError, `API ${options.method || 'GET'} ${endpoint}`);

      return {
        success: false,
        message: getUserFriendlyError(parsedError),
        data: null as T,
        errorCode: parsedError.code || 'UNKNOWN_ERROR',
      };
    }
  }

  async login(username: string, password: string): Promise<ApiResponse<{ token: string; username: string; role: string }>> {
    return this.request<{ token: string; username: string; role: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getAssets(): Promise<ApiResponse<Asset[]>> {
    return this.request<Asset[]>('/assets');
  }

  async getAssetById(id: string): Promise<ApiResponse<Asset>> {
    return this.request<Asset>(`/assets/${id}`);
  }

  async createAsset(asset: CreateAssetDto): Promise<ApiResponse<Asset>> {
    return this.request<Asset>('/assets', {
      method: 'POST',
      body: JSON.stringify(asset),
    });
  }

  async deleteAsset(id: string): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(`/assets/${id}`, {
      method: 'DELETE',
    });
  }

  async getTelemetryHistory(id: string, limit: number = 50): Promise<ApiResponse<import('../types').TelemetryHistoryEntry[]>> {
    return this.request<import('../types').TelemetryHistoryEntry[]>(`/assets/${id}/telemetry?limit=${limit}`);
  }

  async getAlerts(count: number = 50): Promise<ApiResponse<import('../types').AlertDto[]>> {
    return this.request<import('../types').AlertDto[]>(`/alerts?count=${count}`);
  }

  async getEdgeCredentials(): Promise<ApiResponse<EdgeCredential[]>> {
    return this.request<EdgeCredential[]>('/edge/credentials');
  }

  async provisionEdgeCredential(assetCode: string): Promise<ApiResponse<EdgeCredential>> {
    return this.request<EdgeCredential>('/edge/credentials', {
      method: 'POST',
      body: JSON.stringify({ assetCode }),
    });
  }

  async revokeEdgeCredential(id: string): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(`/edge/credentials/${id}/revoke`, {
      method: 'POST',
    });
  }

  /**
   * Get API base URL from config
   */
  getBaseUrl(): string {
    return config.api.baseUrl;
  }
}

export const apiService = new ApiService();