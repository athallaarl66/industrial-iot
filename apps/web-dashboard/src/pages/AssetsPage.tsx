import { useState } from "react";
import { AssetForm } from "../components/AssetForm";
import { AssetList } from "../components/AssetList";
import { DeleteDialog } from "../components/DeleteDialog";
import { apiService } from "../services/api";

/**
 * AssetsPage Component
 * Full-scale inventory management system for industrial nodes.
 * Pivoted to Industrial Light theme.
 */
export function AssetsPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshAssets = () => setRefreshTrigger((prev) => prev + 1);
  const handleAssetCreated = () => refreshAssets();

  const handleDelete = (id: string) => {
    setAssetToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assetToDelete) return;

    try {
      const response = await apiService.deleteAsset(assetToDelete);
      if (response.success) {
        refreshAssets();
      }
    } catch {
      console.error("[Assets] Data link termination failed.");
    } finally {
      setShowDeleteDialog(false);
      setAssetToDelete(null);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="space-y-12">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-industrial-border)] pb-8">
          <div>
            <h2 className="text-4xl font-black text-[var(--color-industrial-text)] tracking-tight">
              Asset Registry
            </h2>
            <p className="text-[var(--color-industrial-text-muted)] mt-2 text-lg font-medium">
              Manage, provision, and decommission industrial network nodes.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-[var(--color-industrial-panel)] px-4 py-2 rounded-xl border border-[var(--color-industrial-border)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest">
              Global Sync Active
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Action Column */}
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="industrial-panel p-8 sticky top-28 bg-[var(--color-industrial-panel)] border border-[var(--color-industrial-border)]">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-black text-[var(--color-industrial-text)] uppercase tracking-tight">
                  Provision Node
                </h3>
              </div>

              <AssetForm onSuccess={handleAssetCreated} />

              <div className="mt-10 pt-8 border-t border-[var(--color-industrial-border)]">
                <div className="p-4 bg-[var(--color-industrial-bg)] rounded-xl border border-[var(--color-industrial-border)] shadow-sm">
                  <h4 className="text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest mb-2">
                    Requirement
                  </h4>
                  <p className="text-[10px] text-[var(--color-industrial-text-muted)] leading-normal font-medium italic">
                    Nodes must adhere to <strong>ID-LOCATION-SERIAL</strong>{" "}
                    schema for automated telemetry ingestion.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Records Column */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-black text-[var(--color-industrial-text)] uppercase tracking-tight italic">
                    Inventory Registry
                  </h3>
                  <span className="text-[10px] font-bold text-[var(--color-industrial-text-muted)] uppercase tracking-tighter">
                    Read/Write Access
                  </span>
                </div>
                <button
                  onClick={refreshAssets}
                  className="flex items-center space-x-2 text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest hover:text-blue-600 transition-colors"
                >
                  <svg
                    className={`w-4 h-4`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Sync Master</span>
                </button>
              </div>

              <div className="industrial-panel overflow-hidden border-[var(--color-industrial-border)]">
                <AssetList
                  onDelete={handleDelete}
                  refreshTrigger={refreshTrigger}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Terminate Node Synchronization"
        message="Are you sure? This will permanently remove the asset from the cloud registry and stop all real-time telemetry pipelines."
      />
    </div>
  );
}
