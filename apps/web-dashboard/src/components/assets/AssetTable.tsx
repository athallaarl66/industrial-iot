import type { Asset } from "../../types";
import { AssetRow } from "./AssetRow";

interface AssetTableProps {
  assets: Asset[];
  onDelete: (id: string) => void;
}

/**
 * AssetTable Component
 * Renders the industrial hardware inventory.
 * Standard industrial layout with high legibility.
 */
export function AssetTable({ assets, onDelete }: AssetTableProps) {
  const headers = [
    { label: "Asset Information", className: "text-left" },
    { label: "Type", className: "text-left" },
    { label: "Location", className: "text-left" },
    { label: "Status", className: "text-left" },
    { label: "Operational Data", className: "text-left" },
    { label: "Last Activity", className: "text-left" },
    { label: "", className: "text-right" }, // Actions
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest ${header.className}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {assets.map((asset) => (
              <AssetRow key={asset.id} asset={asset} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
      
      {assets.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-slate-500 font-black text-xl uppercase tracking-tight italic">Registry Inventory Empty</p>
          <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest leading-loose">
            Awaiting Hardware Provisioning <span className="mx-2">/</span> Data Link Offline
          </p>
        </div>
      )}
      
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
            Total Inventory: <span className="text-slate-900 ml-1">{assets.length}</span> Assets
          </span>
          <div className="flex space-x-3">
            <button className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-blue-600 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
               Prev
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-blue-600 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm">
               Next
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
