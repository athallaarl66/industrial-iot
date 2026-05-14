import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import type { TelemetryHistoryEntry } from "../../types";

interface HistoryChartProps {
  data: TelemetryHistoryEntry[];
  title: string;
  dataKey: keyof TelemetryHistoryEntry;
  color: string;
  unit: string;
  threshold?: number;
}

/**
 * HistoryChart Component
 * Professional time-series visualization for industrial telemetry.
 * Uses AreaChart with gradients for a premium "Digital Twin" feel.
 */
export function HistoryChart({
  data,
  title,
  dataKey,
  color,
  unit,
  threshold,
}: HistoryChartProps) {
  // Sort data by timestamp ascending for the chart
  const sortedData = [...data].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  return (
    <div className="industrial-panel p-6 h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-[var(--color-industrial-text)] uppercase tracking-widest flex items-center">
          <span
            className="w-2 h-2 rounded-full mr-2 shadow-[0_0_8px_currentColor]"
            style={{ backgroundColor: color }}
          ></span>
          {title}
        </h3>
        <span className="text-[10px] font-bold text-[var(--color-industrial-text-muted)] uppercase tracking-tighter">
          Unit: {unit}
        </span>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sortedData}>
            <defs>
              <linearGradient
                id={`color${String(dataKey)}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1e293b"
            />
            <XAxis
              dataKey="timestamp"
              hide={true} // Cleaner look for high-density historical data
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              fontWeight={700}
              tickFormatter={(val) => `${val}${unit}`}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value as number;
                  const isOver = threshold && val >= threshold;
                  return (
                    <div className="bg-[var(--color-industrial-panel)]/95 backdrop-blur-xl p-4 rounded-2xl border border-[var(--color-industrial-border)] shadow-2xl min-w-[160px]">
                      <p className="text-[10px] font-black text-[var(--color-industrial-text-muted)] uppercase tracking-widest mb-3 border-b border-[var(--color-industrial-border)] pb-2 font-mono-numbers">
                        {label
                          ? new Date(
                              label as string | number,
                            ).toLocaleTimeString()
                          : ""}
                      </p>
                      <p className="text-2xl font-black text-[var(--color-industrial-text)] mb-1 font-mono-numbers">
                        {val.toFixed(1)}{" "}
                        <span className="text-xs font-bold text-[var(--color-industrial-text-muted)] font-sans">
                          {unit}
                        </span>
                      </p>
                      {threshold && (
                        <div
                          className={`mt-3 flex items-center justify-between px-2.5 py-1.5 rounded border ${isOver ? "bg-rose-950/50 border-rose-800/50 text-rose-400" : "bg-[var(--color-industrial-border)] border-[var(--color-industrial-border)] text-[var(--color-industrial-text-muted)]"}`}
                        >
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Safe Limit
                          </span>
                          <span className="text-xs font-black font-mono-numbers">
                            {threshold}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            {threshold && (
              <ReferenceLine
                y={threshold}
                stroke="#ef4444"
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{
                  position: "insideTopLeft",
                  value: "CRITICAL THRESHOLD",
                  fill: "#ef4444",
                  fontSize: 10,
                  fontWeight: 900,
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#color${String(dataKey)})`}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
