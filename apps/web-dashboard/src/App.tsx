import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { AssetsPage } from "./pages/AssetsPage";
import AssetDigitalTwin from "./pages/AssetDigitalTwin";

/**
 * Main Application Component
 * Handles the high-level routing and layout orchestration.
 * Follows 'Rule_manager.md': Clean component structure.
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/assets/:id" element={<AssetDigitalTwin />} />
          <Route path="/alerts" element={
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="w-24 h-24 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center mb-8">
                <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">Alerts Management</h2>
              <p className="text-slate-500 mt-4 max-w-md font-medium text-lg">
                The centralized monitoring node for advanced diagnostic alerts is being provisioned.
              </p>
              <div className="mt-8 flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Uplink</span>
              </div>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
