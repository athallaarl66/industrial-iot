import { useState, useEffect } from "react";
import { apiService } from "../services/api";

interface DashboardStats {
  totalAssets: number;
  runningAssets: number;
  warningAssets: number;
  criticalAssets: number;
  activeAlerts: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAssets: 0,
    runningAssets: 0,
    warningAssets: 0,
    criticalAssets: 0,
    activeAlerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await apiService.getAssets();
      if (response.success && response.data) {
        const assets = response.data;
        const running = assets.filter(a => a.status === "Running").length;
        const warning = assets.filter(a => a.status === "Warning").length;
        const critical = assets.filter(a => a.status === "Critical").length;
        const activeAlerts = warning + critical;

        setStats({
          totalAssets: assets.length,
          runningAssets: running,
          warningAssets: warning,
          criticalAssets: critical,
          activeAlerts: activeAlerts,
        });
      }
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to your Industrial IoT monitoring dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assets</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {loading ? "—" : stats.totalAssets}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Running</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {loading ? "—" : stats.runningAssets}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Alerts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {loading ? "—" : stats.activeAlerts}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Temperature Trend</h3>
            <div className="h-64 bg-gray-50 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Chart placeholder</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Asset Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Running</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{loading ? "—" : stats.runningAssets}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Warning</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{loading ? "—" : stats.warningAssets}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Critical</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{loading ? "—" : stats.criticalAssets}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">PMP-A-001 Normal</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Temperature 72°C, Pressure 145 PSI</p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 ml-4">2 min ago</div>
            </div>

            <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">CMP-B-002 Warning</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Vibration above threshold</p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 ml-4">5 min ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
