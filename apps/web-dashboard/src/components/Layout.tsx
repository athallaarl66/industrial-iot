import { Outlet } from "react-router-dom";
import { Header } from "./layout/Header";
import { Sidebar } from "./layout/Sidebar";
import { Footer } from "./layout/Footer";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
