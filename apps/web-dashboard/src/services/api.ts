import type { Asset, CreateAssetForm as CreateAssetDto } from '../types';
import { config } from '../config/env';
import { parseApiError, getUserFriendlyError, logError } from '../utils/errors';



export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${config.api.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

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

  /**
   * Get API base URL from config
   */
  getBaseUrl(): string {
    return config.api.baseUrl;
  }
}

export const apiService = new ApiService();