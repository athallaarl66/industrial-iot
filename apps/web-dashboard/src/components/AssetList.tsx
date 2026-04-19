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
    let unsubscribe: (() => void) | undefined;

    const setupGateway = async () => {
      try {
        if (!signalRService.isConnected() && !isConnecting.current) {
          isConnecting.current = true;
          await signalRService.connect();
        }
        
        if (isMounted) {
          unsubscribe = signalRService.on("onTelemetryUpdate", handleTelemetryUpdate);
          assets.forEach((a) => signalRService.joinAsset(a.assetCode));
          console.log("[Registry] Real-time telemetry link operational.");
        }
      } catch (err) {
        console.error("[Registry] Handshake failed:", err);
      } finally {
        isConnecting.current = false;
      }
    };

    if (assets.length > 0) {
      setupGateway();
    }

    return () => {
      isMounted = false;
      // Cleanup the event listener when unmounting or re-running
      if (unsubscribe) unsubscribe();
    };
  }, [assets.length, handleTelemetryUpdate]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <th key={i} className="px-6 py-4">
                    <div className="h-3 bg-slate-200 rounded w-20"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32 mb-2"></div><div className="h-3 bg-slate-100 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-5 bg-slate-200 rounded-full w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-lg w-24"></div></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4">
                      <div className="h-8 bg-slate-200 rounded w-12"></div>
                      <div className="h-8 bg-slate-200 rounded w-12"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
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
