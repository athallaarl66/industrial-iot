import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../../services/api";
import type { AlertDto, TelemetryUpdate } from "../../types";
import { signalRService } from "../../services/signalr";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

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
          unsubscribe = signalRService.on(
            "onTelemetryUpdate",
            (update: TelemetryUpdate) => {
              if (
                update.alertMessage &&
                (update.status === "Critical" || update.status === "Warning")
              ) {
                fetchAlerts(); // Re-fetch feed silently
                // Dispatch Global Toast
                if (update.status === "Critical") {
                  toast.error(`[${update.assetCode}] ${update.alertMessage}`);
                } else {
                  toast.warning(`[${update.assetCode}] ${update.alertMessage}`);
                }
              }
            },
          );
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
          bg: "bg-emerald-900/20",
          text: "text-emerald-400",
          dot: "bg-emerald-500",
        };
      case "Warning":
        return {
          bg: "bg-amber-900/20",
          text: "text-amber-400",
          dot: "bg-amber-500",
        };
      case "Critical":
        return {
          bg: "bg-rose-900/20",
          text: "text-rose-400",
          dot: "bg-rose-500",
        };
      default:
        return {
          bg: "bg-slate-800/50",
          text: "text-slate-400",
          dot: "bg-slate-500",
        };
    }
  };

  return (
    <div className="bg-transparent">
      <div className="px-8 py-6 border-b border-[var(--color-industrial-border)] flex items-center justify-between bg-[var(--color-industrial-panel)]/80">
        <h3 className="text-xl font-black text-[var(--color-industrial-text)] uppercase tracking-tight">
          Intelligence Feed
        </h3>
        <span className="text-[10px] font-bold text-[var(--color-industrial-text-muted)] uppercase tracking-widest bg-[var(--color-industrial-border)] px-3 py-1 rounded-full border border-[var(--color-industrial-border)]">
          Real-time Stream
        </span>
      </div>
      <div className="divide-y divide-[var(--color-industrial-border)]">
        {loading ? (
          <div className="px-8 py-5 text-center text-[var(--color-industrial-text-muted)] text-sm font-bold animate-pulse">
            Syncing Intelligence Stream...
          </div>
        ) : activities.length === 0 ? (
          <div className="px-8 py-10 text-center text-[var(--color-industrial-text-muted)] text-sm font-bold uppercase tracking-widest border border-dashed border-[var(--color-industrial-border)] mx-8 my-4 rounded-xl">
            No active warnings or critical events.
          </div>
        ) : (
          activities.map((item) => {
            const config = getStatusConfig(item.severity);
            return (
              <div
                key={item.id}
                className="px-8 py-5 flex items-start space-x-6 hover:bg-[var(--color-industrial-border)]/30 transition-colors group"
              >
                <div
                  className={`mt-1 h-12 w-12 ${config.bg} rounded-2xl flex items-center justify-center border border-transparent group-hover:border-[var(--color-industrial-border)] transition-all shadow-sm shrink-0`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${config.dot} animate-pulse shadow-sm shadow-current`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${config.text}`}
                      >
                        {item.severity}
                      </span>
                      <span className="text-[var(--color-industrial-text-muted)]">
                        |
                      </span>
                      <span className="text-sm font-black text-[var(--color-industrial-text)] truncate">
                        {item.assetCode}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--color-industrial-text-muted)] uppercase tracking-tighter shrink-0 ml-2 font-mono-numbers">
                      {new Date(item.edgeTimestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[var(--color-industrial-text)] mt-1 leading-relaxed">
                    {item.type}:{" "}
                    <span className="font-normal text-[var(--color-industrial-text-muted)]">
                      {item.message} ({item.currentValue.toFixed(1)} vs Limit:{" "}
                      {item.threshold})
                    </span>
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="px-8 py-5 bg-[var(--color-industrial-panel)] border-t border-[var(--color-industrial-border)] flex justify-center">
        <Link
          to="/alerts"
          className="text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-[0.2em] hover:text-blue-400 transition-colors flex items-center"
        >
          Access Complete Alerts Hub
          <ArrowRight className="w-4 h-4 ml-2" strokeWidth={3} />
        </Link>
      </div>
    </div>
  );
}
