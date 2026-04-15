const API_BASE_URL = 'http://localhost:5234/api/v1';

export interface Asset {
  id: string;
  assetCode: string;
  name: string;
  type: string;
  location: string;
  status: string;
  createdAt: string;
}

export interface CreateAssetDto {
  assetCode: string;
  name: string;
  type: string;
  location: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode: string | null;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: 'Failed to connect to API',
        data: null as T,
        errorCode: 'CONNECTION_ERROR',
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
}

export const apiService = new ApiService();