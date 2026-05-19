import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-industrial-bg)] flex items-center justify-center flex-col">
        <div className="w-12 h-12 border-4 border-t-[var(--color-industrial-accent)] border-[var(--color-industrial-border)] rounded-full animate-spin"></div>
        <p className="mt-4 text-[var(--color-industrial-text-muted)] text-sm font-mono animate-pulse-slow">
          Verifying credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
