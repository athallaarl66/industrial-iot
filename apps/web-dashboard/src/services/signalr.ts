import * as signalR from "@microsoft/signalr";
import type { TelemetryUpdate } from "../types";
import { config } from "../config/env";
import { parseApiError, getUserFriendlyError, logError } from "../utils/errors";

export interface SignalREvents {
  onTelemetryUpdate: (update: TelemetryUpdate) => void;
  onAlert: (data: {
    assetCode: string;
    message: string;
    severity: string;
  }) => void;
}

export type SignalREventNames = "onTelemetryUpdate" | "onAlert";

export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private callbacks: Partial<SignalREvents> = {};

  async connect(): Promise<void> {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(config.signalr.hubUrl)
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .build();

      this.connection.on("TelemetryUpdate", (update: unknown) => {
        const data = update as Record<string, unknown>;
        const normalizedUpdate = {
          assetCode: (data.AssetCode || data.assetCode) as string,
          temperature: (data.Temperature ?? data.temperature) as number,
          pressure: (data.Pressure ?? data.pressure) as number,
          vibration: (data.Vibration ?? data.vibration) as number,
          status: (data.Status || data.status) as string,
          ingestionTimestamp: (data.IngestionTimestamp || data.ingestionTimestamp) as string,
          alertMessage: (data.AlertMessage || data.alertMessage) as string | undefined,
        };
        this.callbacks.onTelemetryUpdate?.(normalizedUpdate as TelemetryUpdate);
      });

      this.connection.on("AlertUpdate", (data: Record<string, unknown>) => {
        const normalizedAlert = {
          assetCode: (data.AssetCode || data.assetCode) as string,
          message: (data.Message || data.message) as string,
          severity: (data.Severity || data.severity) as string,
        };
        this.callbacks.onAlert?.(normalizedAlert);
      });

      this.connection.onclose(() => {
        logError(
          { message: 'SignalR connection closed', code: 'CONNECTION_CLOSED' },
          'SignalR'
        );
      });

      this.connection.onreconnecting(() => {
        console.log('SignalR reconnecting...');
      });

      this.connection.onreconnected(() => {
        console.log('SignalR reconnected');
      });

      await this.connection.start();
      console.log('SignalR connected');
    } catch (error) {
      const parsedError = parseApiError(error);
      logError(parsedError, 'SignalR connect');
      throw new Error(getUserFriendlyError(parsedError));
    }
  }

  on(
    event: keyof SignalREvents,
    callback: SignalREvents[keyof SignalREvents],
  ): void {
    (this.callbacks as Record<string, (...args: any[]) => void>)[event] =
      callback;
  }

  async joinAsset(assetCode: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("JoinAsset", assetCode);
      console.log(`Joined asset group: ${assetCode}`);
    }
  }

  async leaveAsset(assetCode: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("LeaveAsset", assetCode);
    }
  }

  async disconnect(): Promise<void> {
    await Promise.all(
      Object.keys(this.callbacks).map((code) => this.leaveAsset(code)),
    );
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  isConnected(): boolean {
    return (
      !!this.connection &&
      this.connection.state === signalR.HubConnectionState.Connected
    );
  }
}

export const signalRService = new SignalRService();
