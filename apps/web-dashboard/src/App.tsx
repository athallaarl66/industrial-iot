import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { AssetsPage } from "./pages/AssetsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/alerts" element={<div>Alerts Page (TBD)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
