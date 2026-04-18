import { useState, useEffect, useCallback } from "react";
import type { Asset, TelemetryUpdate } from "../types";
import { apiService } from "../services/api";
import { signalRService } from "../services/signalr";

interface AssetListProps {
  onDelete: (id: string) => void;
}

export function AssetList({ onDelete }: AssetListProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const updateAsset = useCallback((update: TelemetryUpdate) => {
    setAssets((prevAssets) =>
      prevAssets.map((asset) =>
        asset.assetCode === update.AssetCode
          ? {
              ...asset,
              status: update.Status as Asset["status"],
              temperature: update.Temperature,
              pressure: update.Pressure,
              vibration: update.Vibration,
              lastUpdate: update.IngestionTimestamp,
              alertMessage: update.AlertMessage,
            }
          : asset,
      ),
    );
  }, []);

  useEffect(() => {
    const initSignalR = async () => {
      try {
        await signalRService.connect();
        signalRService.on("onTelemetryUpdate", updateAsset);
        signalRService.on(
          "onAlert",
          (data: { assetCode: string; message: string; severity: string }) => {
            console.log("Alert:", data);
            updateAsset({
              AssetCode: data.assetCode,
              Status: data.severity,
              Temperature: 0,
              Pressure: 0,
              Vibration: 0,
              IngestionTimestamp: new Date().toISOString(),
              AlertMessage: data.message,
            } as TelemetryUpdate);
          },
        );

        assets.forEach((asset) => signalRService.joinAsset(asset.assetCode));
      } catch {
        console.error("SignalR connection failed");
      }
    };

    initSignalR();

    return () => {
      signalRService.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAssets();
      if (response.success && response.data) {
        setAssets(response.data);
        setError(null);
      } else {
        setError(response.message || "Failed to load assets");
      }
    } catch {
      setError("An error occurred while loading assets");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    onDelete(id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Running":
        return "bg-green-100 text-green-800";
      case "Warning":
        return "bg-yellow-100 text-yellow-800";
      case "Critical":
        return "bg-red-100 text-red-800";
      case "Maintenance":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">Error</p>
        <p>{error}</p>
        <button
          onClick={loadAssets}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No assets found</p>
        <p className="text-gray-400 text-sm mt-2">
          Create your first asset to get started
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Asset Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Temperature (°C)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pressure (PSI)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vibration (mm/s)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Update
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {assets.map((asset) => (
            <tr key={asset.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {asset.assetCode}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{asset.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{asset.type}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{asset.location}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(asset.status)}`}
                >
                  {asset.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {asset.temperature?.toFixed(1) ?? "—"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {asset.pressure?.toFixed(0) ?? "—"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {asset.vibration?.toFixed(1) ?? "—"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {asset.lastUpdate
                  ? new Date(asset.lastUpdate).toLocaleTimeString()
                  : "—"}
                {asset.alertMessage && (
                  <div className="text-xs text-red-600 mt-1 line-clamp-1">
                    ⚠️ {asset.alertMessage}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(asset.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleDeleteClick(asset.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
