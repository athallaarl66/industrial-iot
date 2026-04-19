import { useState } from "react";
import type { CreateAssetForm } from "../types";
import { apiService } from "../services/api";
import { toast } from "sonner";

interface AssetFormProps {
  onSuccess: () => void;
}

interface FormErrors {
  assetCode?: string;
  name?: string;
  type?: string;
  location?: string;
}

/**
 * AssetForm Component
 * Specialized interface for provisioning new industrial network nodes.
 * Pivoted to Industrial Light theme.
 */
export function AssetForm({ onSuccess }: AssetFormProps) {
  const [formData, setFormData] = useState<CreateAssetForm>({
    assetCode: "",
    name: "",
    type: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Field-level validation for O&G equipment standards.
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const assetCodeRegex = /^[A-Z]{2,4}-[A-Z0-9]+-[0-9]{3,4}$/;
    
    if (!formData.assetCode) {
      newErrors.assetCode = "Required";
    } else if (!assetCodeRegex.test(formData.assetCode)) {
      newErrors.assetCode = "Invalid Schema";
    }

    if (!formData.name) newErrors.name = "Required";
    if (!formData.type) newErrors.type = "Required";
    if (!formData.location) newErrors.location = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await apiService.createAsset(formData);
      if (response.success) {
        setFormData({ assetCode: "", name: "", type: "", location: "" });
        setErrors({});
        onSuccess();
        toast.success(`Node ${formData.assetCode} Successfully Provisioned`);
      } else {
        setSubmitError(response.message || "Registry update failed.");
      }
    } catch {
      setSubmitError("Network connectivity lost.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const getInputClass = (fieldName: keyof FormErrors) => `
    mt-1.5 block w-full rounded-xl border px-4 py-3 text-sm font-bold transition-all duration-200 outline-none
    ${errors[fieldName] 
      ? "border-rose-300 bg-rose-50 text-rose-900 focus:ring-4 focus:ring-rose-200/50" 
      : "border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-300"
    }
  `;

  return (
    <div className="bg-transparent">
      {submitError && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center animate-in fade-in duration-300">
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-black uppercase tracking-tight">{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
            <label htmlFor="assetCode" className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-normal">
              Asset Identifier
            </label>
            {errors.assetCode && <span className="text-[9px] font-black text-rose-500 uppercase bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">{errors.assetCode}</span>}
          </div>
          <input
            type="text"
            id="assetCode"
            name="assetCode"
            value={formData.assetCode}
            onChange={handleChange}
            placeholder="PMP-ZONE-001"
            className={getInputClass("assetCode")}
            disabled={loading}
          />
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
            <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-normal">
              Equipment Name
            </label>
            {errors.name && <span className="text-[9px] font-black text-rose-500 uppercase bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">{errors.name}</span>}
          </div>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Primary Centrifugal Pump"
            className={getInputClass("name")}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
              <label htmlFor="type" className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-normal">
                Category
              </label>
            </div>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={getInputClass("type")}
              disabled={loading}
            >
              <option value="">Select</option>
              <option value="Pump">Pump</option>
              <option value="Compressor">Compressor</option>
              <option value="Valve">Valve</option>
              <option value="Heater">Heater</option>
              <option value="Other">Custom</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
              <label htmlFor="location" className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-normal">
                Deployment
              </label>
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Zone Alpha"
              className={getInputClass("location")}
              disabled={loading}
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full flex justify-center items-center py-4 px-6 border border-transparent 
              text-xs font-black rounded-xl text-white shadow-xl transition-all duration-300 uppercase tracking-widest
              ${loading 
                ? "bg-slate-200 cursor-not-allowed text-slate-400" 
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 active:scale-[0.98]"
              }
            `}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Authorize Deployment"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
