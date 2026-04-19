import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import type { TelemetryHistoryEntry } from "../../types";

interface HistoryChartProps {
  data: TelemetryHistoryEntry[];
  title: string;
  dataKey: keyof TelemetryHistoryEntry;
  color: string;
  unit: string;
}

/**
 * HistoryChart Component
 * Professional time-series visualization for industrial telemetry.
 * Uses AreaChart with gradients for a premium "Digital Twin" feel.
 */
export function HistoryChart({ data, title, dataKey, color, unit }: HistoryChartProps) {
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
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '16px', 
                border: '1px solid rgba(255, 255, 255, 0.3)', 
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                padding: '16px'
              }}
              labelStyle={{ color: '#64748b', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}
              itemStyle={{ color: '#0f172a', fontWeight: 900, fontSize: '15px' }}
              labelFormatter={(label) => new Date(label).toLocaleString()}
            />
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
