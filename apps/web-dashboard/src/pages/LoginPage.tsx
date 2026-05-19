import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../services/api";
import { Shield, Lock, User as UserIcon, Eye, EyeOff, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.login(username, password);
      if (response.success && response.data) {
        const { token, username: userUsername, role } = response.data;
        login(token, { username: userUsername, role });
        toast.success(`Welcome back, ${userUsername}!`);
        navigate(from, { replace: true });
      } else {
        toast.error(response.message || "Failed to authenticate. Please check your credentials.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-industrial-bg)] relative overflow-hidden px-4">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-industrial-accent)]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-industrial-emerald)]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-panel rounded-2xl p-8 border border-[var(--color-industrial-border)] shadow-2xl relative overflow-hidden">
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--color-industrial-accent)] to-[var(--color-industrial-emerald)]"></div>

          {/* Logo & Header */}
          <div className="text-center mb-8 mt-2">
            <div className="inline-flex p-3 rounded-xl bg-slate-900/80 border border-[var(--color-industrial-border)] text-[var(--color-industrial-accent)] mb-4 shadow-inner relative group">
              <div className="absolute inset-0 bg-[var(--color-industrial-accent)]/20 rounded-xl blur group-hover:blur-md transition-all duration-300"></div>
              <Cpu className="w-8 h-8 relative z-10 animate-pulse-slow" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-industrial-text)]">
              CONTROL CENTER
            </h1>
            <p className="text-xs text-[var(--color-industrial-text-muted)] font-mono uppercase tracking-widest mt-1">
              Industrial IoT Platform
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono text-[var(--color-industrial-text-muted)] uppercase tracking-wider block">
                Operator Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-industrial-text-muted)]">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-[var(--color-industrial-border)] rounded-lg text-sm placeholder-[var(--color-industrial-text-muted)] focus:outline-none focus:border-[var(--color-industrial-accent)] focus:ring-1 focus:ring-[var(--color-industrial-accent)] transition-all duration-300 font-mono text-[var(--color-industrial-text)]"
                  placeholder="e.g. operator_01"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-[var(--color-industrial-text-muted)] uppercase tracking-wider block">
                Access Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-industrial-text-muted)]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-[var(--color-industrial-border)] rounded-lg text-sm placeholder-[var(--color-industrial-text-muted)] focus:outline-none focus:border-[var(--color-industrial-accent)] focus:ring-1 focus:ring-[var(--color-industrial-accent)] transition-all duration-300 font-mono text-[var(--color-industrial-text)]"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-industrial-text-muted)] hover:text-[var(--color-industrial-text)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-[var(--color-industrial-accent)] to-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>SECURE LOGIN</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-[var(--color-industrial-border)] text-center">
            <p className="text-[10px] text-[var(--color-industrial-text-muted)] font-mono flex items-center justify-center gap-1.5 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-industrial-emerald)] animate-ping"></span>
              SECURE SHA-256 SYSTEM ACTIVE
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
