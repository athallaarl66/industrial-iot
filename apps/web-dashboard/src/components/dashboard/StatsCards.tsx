import { motion } from "framer-motion";
import { Layers, Activity, AlertTriangle, ShieldAlert } from "lucide-react";

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
      icon: Layers,
      color: "text-blue-400",
      bg: "bg-blue-900/30",
    },
    {
      label: "Operational",
      value: stats.runningAssets,
      icon: Activity,
      color: "text-emerald-400",
      bg: "bg-emerald-900/30",
    },
    {
      label: "Active Alerts",
      value: stats.activeAlerts,
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-900/30",
    },
    {
      label: "Critical",
      value: stats.criticalAssets,
      icon: ShieldAlert,
      color: "text-rose-400",
      bg: "bg-rose-900/30",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            variants={item}
            className="industrial-panel p-6 flex flex-col justify-between group h-36"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {card.label}
              </span>
              <div
                className={`${card.bg} p-2 rounded-xl transition-transform duration-300 group-hover:scale-110 border border-slate-700/50`}
              >
                <Icon className={`w-5 h-5 ${card.color}`} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-baseline">
              {loading ? (
                <div className="h-10 w-16 bg-slate-800 animate-pulse rounded-lg"></div>
              ) : (
                <h4 className="text-4xl font-black text-[var(--color-industrial-text)] tracking-tight font-mono-numbers">
                  {card.value}
                </h4>
              )}
              <span className="ml-2 text-[10px] font-bold text-[var(--color-industrial-text-muted)] uppercase">
                Nodes
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
