import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import { StatsCards } from "./dashboard/StatsCards";
import { ActivityFeed } from "./dashboard/ActivityFeed";

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
 * Standard Industrial Light theme.
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
        const running = assets.filter(a => a.status === "Running").length;
        const warning = assets.filter(a => a.status === "Warning").length;
        const critical = assets.filter(a => a.status === "Critical").length;

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
              Command Center
              <span className="ml-4 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black uppercase rounded-lg border border-blue-100">Live</span>
            </h2>
            <p className="text-slate-500 mt-2 text-lg font-medium">
              Bird's-eye view of all industrial assets and facility health.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={loadStats} className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-white transition-all shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Aggregated Health Metrics */}
        <StatsCards stats={stats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Visualization Grid (Grid of All Assets per Architecture doc) */}
          <div className="lg:col-span-2 industrial-panel p-8 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Active Fleet Deployment</h3>
              <div className="flex space-x-4">
                 <div className="flex items-center text-xs font-bold text-slate-400 uppercase">
                   <span className="status-dot status-dot-running"></span> Running
                 </div>
                 <div className="flex items-center text-xs font-bold text-slate-400 uppercase">
                   <span className="status-dot status-dot-warning"></span> Warning
                 </div>
                 <div className="flex items-center text-xs font-bold text-slate-400 uppercase">
                   <span className="status-dot status-dot-critical"></span> Critical
                 </div>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A2 2 0 012.447 15.488V5.012a2 2 0 011.106-1.789L9 0.5l5.447 2.723a2 2 0 011.106 1.789v10.476a2 2 0 01-1.106 1.789L9 20z" />
                </svg>
              </div>
              <p className="text-slate-600 font-bold text-lg mb-2">Fleet Visualization Layer</p>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                Connect your <strong>Digital Twin</strong> simulation to render the live facility grid map.
              </p>
            </div>
          </div>

          <div className="space-y-10">
            {/* Health Distribution Panel */}
            <div className="industrial-panel p-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-8">Health Index</h3>
              <div className="space-y-8">
                {[
                  { label: "Running", count: stats.runningAssets, text: "text-emerald-600", color: "bg-emerald-500", track: "bg-emerald-50" },
                  { label: "Warning", count: stats.warningAssets, text: "text-amber-600", color: "bg-amber-500", track: "bg-amber-50" },
                  { label: "Critical", count: stats.criticalAssets, text: "text-rose-600", color: "bg-rose-500", track: "bg-rose-50" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                      <span className={`text-xl font-black ${item.text}`}>{loading ? "0" : item.count}</span>
                    </div>
                    <div className={`w-full ${item.track} rounded-full h-3`}>
                      <div 
                        className={`h-3 rounded-full ${item.color} transition-all duration-1000 shadow-sm`}
                        style={{ width: stats.totalAssets > 0 ? `${(item.count / stats.totalAssets) * 100}%` : "0%" }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Intel Card */}
            <div className="industrial-panel p-8 bg-blue-600 border-none shadow-blue-600/20">
               <h4 className="text-xs font-black text-white/60 uppercase tracking-[0.2em] mb-4">Network Node Status</h4>
               <p className="text-white text-lg font-bold leading-snug">
                 {stats.criticalAssets > 0 
                   ? `Action Required: ${stats.criticalAssets} assets are in a critical state. Diagnostics suggested.` 
                   : "System Wide Alert: All nodes are operating within established performance baselines."}
               </p>
               <div className="mt-8 flex items-center justify-between">
                 <span className="text-[10px] font-bold text-white/50 uppercase">Gateway Uplink Stable</span>
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-blue-600 bg-blue-400"></div>)}
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
