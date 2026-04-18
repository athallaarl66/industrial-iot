import { Link, useLocation } from "react-router-dom";

/**
 * Navigation Item Definition
 */
const navItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    ),
  },
  {
    name: "Assets",
    path: "/assets",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2h10a2 2 0 012 2v2M5 20h14"
      />
    ),
  },
  {
    name: "Alerts",
    path: "/alerts",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    ),
  },
];

/**
 * Sidebar Component
 * Provides primary navigation with industrial-themed styling.
 * Optimized for Light theme as requested.
 */
export function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-slate-50 flex flex-col h-[calc(100vh-64px)] sticky top-16 border-r border-slate-200">
      <div className="flex-1 px-4 py-8 overflow-y-auto custom-scrollbar">
        <nav className="space-y-1">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            Navigation
          </p>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200
                  ${active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                  }
                `}
              >
                <div className={`mr-3 transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-110"}`}>
                  <svg
                    className={`w-5 h-5 ${active ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {item.icon}
                  </svg>
                </div>
                <span>{item.name}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Status Card in Sidebar */}
        <div className="mt-10 p-4 rounded-xl bg-white border border-slate-200 shadow-sm mx-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Gateway</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            Connected to <strong>Cluster 01</strong>. Data streaming active with 12ms latency.
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 text-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v1.0.0-STAGE</span>
      </div>
    </aside>
  );
}
