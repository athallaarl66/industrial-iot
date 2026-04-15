import { AssetList } from './AssetList';
import { AssetForm } from './AssetForm';

export function Dashboard() {
  const handleAssetCreated = () => {
    // This will trigger a refresh of the asset list
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Industrial IoT Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Asset Monitoring & Management System
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Asset Form */}
            <div className="lg:col-span-1">
              <AssetForm onSuccess={handleAssetCreated} />
            </div>

            {/* Right Column - Asset List */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Asset List
                  </h2>
                  <span className="text-sm text-gray-500">
                    Manage your industrial assets
                  </span>
                </div>
                <AssetList />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Industrial IoT System © 2026. Built with React, .NET, and PostgreSQL.
          </p>
        </div>
      </footer>
    </div>
  );
}