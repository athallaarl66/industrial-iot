export interface Asset {
  id: string;
  assetCode: string;
  name: string;
  type: string;
  location: string;
  status: "Running" | "Warning" | "Critical" | "Maintenance";
  createdAt: string;
  temperature?: number;
  pressure?: number;
  vibration?: number;
  lastUpdate?: string;
  alertMessage?: string;
}

export interface CreateAssetForm {
  assetCode: string;
  name: string;
  type: string;
  location: string;
}

export interface TelemetryData {
  id: string;
  assetId: string;
  temperature: number;
  pressure: number;
  vibration: number;
  timestamp: string;
}

export type AssetStatus = Asset["status"];

export interface TelemetryUpdate {
  assetCode: string;
  temperature: number;
  pressure: number;
  vibration: number;
  status: string;
  ingestionTimestamp: string;
  alertMessage?: string;
}
