import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../services/api";
import type { AlertDto } from "../types";

export function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getAlerts(100);
      if (response.success && response.data) {
        setAlerts(response.data);
      }
    } catch (e) {
      console.error("[AlertsPage] Failed to fetch alerts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const getSeverityStyle = (severity: string) => {
    if (severity === "Critical") return "bg-rose-50 text-rose-700 border-rose-200";
    if (severity === "Warning") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="space-y-12">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                 </svg>
              </Link>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">
                Alerts Hub
              </h2>
            </div>
            <p className="text-slate-500 mt-2 text-lg font-medium pl-14">
              Centralized monitoring node for advanced diagnostic alerts.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-rose-50 px-4 py-2 rounded-xl border border-rose-100">
             <span className="relative flex h-2.5 w-2.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
             </span>
             <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Active Security Stream</span>
          </div>
        </div>

        <div className="industrial-panel p-0 overflow-hidden">
          {loading ? (
             <div className="p-20 text-center animate-pulse">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Syncing with Master Logs...</p>
             </div>
          ) : alerts.length === 0 ? (
             <div className="p-20 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight italic mb-2">Zero Active Threats</h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto">All assets are currently operating within established safety and performance thresholds.</p>
             </div>
          ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Log Origin</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Severity</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostic Details</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {alerts.map((alert) => (
                     <tr key={alert.id} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-8 py-5">
                         <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{alert.assetCode}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">{alert.assetName}</span>
                         </div>
                       </td>
                       <td className="px-8 py-5">
                         <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${getSeverityStyle(alert.severity)}`}>
                            {alert.severity}
                         </span>
                       </td>
                       <td className="px-8 py-5 text-sm font-bold text-slate-700">
                          {alert.type}: <span className="font-medium text-slate-500">{alert.message}</span>
                          <div className="mt-1.5 flex items-center space-x-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                             <span className="bg-slate-100 px-2 py-0.5 rounded">R: {alert.currentValue.toFixed(1)}</span>
                             <span className="bg-slate-100 px-2 py-0.5 rounded">Limit: {alert.threshold}</span>
                          </div>
                       </td>
                       <td className="px-8 py-5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                          {new Date(alert.edgeTimestamp).toLocaleString()}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
