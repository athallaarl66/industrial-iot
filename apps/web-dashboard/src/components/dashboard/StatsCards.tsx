/**
 * StatsCards Component
 * Renders the high-level KPI cards for the dashboard.
 */
interface StatsCardsProps {
  stats: {
    totalAssets: number;
    runningAssets: number;
    activeAlerts: number;
    criticalAssets: number;
  };
  loading: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Fleet",
      value: stats.totalAssets,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2h10a2 2 0 012 2v2M5 20h14" />
      ),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Operational",
      value: stats.runningAssets,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Active Alerts",
      value: stats.activeAlerts,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      ),
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Critical",
      value: stats.criticalAssets,
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      ),
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {cards.map((card) => (
        <div key={card.label} className="industrial-panel p-6 flex flex-col justify-between group h-36 border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</span>
            <div className={`${card.bg} p-2 rounded-lg transition-transform duration-300 group-hover:scale-110`}>
              <svg className={`w-5 h-5 ${card.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {card.icon}
              </svg>
            </div>
          </div>
          <div className="flex items-baseline">
            {loading ? (
              <div className="h-10 w-16 bg-slate-100 animate-pulse rounded-lg"></div>
            ) : (
              <h4 className="text-4xl font-black text-slate-900 tracking-tight">
                {card.value}
              </h4>
            )}
            <span className="ml-2 text-[10px] font-bold text-slate-300 uppercase">Nodes</span>
          </div>
        </div>
      ))}
    </div>
  );
}
