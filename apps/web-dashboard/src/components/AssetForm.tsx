import { useState } from "react";
import type { CreateAssetForm } from "../types";
import { apiService } from "../services/api";

interface AssetFormProps {
  onSuccess: () => void;
}

export function AssetForm({ onSuccess }: AssetFormProps) {
  const [formData, setFormData] = useState<CreateAssetForm>({
    assetCode: "",
    name: "",
    type: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (
      !formData.assetCode ||
      !formData.name ||
      !formData.type ||
      !formData.location
    ) {
      setError("All fields are required");
      return;
    }

    // Validate asset code format (O&G standard)
    const assetCodeRegex = /^[A-Z]{2,4}-[A-Z0-9]+-[0-9]{3,4}$/;
    if (!assetCodeRegex.test(formData.assetCode)) {
      setError("Asset code must follow O&G format (e.g., PMP-A-001)");
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.createAsset(formData);
      if (response.success) {
        // Reset form
        setFormData({
          assetCode: "",
          name: "",
          type: "",
          location: "",
        });
        onSuccess(); // Refresh the list
      } else {
        setError(response.message || "Failed to create asset");
      }
    } catch {
      setError("An error occurred while creating asset");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Create New Asset
      </h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="assetCode"
            className="block text-sm font-medium text-gray-700"
          >
            Asset Code *
          </label>
          <input
            type="text"
            id="assetCode"
            name="assetCode"
            value={formData.assetCode}
            onChange={handleChange}
            placeholder="e.g., PMP-A-001"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Format: TIPE-LOKASI-NOMOR (e.g., PMP-A-001)
          </p>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Asset Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Main Production Pump A"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Asset Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="">Select type</option>
            <option value="Pump">Pump</option>
            <option value="Compressor">Compressor</option>
            <option value="Wellhead">Wellhead</option>
            <option value="Valve">Valve</option>
            <option value="Separator">Separator</option>
            <option value="Heater">Heater</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Zone A, Platform B"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Asset"}
          </button>
        </div>
      </form>
    </div>
  );
}
