import { useState, useEffect, useCallback, useRef } from "react";
import type { Asset, TelemetryUpdate } from "../types";
import { apiService } from "../services/api";
import { signalRService } from "../services/signalr";
import { AssetTable } from "./assets/AssetTable";

interface AssetListProps {
  onDelete: (id: string) => void;
  refreshTrigger?: number;
}

/**
 * AssetList Component
 * Logic container for managing asset state and real-time telemetry updates.
 * Pivoted to Industrial Light theme.
 */
export function AssetList({ onDelete, refreshTrigger }: AssetListProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isConnecting = useRef(false);

  /**
   * Data synchronization with the backend registry.
   */
  const loadAssets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getAssets();
      if (response.success && response.data) {
        setAssets(response.data);
        setError(null);
      } else {
        setError(response.message || "The asset registry is currently unavailable.");
      }
    } catch {
      setError("High-frequency synchronization error. Verify backend status.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTelemetryUpdate = useCallback((update: TelemetryUpdate) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.assetCode === update.assetCode
          ? {
              ...asset,
              status: update.status as Asset["status"],
              temperature: update.temperature,
              pressure: update.pressure,
              vibration: update.vibration,
              lastUpdate: update.ingestionTimestamp,
              alertMessage: update.alertMessage,
            }
          : asset,
      ),
    );
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets, refreshTrigger]);

  // Real-time Gateway Lifecycle
  useEffect(() => {
    let isMounted = true;

    const connectGateway = async () => {
      if (isConnecting.current || signalRService.isConnected()) return;
      
      try {
        isConnecting.current = true;
        await signalRService.connect();
        
        if (isMounted) {
          signalRService.on("onTelemetryUpdate", handleTelemetryUpdate);
          assets.forEach((a) => signalRService.joinAsset(a.assetCode));
          console.log("[Gateway] Real-time telemetry link operational.");
        }
      } catch (err) {
        console.error("[Gateway] Handshake failed:", err);
      } finally {
        isConnecting.current = false;
      }
    };

    if (assets.length > 0) {
      connectGateway();
    }

    return () => {
      isMounted = false;
      // We don't disconnect immediately to allow smooth transitions, 
      // but we remove listeners if needed.
    };
  }, [assets.length, handleTelemetryUpdate]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
          <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Syncing Registry</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Establishing Secure Data Link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="industrial-panel p-12 text-center max-w-xl mx-auto mt-20 bg-rose-50 border-rose-100">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-rose-100">
          <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h4 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">System Interruption</h4>
        <p className="text-sm text-slate-600 mb-8 font-medium">{error}</p>
        <button
          onClick={loadAssets}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest"
        >
          Re-establish Connection
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
      <AssetTable assets={assets} onDelete={onDelete} />
    </div>
  );
}
