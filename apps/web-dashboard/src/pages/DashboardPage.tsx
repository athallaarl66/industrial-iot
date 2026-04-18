export function DashboardPage() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center">
            <div className="p-3 bg-white/20 rounded-xl">
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
            <div className="ml-4">
              <p className="text-blue-100 text-sm font-medium">Total Assets</p>
              <p className="text-3xl font-bold">12</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center">
            <div className="p-3 bg-white/20 rounded-xl">
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
            <div className="ml-4">
              <p className="text-emerald-100 text-sm font-medium">Running</p>
              <p className="text-3xl font-bold">10</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center">
            <div className="p-3 bg-white/20 rounded-xl">
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
            <div className="ml-4">
              <p className="text-orange-100 text-sm font-medium">Alerts</p>
              <p className="text-3xl font-bold">2</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-emerald-600"
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
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-900">
                  Pump A-001 Running Normal
                </p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-600"
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
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-900">
                  Compressor B-002 Warning
                </p>
                <p className="text-sm text-gray-500">5 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Live Metrics</h3>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                Temperature
              </p>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-primary-600">
                  72.4
                </span>
                <span className="ml-2 text-sm text-gray-500">°C</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                Pressure
              </p>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-primary-600">145</span>
                <span className="ml-2 text-sm text-gray-500">PSI</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-yellow-500 h-2 rounded-full"
                  style={{ width: "62%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
