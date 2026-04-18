import * as signalR from "@microsoft/signalr";
import type { TelemetryUpdate } from "../types";

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
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5234/telemetryhub")
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    this.connection.on("TelemetryUpdate", (update: TelemetryUpdate) => {
      this.callbacks.onTelemetryUpdate?.(update);
    });

    this.connection.on("AlertUpdate", (data: Record<string, unknown>) => {
      this.callbacks.onAlert?.(
        data as { assetCode: string; message: string; severity: string },
      );
    });

    this.connection.onclose(() => {
      console.log("SignalR connection closed. Attempting reconnect...");
    });

    await this.connection.start();
    console.log("SignalR connected");
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
