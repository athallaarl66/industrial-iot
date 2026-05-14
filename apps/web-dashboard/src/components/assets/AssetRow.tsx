import type { Asset } from "../../types";

interface AssetRowProps {
  asset: Asset;
  onDelete: (id: string) => void;
}

/**
 * AssetRow Component
 * Renders a single node with real-time telemetry metrics.
 */
export function AssetRow({ asset, onDelete }: AssetRowProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Running":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Warning":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Critical":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <tr className="group hover:bg-[var(--color-industrial-border)]/40 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-[var(--color-industrial-text)] group-hover:text-blue-500 transition-colors">
            {asset.assetCode}
          </span>
          <span className="text-xs text-[var(--color-industrial-text-muted)]">
            {asset.name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 capitalize">
          {asset.type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-industrial-text-muted)] font-medium italic">
        {asset.location}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-300 ${getStatusConfig(asset.status)}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-2 ${
              asset.status === "Running"
                ? "bg-emerald-400"
                : asset.status === "Warning"
                  ? "bg-amber-400"
                  : "bg-rose-400"
            }`}
          ></span>
          {asset.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[var(--color-industrial-text-muted)] tracking-widest mb-1">
              Temp
            </span>
            <span className="text-sm font-mono font-black text-[var(--color-industrial-text)] bg-[var(--color-industrial-panel)] px-2 py-1 rounded-md border border-[var(--color-industrial-border)] min-w-[70px] text-center">
              {asset.temperature ? `${asset.temperature.toFixed(1)} °C` : "—"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[var(--color-industrial-text-muted)] tracking-widest mb-1">
              Pres
            </span>
            <span className="text-sm font-mono font-black text-[var(--color-industrial-text)] bg-[var(--color-industrial-panel)] px-2 py-1 rounded-md border border-[var(--color-industrial-border)] min-w-[70px] text-center">
              {asset.pressure ? `${asset.pressure.toFixed(0)} PSI` : "—"}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[var(--color-industrial-text)]">
            {asset.lastUpdate
              ? new Date(asset.lastUpdate).toLocaleTimeString()
              : "No Data"}
          </span>
          {asset.alertMessage && (
            <span
              className="text-[10px] text-rose-400 font-medium truncate max-w-[120px]"
              title={asset.alertMessage}
            >
              ⚠ {asset.alertMessage}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end">
          <button
            onClick={() => onDelete(asset.id)}
            className="group/btn flex items-center justify-end gap-2 px-3 py-2 text-[var(--color-industrial-text-muted)] hover:text-rose-500 hover:bg-[var(--color-industrial-border)]/40 rounded-lg transition-all overflow-hidden w-10 hover:w-28"
            title="Decommission Node"
          >
            <span className="text-[10px] uppercase font-black tracking-widest opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
              Revoke
            </span>
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
