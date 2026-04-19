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
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {asset.assetCode}
          </span>
          <span className="text-xs text-slate-500">{asset.name}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 capitalize">
          {asset.type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium italic">
        {asset.location}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-300 ${getStatusConfig(asset.status)}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
            asset.status === "Running" ? "bg-green-500" : asset.status === "Warning" ? "bg-yellow-500" : "bg-red-500"
          }`}></span>
          {asset.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Temp</span>
            <span className="text-sm font-mono font-black text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 min-w-[70px] text-center">
              {asset.temperature ? `${asset.temperature.toFixed(1)} °C` : "—"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Pres</span>
            <span className="text-sm font-mono font-black text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 min-w-[70px] text-center">
              {asset.pressure ? `${asset.pressure.toFixed(0)} PSI` : "—"}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-700">
            {asset.lastUpdate ? new Date(asset.lastUpdate).toLocaleTimeString() : "No Data"}
          </span>
          {asset.alertMessage && (
            <span className="text-[10px] text-red-500 font-medium truncate max-w-[120px]" title={asset.alertMessage}>
              ⚠ {asset.alertMessage}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onDelete(asset.id)}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
          title="Remove Asset"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
}
