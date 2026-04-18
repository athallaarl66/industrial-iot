import { useState } from "react";
import { AssetForm } from "../components/AssetForm";
import { AssetList } from "../components/AssetList";
import { DeleteDialog } from "../components/DeleteDialog";

export function AssetsPage() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);

  const handleAssetCreated = () => {
    window.location.reload();
  };

  const handleDelete = (id: string) => {
    setAssetToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assetToDelete) return;

    try {
      // Call API directly here since AssetList now only calls callback
      const response = await fetch(`/api/assets/${assetToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Delete failed");
    } finally {
      setShowDeleteDialog(false);
      setAssetToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AssetForm onSuccess={handleAssetCreated} />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-8 border border-gray-100">
            <AssetList onDelete={handleDelete} />
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
