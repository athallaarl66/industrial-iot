import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { apiService } from "../services/api";
import type { AlertDto } from "../types";

// ─── Constants ───────────────────────────────────────────────────────────────
const PAGE_SIZE = 15;

type SeverityFilter = "All" | "Critical" | "Warning";

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Small stat card at the top of the hub. */
function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className={`industrial-panel px-5 py-4 border-l-4 ${accent}`}>
      <p className="text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-3xl font-black text-[var(--color-industrial-text)]">
        {value}
      </p>
    </div>
  );
}

/** Severity badge pill. */
function SeverityBadge({ severity }: { severity: string }) {
  const style =
    severity === "Critical"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-amber-50 text-amber-700 border-amber-200";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${style}`}
    >
      {severity}
    </span>
  );
}

/** A single alert row — kept slim for density. */
function AlertRow({ alert }: { alert: AlertDto }) {
  return (
    <tr className="hover:bg-[var(--color-industrial-border)]/30 transition-colors group">
      {/* Asset */}
      <td className="px-5 py-3">
        <span className="text-sm font-black text-[var(--color-industrial-text)] group-hover:text-blue-600 transition-colors block">
          {alert.assetCode}
        </span>
        <span className="text-[10px] uppercase font-bold text-[var(--color-industrial-text-muted)] tracking-tight">
          {alert.assetName}
        </span>
      </td>

      {/* Severity */}
      <td className="px-5 py-3">
        <SeverityBadge severity={alert.severity} />
      </td>

      {/* Type & Message */}
      <td className="px-5 py-3">
        <span className="text-xs font-bold text-[var(--color-industrial-text)]">
          {alert.type}
        </span>
        <span className="text-xs font-medium text-[var(--color-industrial-text-muted)] ml-1.5">
          {alert.message}
        </span>
        <div className="flex items-center gap-2 mt-1">
          <span className="bg-[var(--color-industrial-bg)] text-[9px] font-black text-[var(--color-industrial-text-muted)] px-1.5 py-0.5 rounded uppercase tracking-widest border border-[var(--color-industrial-border)]">
            R: {alert.currentValue.toFixed(1)}
          </span>
          <span className="bg-[var(--color-industrial-bg)] text-[9px] font-black text-[var(--color-industrial-text-muted)] px-1.5 py-0.5 rounded uppercase tracking-widest border border-[var(--color-industrial-border)]">
            Limit: {alert.threshold}
          </span>
        </div>
      </td>

      {/* Timestamp */}
      <td className="px-5 py-3 text-right text-[10px] font-bold text-slate-400 whitespace-nowrap">
        {new Date(alert.edgeTimestamp).toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("All");
  const [page, setPage] = useState(1);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.getAlerts(200);
      if (response.success && response.data) {
        setAlerts(response.data);
      }
    } catch {
      console.error("[AlertsPage] Failed to fetch alerts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // ── Derived state ────────────────────────────────────────────────────────
  const criticalCount = useMemo(
    () => alerts.filter((a) => a.severity === "Critical").length,
    [alerts],
  );
  const warningCount = useMemo(
    () => alerts.filter((a) => a.severity === "Warning").length,
    [alerts],
  );

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      const matchSeverity =
        severityFilter === "All" || a.severity === severityFilter;
      const matchSearch =
        search.trim() === "" ||
        a.assetCode.toLowerCase().includes(search.toLowerCase()) ||
        a.assetName.toLowerCase().includes(search.toLowerCase());
      return matchSeverity && matchSearch;
    });
  }, [alerts, severityFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, severityFilter]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-industrial-border)] pb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 hover:bg-[var(--color-industrial-border)]/40 rounded-xl transition-colors text-[var(--color-industrial-text-muted)]"
              aria-label="Back to dashboard"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-black text-[var(--color-industrial-text)] tracking-tight italic">
                Alerts Hub
              </h1>
              <p className="text-[var(--color-industrial-text-muted)] text-sm font-medium mt-0.5">
                Centralized threshold-violation log
              </p>
            </div>
          </div>
          {/* Live indicator */}
          <div className="flex items-center gap-2 bg-[var(--color-industrial-panel)] px-3 py-1.5 rounded-lg border border-[var(--color-industrial-border)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
              Active Stream
            </span>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Total Alerts"
            value={alerts.length}
            accent="border-slate-300"
          />
          <StatCard
            label="Critical"
            value={criticalCount}
            accent="border-rose-500"
          />
          <StatCard
            label="Warning"
            value={warningCount}
            accent="border-amber-400"
          />
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <input
              id="alerts-search"
              type="text"
              placeholder="Search by asset code or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-[var(--color-industrial-border)] rounded-xl bg-[var(--color-industrial-panel)] text-[var(--color-industrial-text)] placeholder:text-[var(--color-industrial-text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Severity filter */}
          <div className="flex items-center gap-1 bg-[var(--color-industrial-panel)] rounded-xl p-1 border border-[var(--color-industrial-border)]">
            {(["All", "Critical", "Warning"] as SeverityFilter[]).map((f) => (
              <button
                key={f}
                id={`filter-${f.toLowerCase()}`}
                onClick={() => setSeverityFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  severityFilter === f
                    ? "bg-[var(--color-industrial-bg)] text-[var(--color-industrial-text)] shadow-sm"
                    : "text-[var(--color-industrial-text-muted)] hover:text-[var(--color-industrial-text)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="industrial-panel overflow-hidden">
          {loading ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-[var(--color-industrial-border)]/60 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-[var(--color-industrial-text-muted)] uppercase tracking-widest">
                Syncing alert logs...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-[var(--color-industrial-bg)] rounded-2xl border border-[var(--color-industrial-border)] flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-black text-[var(--color-industrial-text)] uppercase tracking-tight italic mb-1">
                {search || severityFilter !== "All"
                  ? "No results found"
                  : "Zero Active Threats"}
              </h3>
              <p className="text-sm text-[var(--color-industrial-text-muted)]">
                {search || severityFilter !== "All"
                  ? "Try adjusting your filters."
                  : "All assets are operating within safe thresholds."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-industrial-panel)]/80 border-b border-[var(--color-industrial-border)]">
                  <th className="px-5 py-3 text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest">
                    Asset
                  </th>
                  <th className="px-5 py-3 text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest">
                    Severity
                  </th>
                  <th className="px-5 py-3 text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest">
                    Details
                  </th>
                  <th className="px-5 py-3 text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest text-right">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-industrial-border)]">
                {paginated.map((alert) => (
                  <AlertRow key={alert.id} alert={alert} />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Pagination ── */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--color-industrial-text-muted)] font-medium">
              Showing{" "}
              <span className="font-bold text-[var(--color-industrial-text)]">
                {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[var(--color-industrial-text)]">
                {filtered.length}
              </span>{" "}
              alerts
            </p>
            <div className="flex items-center gap-1">
              <button
                id="pagination-prev"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg border border-[var(--color-industrial-border)] text-[var(--color-industrial-text-muted)] hover:bg-[var(--color-industrial-panel)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <span className="px-3 py-1.5 text-xs font-black text-[var(--color-industrial-text)]">
                {page} / {totalPages}
              </span>
              <button
                id="pagination-next"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg border border-[var(--color-industrial-border)] text-[var(--color-industrial-text-muted)] hover:bg-[var(--color-industrial-panel)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
