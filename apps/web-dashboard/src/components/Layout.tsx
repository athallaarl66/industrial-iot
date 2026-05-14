import { Outlet } from "react-router-dom";
import { Header } from "./layout/Header";
import { Sidebar } from "./layout/Sidebar";
import { Footer } from "./layout/Footer";
import { Toaster } from "sonner";

/**
 * Main Layout Component
 * Wraps the application pages with consistent Header, Sidebar, and Footer.
 * Pivoted to Industrial Dark theme.
 */
export function Layout() {
  return (
    <div className="min-h-screen bg-[var(--color-industrial-bg)] flex flex-col transition-colors duration-500">
      <Header />
      <div className="flex flex-1 max-w-[1920px] mx-auto w-full">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden p-0 border-r border-[var(--color-industrial-border)] bg-[var(--color-industrial-bg)]">
          <Outlet />
        </main>
      </div>
      <Footer />
      <Toaster position="bottom-right" richColors theme="dark" expand={true} />
    </div>
  );
}
