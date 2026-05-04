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
  warningTemperature?: number;
  criticalTemperature?: number;
  warningPressure?: number;
  criticalPressure?: number;
  warningVibration?: number;
  criticalVibration?: number;
}

export interface CreateAssetForm {
  assetCode: string;
  name: string;
  type: string;
  location: string;
  warningTemperature?: number;
  criticalTemperature?: number;
  warningPressure?: number;
  criticalPressure?: number;
  warningVibration?: number;
  criticalVibration?: number;
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

export interface TelemetryHistoryEntry {
  temperature: number;
  pressure: number;
  vibration: number;
  timestamp: string;
}

export interface AlertDto {
  id: string;
  assetCode: string;
  assetName: string;
  type: string;
  severity: "Warning" | "Critical";
  message: string;
  currentValue: number;
  threshold: number;
  edgeTimestamp: string;
  acknowledged: boolean;
  resolved: boolean;
  createdAt: string;
}
