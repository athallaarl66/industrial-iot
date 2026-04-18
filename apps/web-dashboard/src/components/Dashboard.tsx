export function Dashboard() {
  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="grid grid-cols-1 xl:grid-cols-6 gap-6 xl:gap-8">
        {/* Stats Cards */}
        <div className="xl:col-span-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group bg-white/70 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-6">
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                    Total Assets
                  </p>
                  <p className="text-4xl font-bold text-slate-900 mt-1">247</p>
                </div>
              </div>
            </div>
            <div className="group bg-white/70 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-6">
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                    Running
                  </p>
                  <p className="text-4xl font-bold text-slate-900 mt-1">235</p>
                </div>
              </div>
            </div>
            <div className="group bg-white/70 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333 .192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-6">
                  <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                    Active Alerts
                  </p>
                  <p className="text-4xl font-bold text-slate-900 mt-1">12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-900">
                  Temperature Trend
                </h3>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
                  <span>24h</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>14:00</span>
                  <span>72°C</span>
                </div>
                <div className="h-64 bg-gradient-to-r from-slate-100 to-gray-100 rounded-2xl flex items-end justify-between p-6 relative overflow-hidden">
                  <div className="w-2 bg-gradient-to-t from-slate-400 to-slate-200 rounded-full h-48 absolute left-6 opacity-30"></div>
                  <div className="w-2 bg-gradient-to-t from-emerald-400 to-emerald-600 rounded-full h-56 absolute left-16"></div>
                  <div className="w-2 bg-gradient-to-t from-orange-400 to-orange-600 rounded-full h-52 absolute right-20"></div>
                  <div className="w-2 bg-gradient-to-t from-slate-400 to-slate-200 rounded-full h-40 absolute right-8 opacity-30"></div>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>18:00</span>
                  <span>78°C</span>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-900">
                  Asset Status
                </h3>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <span>Live</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-900">
                      Running
                    </span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">235</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-900">
                      Warning
                    </span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-900">
                      Critical
                    </span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Recent Activity */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/50">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="group flex items-center p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">
                    PMP-A-001 Normal
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Temperature 72°C, Pressure 145 PSI
                  </p>
                </div>
                <div className="text-sm text-slate-500 ml-4">2 min ago</div>
              </div>
              <div className="group flex items-center p-6 bg-gradient-to-r from-amber-50 to-orange-100 rounded-2xl hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">
                    CMP-B-002 Warning
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    Vibration above threshold
                  </p>
                </div>
                <div className="text-sm text-slate-500 ml-4">5 min ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
