import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import type { EdgeCredential } from "../services/api";
import type { Asset } from "../types";
import { toast } from "sonner";
import { Key, ShieldCheck, Plus, RefreshCw, Copy, Check, Lock, AlertTriangle, Eye, EyeOff } from "lucide-react";

/**
 * ProvisioningPage Component
 * Provides interface for generating, displaying, and revoking API keys for MQTT edge devices.
 */
export function ProvisioningPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [credentials, setCredentials] = useState<EdgeCredential[]>([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [generatedCred, setGeneratedCred] = useState<EdgeCredential | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedCreds, setRevealedCreds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const [assetsRes, credsRes] = await Promise.all([
        apiService.getAssets(),
        apiService.getEdgeCredentials()
      ]);

      if (assetsRes.success) {
        setAssets(assetsRes.data);
        if (assetsRes.data.length > 0 && !selectedAsset) {
          setSelectedAsset(assetsRes.data[0].assetCode);
        }
      }

      if (credsRes.success) {
        setCredentials(credsRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load registry data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) {
      toast.warning("Please select an asset code");
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.provisionEdgeCredential(selectedAsset);
      if (response.success) {
        setGeneratedCred(response.data);
        toast.success(`Token successfully generated for ${selectedAsset}`);
        fetchData(true);
      } else {
        toast.error(response.message || "Failed to provision token.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during provisioning.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id: string, assetCode: string) => {
    if (!confirm(`Are you sure you want to revoke credentials for ${assetCode}? This cannot be undone and will immediately terminate the edge device connection.`)) {
      return;
    }

    try {
      const response = await apiService.revokeEdgeCredential(id);
      if (response.success) {
        toast.success(`Credentials for ${assetCode} have been revoked`);
        fetchData(true);
      } else {
        toast.error(response.message || "Failed to revoke token.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while revoking credentials.");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Credential token copied to clipboard");
    setTimeout(() => setCopiedId(null), 2550);
  };

  const toggleReveal = (id: string) => {
    setRevealedCreds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="space-y-12">
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--color-industrial-border)] pb-8">
          <div>
            <h2 className="text-4xl font-black text-[var(--color-industrial-text)] tracking-tight">
              Device Provisioning
            </h2>
            <p className="text-[var(--color-industrial-text-muted)] mt-2 text-lg font-medium">
              Manage dynamic credentials and generate secure MQTT access tokens for edge nodes.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-[var(--color-industrial-panel)] px-4 py-2 rounded-xl border border-[var(--color-industrial-border)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest">
              Zero Trust Security
            </span>
          </div>
        </div>

        {/* Generated Credential Display Banner */}
        {generatedCred && (
          <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 animate-in slide-in-from-top duration-500">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-emerald-500/20 rounded-lg shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-bold text-lg text-emerald-200">New Token Generated Successfully</h4>
                <p className="text-sm text-emerald-400/90 leading-relaxed max-w-3xl">
                  This token acts as the MQTT password for edge node <strong>{generatedCred.assetCode}</strong>.
                  Make sure to copy it now. For security purposes, it cannot be recovered after this session.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="flex-1 font-mono text-sm bg-black/40 border border-emerald-500/20 rounded-lg px-4 py-3 flex items-center justify-between text-emerald-400 overflow-x-auto select-all">
                    <span>{generatedCred.token}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedCred.token, "generated")}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
                  >
                    {copiedId === "generated" ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Token</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setGeneratedCred(null)}
                    className="px-4 py-3 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column: Generate Credentials Form */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="industrial-panel p-8 sticky top-28 bg-[var(--color-industrial-panel)] border border-[var(--color-industrial-border)] rounded-2xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-black text-[var(--color-industrial-text)] uppercase tracking-tight">
                  Issue Credentials
                </h3>
              </div>

              <form onSubmit={handleProvision} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="asset-select" className="text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest block">
                    Target Asset Node
                  </label>
                  <select
                    id="asset-select"
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    className="w-full h-11 bg-[var(--color-industrial-bg)] border border-[var(--color-industrial-border)] rounded-xl px-4 text-sm font-bold text-[var(--color-industrial-text)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                    disabled={loading || assets.length === 0}
                  >
                    {assets.length === 0 ? (
                      <option>No Assets Available</option>
                    ) : (
                      assets.map((asset) => (
                        <option key={asset.id} value={asset.assetCode}>
                          {asset.assetCode} - {asset.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="p-4 bg-[var(--color-industrial-bg)] rounded-xl border border-[var(--color-industrial-border)] space-y-2">
                  <div className="flex items-center space-x-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Dynamic Broker Authentication</span>
                  </div>
                  <p className="text-[10px] text-[var(--color-industrial-text-muted)] leading-relaxed">
                    Generating a token registers it in the backend registry. Edge devices connect with username 
                    <strong> [AssetCode]</strong> and this token as the MQTT password.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || assets.length === 0}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Issue Access Token</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Credential Inventory Grid */}
          <div className="flex-1 min-w-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-black text-[var(--color-industrial-text)] uppercase tracking-tight italic">
                    Security Credentials Directory
                  </h3>
                  <span className="text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    Admin Terminal
                  </span>
                </div>
                
                <button
                  onClick={() => fetchData(true)}
                  disabled={refreshing}
                  className="flex items-center space-x-2 text-[10px] font-black text-[var(--color-industrial-text-muted)] hover:text-blue-500 uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-500" : ""}`} />
                  <span>Refresh List</span>
                </button>
              </div>

              {/* Table Panel */}
              <div className="industrial-panel bg-[var(--color-industrial-panel)] border border-[var(--color-industrial-border)] rounded-2xl overflow-hidden shadow-sm">
                {loading && credentials.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <RefreshCw className="w-10 h-10 animate-spin text-blue-500" />
                    <p className="text-sm font-bold text-[var(--color-industrial-text-muted)] uppercase tracking-widest">
                      Querying credentials database...
                    </p>
                  </div>
                ) : credentials.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 px-4">
                    <div className="w-12 h-12 bg-[var(--color-industrial-border)]/40 rounded-full flex items-center justify-center">
                      <Key className="w-6 h-6 text-[var(--color-industrial-text-muted)]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--color-industrial-text)] uppercase tracking-tight">No Provisioning Records</h4>
                      <p className="text-xs text-[var(--color-industrial-text-muted)] mt-1 max-w-xs">
                        No dynamic MQTT credential keys have been created yet. Issue a token using the generator.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--color-industrial-border)] bg-[var(--color-industrial-bg)]/50">
                          <th className="py-4 px-6 text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest">Asset Code</th>
                          <th className="py-4 px-6 text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest">Token Password</th>
                          <th className="py-4 px-6 text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest text-center">Status</th>
                          <th className="py-4 px-6 text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest">Issued At</th>
                          <th className="py-4 px-6 text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-industrial-border)]">
                        {credentials.map((cred) => {
                          const revealed = revealedCreds[cred.id];
                          return (
                            <tr key={cred.id} className="hover:bg-slate-900/10 transition-colors duration-150">
                              <td className="py-4 px-6 font-bold text-[var(--color-industrial-text)] text-sm">
                                {cred.assetCode}
                              </td>
                              <td className="py-4 px-6 font-mono text-xs">
                                <div className="flex items-center space-x-2">
                                  <span className="text-[var(--color-industrial-text)] bg-black/20 px-2.5 py-1.5 rounded-lg border border-[var(--color-industrial-border)]">
                                    {revealed ? cred.token : "••••••••••••••••••••••••"}
                                  </span>
                                  <button
                                    onClick={() => toggleReveal(cred.id)}
                                    className="p-1.5 text-slate-500 hover:text-[var(--color-industrial-text)] transition-colors cursor-pointer"
                                    title={revealed ? "Hide Token" : "Show Token"}
                                  >
                                    {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                  </button>
                                  {cred.isActive && (
                                    <button
                                      onClick={() => copyToClipboard(cred.token, cred.id)}
                                      className="p-1.5 text-slate-500 hover:text-blue-500 transition-colors cursor-pointer"
                                      title="Copy Token"
                                    >
                                      {copiedId === cred.id ? (
                                        <Check className="w-4 h-4 text-emerald-500" />
                                      ) : (
                                        <Copy className="w-4 h-4" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-6 text-center">
                                {cred.isActive ? (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[var(--color-industrial-emerald)]/10 text-[var(--color-industrial-emerald)] border border-[var(--color-industrial-emerald)]/20 uppercase tracking-tighter">
                                    Active
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-[var(--color-industrial-rose)]/10 text-[var(--color-industrial-rose)] border border-[var(--color-industrial-rose)]/20 uppercase tracking-tighter">
                                    Revoked
                                  </span>
                                )}
                              </td>
                              <td className="py-4 px-6 text-xs text-[var(--color-industrial-text-muted)] font-medium">
                                {new Date(cred.createdAt).toLocaleString()}
                              </td>
                              <td className="py-4 px-6 text-right">
                                {cred.isActive ? (
                                  <button
                                    onClick={() => handleRevoke(cred.id, cred.assetCode)}
                                    className="px-3 py-1.5 border border-red-500/35 hover:border-red-500 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-all inline-flex items-center space-x-1 cursor-pointer"
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Revoke Key</span>
                                  </button>
                                ) : (
                                  <span className="text-xs text-[var(--color-industrial-text-muted)] italic font-semibold">
                                    Terminated
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
