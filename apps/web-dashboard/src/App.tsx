import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { AssetsPage } from "./pages/AssetsPage";
import { AlertsPage } from "./pages/AlertsPage";
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
          <Route path="/alerts" element={<AlertsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
