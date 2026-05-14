import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { apiService } from "../services/api";
import { signalRService } from "../services/signalr";
import type { Asset, TelemetryHistoryEntry, TelemetryUpdate } from "../types";
import { HistoryChart } from "../components/assets/HistoryChart";
import { ArrowLeft } from "lucide-react";

/**
 * AssetDigitalTwin Page
 * High-fidelity real-time visualization of a single asset.
 * Orchestrates live SignalR data with historical trends.
 */
export default function AssetDigitalTwin() {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [history, setHistory] = useState<TelemetryHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [assetRes, historyRes] = await Promise.all([
        apiService.getAssetById(id),
        apiService.getTelemetryHistory(id, 50),
      ]);

      if (assetRes.success) setAsset(assetRes.data);
      if (historyRes.success) setHistory(historyRes.data);
    } catch (err) {
      console.error("[DigitalTwin] Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;
    let isConnecting = false;

    const handleUpdate = (update: TelemetryUpdate) => {
      setAsset((prev) => {
        if (!prev || prev.assetCode !== update.assetCode) return prev;
        return {
          ...prev,
          status: update.status as Asset["status"],
          temperature: update.temperature,
          pressure: update.pressure,
          vibration: update.vibration,
        };
      });

      // Append to history for real-time chart update
      setHistory((prev) => {
        const newEntry: TelemetryHistoryEntry = {
          temperature: update.temperature,
          pressure: update.pressure,
          vibration: update.vibration,
          timestamp: update.ingestionTimestamp,
        };
        // Ensure we only append if we have previous data
        if (prev.length === 0) return [newEntry];
        return [...prev.slice(1), newEntry]; // Maintain window size
      });
    };

    const setupTelemetry = async () => {
      if (!asset?.assetCode) return;
      try {
        if (!signalRService.isConnected() && !isConnecting) {
          isConnecting = true;
          await signalRService.connect();
          isConnecting = false;
        }

        if (isMounted) {
          unsubscribe = signalRService.on("onTelemetryUpdate", handleUpdate);
          await signalRService.joinAsset(asset.assetCode);
          console.log(
            `[DigitalTwin] Linked to live telemetry for ${asset.assetCode}`,
          );
        }
      } catch (err) {
        console.error("[DigitalTwin] Telemetry link failed", err);
      }
    };

    setupTelemetry();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
      if (asset?.assetCode && signalRService.isConnected()) {
        signalRService.leaveAsset(asset.assetCode).catch(console.error);
      }
    };
  }, [asset?.assetCode]);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto animate-pulse">
        <div className="flex justify-between mb-10">
          <div>
            <div className="h-4 w-32 bg-[var(--color-industrial-border)]/60 rounded mb-4"></div>
            <div className="h-10 w-64 bg-[var(--color-industrial-border)]/60 rounded mb-2"></div>
            <div className="h-4 w-48 bg-[var(--color-industrial-border)]/60 rounded"></div>
          </div>
          <div className="h-12 w-32 bg-[var(--color-industrial-border)]/60 rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="h-32 bg-[var(--color-industrial-panel)] rounded-2xl border border-[var(--color-industrial-border)]"></div>
          <div className="h-32 bg-[var(--color-industrial-panel)] rounded-2xl border border-[var(--color-industrial-border)]"></div>
          <div className="h-32 bg-[var(--color-industrial-panel)] rounded-2xl border border-[var(--color-industrial-border)]"></div>
        </div>
        <div className="h-4 w-48 bg-[var(--color-industrial-border)]/60 rounded mb-6 mt-10"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[350px] bg-[var(--color-industrial-panel)] rounded-2xl border border-[var(--color-industrial-border)]"></div>
          <div className="h-[350px] bg-[var(--color-industrial-panel)] rounded-2xl border border-[var(--color-industrial-border)]"></div>
          <div className="lg:col-span-2 h-[350px] bg-[var(--color-industrial-panel)] rounded-2xl border border-[var(--color-industrial-border)]"></div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="p-8 text-center mt-20">
        <h2 className="text-2xl font-black text-[var(--color-industrial-text)] mb-4">
          ASSET NOT FOUND
        </h2>
        <Link to="/" className="text-blue-400 font-bold hover:underline">
          Return to Command Center
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/"
              className="p-2 bg-[var(--color-industrial-panel)] border border-[var(--color-industrial-border)] hover:bg-[var(--color-industrial-border)] rounded-xl transition-colors shadow-sm text-[var(--color-industrial-text-muted)]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-xs font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest">
              Digital Twin /{" "}
              <span className="text-blue-400">{asset.assetCode}</span>
            </span>
          </div>
          <h1 className="text-4xl font-black text-[var(--color-industrial-text)] tracking-tight">
            {asset.name}
          </h1>
          <p className="text-[var(--color-industrial-text-muted)] font-medium mt-1 uppercase text-xs tracking-tighter">
            Location:{" "}
            <span className="text-[var(--color-industrial-text)] font-bold">
              {asset.location}
            </span>{" "}
            • Type:{" "}
            <span className="text-[var(--color-industrial-text)] font-bold">
              {asset.type}
            </span>
          </p>
        </div>

        <div
          className={`
           px-6 py-3 rounded-2xl border-2 flex items-center gap-4 shadow-lg
           ${
             asset.status === "Running"
               ? "bg-emerald-950/50 border-emerald-500/30 text-emerald-400"
               : asset.status === "Critical"
                 ? "bg-rose-950/50 border-rose-500/30 text-rose-400 animate-pulse"
                 : "bg-amber-950/50 border-amber-500/30 text-amber-400"
           }
        `}
        >
          <div
            className={`status-dot ${asset.status === "Running" ? "status-dot-running" : asset.status === "Critical" ? "status-dot-critical" : "status-dot-warning"}`}
          ></div>
          <span className="font-black uppercase tracking-widest text-sm">
            {asset.status}
          </span>
        </div>
      </div>

      {/* Real-time Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="industrial-panel p-6">
          <span className="text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest block mb-1">
            Live Temperature
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[var(--color-industrial-text)] font-mono-numbers">
              {asset.temperature?.toFixed(1) ?? "--"}
            </span>
            <span className="text-lg font-bold text-[var(--color-industrial-text-muted)] italic">
              °C
            </span>
          </div>
        </div>
        <div className="industrial-panel p-6">
          <span className="text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest block mb-1">
            Live Pressure
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[var(--color-industrial-text)] font-mono-numbers">
              {asset.pressure?.toFixed(1) ?? "--"}
            </span>
            <span className="text-lg font-bold text-[var(--color-industrial-text-muted)] italic">
              PSI
            </span>
          </div>
        </div>
        <div className="industrial-panel p-6">
          <span className="text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest block mb-1">
            Live Vibration
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[var(--color-industrial-text)] font-mono-numbers">
              {asset.vibration?.toFixed(1) ?? "--"}
            </span>
            <span className="text-lg font-bold text-[var(--color-industrial-text-muted)] italic">
              mm/s
            </span>
          </div>
        </div>
      </div>

      {/* Historical Charts */}
      <h2 className="text-sm font-black text-[var(--color-industrial-text-muted)] uppercase tracking-[0.3em] mb-6">
        Telemetry Analytics Stream
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HistoryChart
          data={history}
          title="Temperature History"
          dataKey="temperature"
          color="#10b981"
          unit="°C"
          threshold={asset.criticalTemperature ?? 100}
        />
        <HistoryChart
          data={history}
          title="Pressure History"
          dataKey="pressure"
          color="#f59e0b"
          unit="PSI"
          threshold={asset.criticalPressure ?? 500}
        />
        <HistoryChart
          data={history}
          title="Vibration Profile"
          dataKey="vibration"
          color="#ec4899"
          unit="mm/s"
          threshold={asset.criticalVibration ?? 10.0}
        />
      </div>
    </div>
  );
}
