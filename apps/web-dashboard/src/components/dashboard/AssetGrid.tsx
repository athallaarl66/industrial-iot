import { useState, useEffect, useCallback, useRef } from "react";
import type { Asset, TelemetryUpdate } from "../../types";
import { apiService } from "../../services/api";
import { signalRService } from "../../services/signalr";
import { AssetStatusCard } from "./AssetStatusCard";

/**
 * AssetGrid Component
 * Orchestrates the visualization layer of all industrial nodes.
 * Connects to SignalR for real-time status syncing within the dashboard view.
 */
export function AssetGrid() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const isConnecting = useRef(false);

  const loadAssets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getAssets();
      if (response.success && response.data) {
        setAssets(response.data);
      }
    } catch (e) {
      console.error("[AssetGrid] Failed to fetch live fleet data.");
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
            }
          : asset,
      ),
    );
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const initConnection = async () => {
      try {
        if (!signalRService.isConnected() && !isConnecting.current) {
          isConnecting.current = true;
          await signalRService.connect();
        }
        
        if (isMounted) {
          unsubscribe = signalRService.on("onTelemetryUpdate", handleTelemetryUpdate);
          assets.forEach((a) => signalRService.joinAsset(a.assetCode));
          console.log("[AssetGrid] Linked to live telemetry stream.");
        }
      } catch (err) {
        console.error("[AssetGrid] SignalR handshake failed:", err);
      } finally {
        isConnecting.current = false;
      }
    };

    if (assets.length > 0) {
      initConnection();
    }

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [assets.length, handleTelemetryUpdate]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="industrial-panel h-48 bg-slate-50 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {assets.map((asset) => (
        <AssetStatusCard key={asset.id} asset={asset} />
      ))}
      
      {assets.length === 0 && (
        <div className="col-span-full py-16 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Active Nodes In Range</p>
        </div>
      )}
    </div>
  );
}
