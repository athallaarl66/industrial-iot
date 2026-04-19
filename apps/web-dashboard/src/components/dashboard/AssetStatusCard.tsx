import { Link } from "react-router-dom";
import type { Asset } from "../../types";

interface AssetStatusCardProps {
  asset: Asset;
}

/**
 * AssetStatusCard Component
 * High-density visualization of a single asset's health.
 * Features industrial-grade status indicators and glow effects.
 */
export function AssetStatusCard({ asset }: AssetStatusCardProps) {
  const getStatusColor = (status: Asset["status"]) => {
    switch (status) {
      case "Running":
        return "border-emerald-500/20 bg-emerald-50/10 text-emerald-600";
      case "Warning":
        return "border-amber-500/30 bg-amber-50/10 text-amber-600";
      case "Critical":
        return "border-rose-500/40 bg-rose-50/10 text-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.1)]";
      default:
        return "border-slate-200 bg-slate-50 text-slate-400";
    }
  };

  const getStatusDot = (status: Asset["status"]) => {
    switch (status) {
      case "Running":
        return "status-dot-running";
      case "Warning":
        return "status-dot-warning";
      case "Critical":
        return "status-dot-critical animate-pulse";
      default:
        return "bg-slate-300";
    }
  };

  return (
    <Link
      to={`/assets/${asset.id}`}
      className={`
        relative overflow-hidden group industrial-panel p-5 flex flex-col h-full border-2 transition-all duration-300
        ${getStatusColor(asset.status)}
        hover:scale-[1.02] hover:shadow-xl hover:z-10 cursor-pointer
      `}
    >
      {/* Background Decorator */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-current opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700"></div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-current transition-colors">
            {asset.assetCode}
          </span>
          <h4 className="text-lg font-black text-slate-900 mt-1 leading-tight group-hover:text-current transition-colors">
            {asset.name}
          </h4>
        </div>
        <div className={`status-dot ${getStatusDot(asset.status)}`}></div>
      </div>

      <div className="mt-auto space-y-4">
        {/* Metric Preview */}
        <div className="grid grid-cols-1 gap-2 mt-2">
          <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Temp
            </span>
            <span className="text-sm font-black text-slate-700">
              {asset.temperature ? `${asset.temperature.toFixed(1)}°C` : "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Press
            </span>
            <span className="text-sm font-black text-slate-700">
              {asset.pressure ? `${asset.pressure.toFixed(1)} PSI` : "N/A"}
            </span>
          </div>
        </div>

        <div className="h-px bg-slate-100 group-hover:bg-current/10"></div>

        <div className="flex items-center justify-between gap-2 overflow-hidden">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate min-w-0">
            {asset.type}
          </span>
          <div className="flex items-center text-[9px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shrink-0">
            VIEW
            <svg
              className="w-2.5 h-2.5 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
