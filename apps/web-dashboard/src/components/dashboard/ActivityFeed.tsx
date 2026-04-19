import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../../services/api";
import type { AlertDto, TelemetryUpdate } from "../../types";
import { signalRService } from "../../services/signalr";
import { toast } from "sonner";

/**
 * ActivityFeed Component
 * Displays a real-time stream of audit logs and system events.
 */
export function ActivityFeed() {
  const [activities, setActivities] = useState<AlertDto[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getAlerts(5);
      if (response.success && response.data) {
        setActivities(response.data);
      }
    } catch (e) {
      console.error("[ActivityFeed] Failed to load alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Hook into SignalR to show toasts and update feed on new alerts
  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const setupListener = async () => {
      try {
        if (!signalRService.isConnected()) {
           await signalRService.connect();
        }
        if (isMounted) {
          unsubscribe = signalRService.on("onTelemetryUpdate", (update: TelemetryUpdate) => {
            if (update.alertMessage && (update.status === "Critical" || update.status === "Warning")) {
               fetchAlerts(); // Re-fetch feed silently
               // Dispatch Global Toast
               if (update.status === "Critical") {
                 toast.error(`[${update.assetCode}] ${update.alertMessage}`);
               } else {
                 toast.warning(`[${update.assetCode}] ${update.alertMessage}`);
               }
            }
          });
        }
      } catch (e) {
        console.error("SignalR Listener failed in ActivityFeed");
      }
    };
    setupListener();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [fetchAlerts]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Running":
      case "Maintenance":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          dot: "bg-emerald-500",
        };
      case "Warning":
        return {
          bg: "bg-amber-50",
          text: "text-amber-600",
          dot: "bg-amber-500",
        };
      case "Critical":
        return {
          bg: "bg-rose-50",
          text: "text-rose-600",
          dot: "bg-rose-500",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-600",
          dot: "bg-slate-500",
        };
    }
  };

  return (
    <div className="bg-white">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Intelligence Feed</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200">Real-time Stream</span>
      </div>
      <div className="divide-y divide-slate-100">
        {loading ? (
           <div className="px-8 py-5 text-center text-slate-400 text-sm font-bold animate-pulse">Syncing Intelligence Stream...</div>
        ) : activities.length === 0 ? (
           <div className="px-8 py-10 text-center text-slate-400 text-sm font-bold uppercase tracking-widest border border-dashed border-slate-200 mx-8 my-4 rounded-xl">No active warnings or critical events.</div>
        ) : activities.map((item) => {
          const config = getStatusConfig(item.severity);
          return (
            <div key={item.id} className="px-8 py-5 flex items-start space-x-6 hover:bg-slate-50/50 transition-colors group">
              <div className={`mt-1 h-12 w-12 ${config.bg} rounded-2xl flex items-center justify-center border border-transparent group-hover:border-slate-200 transition-all shadow-sm shrink-0`}>
                <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse shadow-sm`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 truncate">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${config.text}`}>
                      {item.severity}
                    </span>
                    <span className="text-slate-200">|</span>
                    <span className="text-sm font-black text-slate-900 truncate">{item.assetCode}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter shrink-0 ml-2">
                    {new Date(item.edgeTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-700 mt-1 leading-relaxed">
                  {item.type}: <span className="font-normal text-slate-500">{item.message} ({item.currentValue.toFixed(1)} vs Limit: {item.threshold})</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-center">
        <Link 
          to="/alerts"
          className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors flex items-center"
        >
          Access Complete Alerts Hub
          <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
