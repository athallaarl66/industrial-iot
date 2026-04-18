import { useState } from "react";
import { AssetForm } from "../components/AssetForm";
import { AssetList } from "../components/AssetList";
import { DeleteDialog } from "../components/DeleteDialog";

export function AssetsPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshAssets = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAssetCreated = () => {
    refreshAssets();
  };

  const handleDelete = (id: string) => {
    setAssetToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assetToDelete) return;

    try {
      const response = await fetch(`/api/assets/${assetToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        refreshAssets();
      }
    } catch {
      console.error("Delete failed");
    } finally {
      setShowDeleteDialog(false);
      setAssetToDelete(null);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Assets</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your industrial IoT assets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Asset</h3>
              <AssetForm onSuccess={handleAssetCreated} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Asset List</h3>
              <AssetList onDelete={handleDelete} refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      </div>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Asset"
        message="Are you sure? This action cannot be undone."
      />
    </div>
  );
}
