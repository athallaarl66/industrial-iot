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
    <div className="bg-[var(--color-industrial-panel)] rounded-2xl shadow-sm border border-[var(--color-industrial-border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--color-industrial-border)]">
          <thead className="bg-[var(--color-industrial-bg)]">
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 text-[10px] sm:text-xs font-bold text-[var(--color-industrial-text-muted)] uppercase tracking-widest ${header.className}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-industrial-border)] bg-[var(--color-industrial-panel)]">
            {assets.map((asset) => (
              <AssetRow key={asset.id} asset={asset} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>

      {assets.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-[var(--color-industrial-panel)] rounded-full flex items-center justify-center mb-4 border border-[var(--color-industrial-border)]">
            <svg
              className="w-8 h-8 text-[var(--color-industrial-text-muted)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-[var(--color-industrial-text-muted)] font-black text-xl uppercase tracking-tight italic">
            Registry Inventory Empty
          </p>
          <p className="text-[var(--color-industrial-text-muted)] text-xs font-bold mt-2 uppercase tracking-widest leading-loose">
            Awaiting Hardware Provisioning <span className="mx-2">/</span> Data
            Link Offline
          </p>
        </div>
      )}

      <div className="bg-[var(--color-industrial-bg)] px-6 py-4 border-t border-[var(--color-industrial-border)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[var(--color-industrial-text-muted)] uppercase tracking-tight">
            Total Inventory:{" "}
            <span className="text-[var(--color-industrial-text)] ml-1">
              {assets.length}
            </span>{" "}
            Assets
          </span>
          <div className="flex space-x-3">
            <button className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border border-[var(--color-industrial-border)] text-[var(--color-industrial-text-muted)] bg-[var(--color-industrial-panel)] hover:bg-[var(--color-industrial-bg)] hover:text-blue-600 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Prev
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl border border-[var(--color-industrial-border)] text-[var(--color-industrial-text-muted)] bg-[var(--color-industrial-panel)] hover:bg-[var(--color-industrial-bg)] hover:text-blue-600 focus:ring-4 focus:ring-blue-100 transition-all shadow-sm">
              Next
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
