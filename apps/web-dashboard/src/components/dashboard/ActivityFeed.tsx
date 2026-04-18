interface ActivityItem {
  id: string;
  assetCode: string;
  status: "Running" | "Warning" | "Critical";
  message: string;
  details: string;
  timestamp: string;
}

/**
 * ActivityFeed Component
 * Displays a real-time stream of audit logs and system events.
 */
export function ActivityFeed() {
  const activities: ActivityItem[] = [
    {
      id: "1",
      assetCode: "PMP-A-001",
      status: "Running",
      message: "Normal Operation",
      details: "Temperature 72°C, Pressure 145 PSI",
      timestamp: "2 min ago",
    },
    {
      id: "2",
      assetCode: "CMP-B-002",
      status: "Warning",
      message: "Initial Warning",
      details: "Vibration above threshold (8.2 mm/s)",
      timestamp: "5 min ago",
    },
    {
      id: "3",
      assetCode: "VLV-C-003",
      status: "Critical",
      message: "Pressure Surge",
      details: "Inlet pressure exceeded safety limit (450 PSI)",
      timestamp: "12 min ago",
    },
  ];

  const getStatusConfig = (status: ActivityItem["status"]) => {
    switch (status) {
      case "Running":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-600",
          dot: "bg-emerald-500",
        };
      case "Warning":
        return {
          bg: "bg-amber-50",
          text: "text-amber-600",
          dot: "bg-amber-500",
        };
      case "Critical":
        return {
          bg: "bg-rose-50",
          text: "text-rose-600",
          dot: "bg-rose-500",
        };
    }
  };

  return (
    <div className="bg-white">
      <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Intelligence Feed</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200">Real-time Stream</span>
      </div>
      <div className="divide-y divide-slate-100">
        {activities.map((item) => {
          const config = getStatusConfig(item.status);
          return (
            <div key={item.id} className="px-8 py-5 flex items-start space-x-6 hover:bg-slate-50/50 transition-colors group">
              <div className={`mt-1 h-12 w-12 ${config.bg} rounded-2xl flex items-center justify-center border border-transparent group-hover:border-slate-200 transition-all shadow-sm shrink-0`}>
                <div className={`w-2 h-2 rounded-full ${config.dot} animate-pulse shadow-sm`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${config.text}`}>
                      {item.status}
                    </span>
                    <span className="text-slate-200">|</span>
                    <span className="text-sm font-black text-slate-900">{item.assetCode}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.timestamp}</span>
                </div>
                <p className="text-sm font-bold text-slate-700 mt-1 leading-relaxed">
                  {item.message}: <span className="font-normal text-slate-500">{item.details}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-center">
        <button className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-blue-600 transition-colors flex items-center">
          Access Complete Historical Logs
          <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
