import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine
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
export function HistoryChart({ data, title, dataKey, color, unit, threshold }: HistoryChartProps) {
  // Sort data by timestamp ascending for the chart
  const sortedData = [...data].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="industrial-panel p-6 bg-white h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center">
          <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></span>
          {title}
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          Unit: {unit}
        </span>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sortedData}>
            <defs>
              <linearGradient id={`color${String(dataKey)}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="timestamp" 
              hide={true} // Cleaner look for high-density historical data
            />
            <YAxis 
              stroke="#94a3b8" 
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
                    <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 shadow-xl min-w-[160px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">{label ? new Date(label as string | number).toLocaleTimeString() : ''}</p>
                      <p className="text-2xl font-black text-slate-900 mb-1">{val.toFixed(1)} <span className="text-xs font-bold text-slate-400">{unit}</span></p>
                      {threshold && (
                         <div className={`mt-3 flex items-center justify-between px-2.5 py-1.5 rounded border ${isOver ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                           <span className="text-[9px] font-black uppercase tracking-widest">Safe Limit</span>
                           <span className="text-xs font-black">{threshold}</span>
                         </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            {threshold && (
              <ReferenceLine y={threshold} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={2} label={{ position: 'insideTopLeft', value: 'CRITICAL THRESHOLD', fill: '#ef4444', fontSize: 10, fontWeight: 900 }} />
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
