import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { StatsCards } from "./dashboard/StatsCards";
import { ActivityFeed } from "./dashboard/ActivityFeed";
import { AssetGrid } from "./dashboard/AssetGrid";
import { RefreshCw } from "lucide-react";

/**
 * Dashboard Stats Interface
 */
interface DashboardStats {
  totalAssets: number;
  runningAssets: number;
  warningAssets: number;
  criticalAssets: number;
  activeAlerts: number;
}

/**
 * Dashboard Component
 * The high-level monitoring 'Command Center' for assets.
 * Dark Mode Industrial theme.
 */
export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAssets: 0,
    runningAssets: 0,
    warningAssets: 0,
    criticalAssets: 0,
    activeAlerts: 0,
  });
  const [loading, setLoading] = useState(true);

  /**
   * Summarizes fleet health from the registry.
   */
  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getAssets();
      if (response.success && response.data) {
        const assets = response.data;
        const running = assets.filter((a) => a.status === "Running").length;
        const warning = assets.filter((a) => a.status === "Warning").length;
        const critical = assets.filter((a) => a.status === "Critical").length;

        setStats({
          totalAssets: assets.length,
          runningAssets: running,
          warningAssets: warning,
          criticalAssets: critical,
          activeAlerts: warning + critical,
        });
      }
    } catch (e) {
      console.error("[Dashboard] High-level metrics retrieval failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="space-y-12">
        {/* Command Center Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
          <div>
            <h2 className="text-4xl font-black text-white tracking-tight flex items-center">
              Command Center
              <span className="ml-4 px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-black uppercase rounded-lg border border-blue-800/50">
                Live
              </span>
            </h2>
            <p className="text-slate-400 mt-2 text-lg font-medium">
              Bird's-eye view of all industrial assets and facility health.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={loadStats}
              className="p-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-all shadow-sm"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Aggregated Health Metrics */}
        <StatsCards stats={stats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Visualization Grid (Grid of All Assets per Architecture doc) */}
          <div className="lg:col-span-2 industrial-panel p-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight">
                Active Fleet Deployment
              </h3>
              <div className="flex space-x-4">
                <div className="flex items-center text-xs font-bold text-slate-400 uppercase">
                  <span className="status-dot status-dot-running"></span>{" "}
                  Running
                </div>
                <div className="flex items-center text-xs font-bold text-slate-400 uppercase">
                  <span className="status-dot status-dot-warning"></span>{" "}
                  Warning
                </div>
                <div className="flex items-center text-xs font-bold text-slate-400 uppercase">
                  <span className="status-dot status-dot-critical"></span>{" "}
                  Critical
                </div>
              </div>
            </div>

            <div className="flex-1">
              <AssetGrid />
            </div>
          </div>

          <div className="space-y-10">
            {/* Health Distribution Panel */}
            <div className="industrial-panel p-8">
              <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight mb-8">
                Health Index
              </h3>
              <div className="space-y-8">
                {[
                  {
                    label: "Running",
                    count: stats.runningAssets,
                    text: "text-emerald-400",
                    color: "bg-emerald-500",
                    track: "bg-emerald-950/50",
                    tooltip:
                      "Operating natively within established baseline parameters.",
                  },
                  {
                    label: "Warning",
                    count: stats.warningAssets,
                    text: "text-amber-400",
                    color: "bg-amber-500",
                    track: "bg-amber-950/50",
                    tooltip:
                      "Approaching predictive limits. Requires monitoring.",
                  },
                  {
                    label: "Critical",
                    count: stats.criticalAssets,
                    text: "text-rose-400",
                    color: "bg-rose-500",
                    track: "bg-rose-950/50",
                    tooltip:
                      "Exceeding safety bounds. Immediate intervention required.",
                  },
                ].map((item) => (
                  <div key={item.label} className="group relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        {item.label}
                      </span>
                      <span
                        className={`text-xl font-black font-mono-numbers ${item.text}`}
                      >
                        {loading ? "0" : item.count}
                      </span>
                    </div>
                    <div
                      className={`w-full ${item.track} rounded-full h-3 cursor-help relative overflow-hidden border border-slate-800`}
                    >
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-1000 shadow-[0_0_10px_currentColor]`}
                        style={{
                          width:
                            stats.totalAssets > 0
                              ? `${(item.count / stats.totalAssets) * 100}%`
                              : "0%",
                        }}
                      ></div>
                    </div>
                    {/* Tooltip Hover */}
                    <div className="absolute left-0 -top-12 bg-[var(--color-industrial-panel)] border border-[var(--color-industrial-border)] text-[var(--color-industrial-text)] text-[10px] px-3 py-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 font-bold uppercase tracking-widest shadow-2xl">
                      {item.tooltip}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Intel Card */}
            <div className="industrial-panel p-8 border border-[var(--color-industrial-border)] shadow-[0_0_30px_rgba(37,99,235,0.1)]">
              <h4 className="text-xs font-black text-[var(--color-industrial-accent)] uppercase tracking-[0.2em] mb-4">
                Network Node Status
              </h4>
              <p className="text-[var(--color-industrial-text)] text-lg font-bold leading-snug">
                {stats.criticalAssets > 0
                  ? `Action Required: ${stats.criticalAssets} assets are in a critical state. Diagnostics suggested.`
                  : "System Wide Alert: All nodes are operating within established performance baselines."}
              </p>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[var(--color-industrial-text-muted)] uppercase">
                  Gateway Uplink Stable
                </span>
                <div className="flex -space-x-2">
                  {stats.totalAssets > 0 ? (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-industrial-border)] bg-blue-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                        MQ
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-industrial-border)] bg-blue-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg -ml-2">
                        WS
                      </div>
                    </div>
                  ) : (
                    <>
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border border-blue-800 bg-blue-900/50"
                        ></div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed Container */}
        <div className="industrial-panel overflow-hidden">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
