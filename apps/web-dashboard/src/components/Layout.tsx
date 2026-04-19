import { Outlet } from "react-router-dom";
import { Header } from "./layout/Header";
import { Sidebar } from "./layout/Sidebar";
import { Footer } from "./layout/Footer";
import { Toaster } from "sonner";

/**
 * Main Layout Component
 * Wraps the application pages with consistent Header, Sidebar, and Footer.
 * Pivoted to Industrial Light theme.
 */
export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col transition-colors duration-500">
      <Header />
      <div className="flex flex-1 max-w-[1920px] mx-auto w-full">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden p-0 border-r border-slate-100 bg-white">
          <Outlet />
        </main>
      </div>
      <Footer />
      <Toaster position="bottom-right" richColors theme="light" expand={true} />
    </div>
  );
}
