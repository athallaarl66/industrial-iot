import { Link, useLocation } from "react-router-dom";

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

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-white dark:bg-slate-800 shadow-sm border-r border-gray-200 dark:border-slate-700 min-h-[calc(100vh-65px)]">
      <nav className="mt-8 px-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-2 transition-all duration-200 ${
              isActive(item.path)
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <svg
              className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                isActive(item.path) ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {item.icon}
            </svg>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
