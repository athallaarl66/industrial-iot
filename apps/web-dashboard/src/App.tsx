import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { AssetsPage } from "./pages/AssetsPage";
import { AlertsPage } from "./pages/AlertsPage";
import AssetDigitalTwin from "./pages/AssetDigitalTwin";
import { LoginPage } from "./pages/LoginPage";
import { ProvisioningPage } from "./pages/ProvisioningPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

/**
 * Main Application Component
 * Handles the high-level routing and layout orchestration.
 * Follows 'Rule_manager.md': Clean component structure.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/assets/:id" element={<AssetDigitalTwin />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/provisioning" element={<ProvisioningPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
