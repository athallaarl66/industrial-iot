import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext.tsx";

/**
 * Header Component
 * The top navigation bar providing branding and global actions.
 */
export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-[var(--color-industrial-panel)] border-b border-[var(--color-industrial-border)] sticky top-0 z-40 px-4 sm:px-6 lg:px-8 h-16 flex items-center shadow-sm transition-colors duration-500">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Brand Identity */}
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-xl font-black text-[var(--color-industrial-text)] tracking-tight leading-none uppercase">
              Tracker <span className="text-blue-500">IoT</span>
            </h1>
            <p className="text-[10px] font-bold text-[var(--color-industrial-text-muted)] uppercase tracking-widest mt-0.5">
              Asset Intelligence System
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-industrial-border)] bg-[var(--color-industrial-panel)]/80 text-[var(--color-industrial-text)] hover:bg-[var(--color-industrial-border)] transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <SunMedium className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-[var(--color-industrial-border)]/20 border border-[var(--color-industrial-border)] rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-industrial-emerald)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-industrial-emerald)]"></span>
            </span>
            <span className="text-[10px] font-bold text-[var(--color-industrial-emerald)] uppercase tracking-tighter">
              System Online
            </span>
          </div>

          <div className="h-4 w-px bg-[var(--color-industrial-border)]"></div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 hover:bg-[var(--color-industrial-border)] p-1.5 rounded-xl transition-all cursor-pointer">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-bold text-[var(--color-industrial-text)] leading-none">
                A. Arli
              </span>
              <span className="text-[10px] font-bold text-[var(--color-industrial-text-muted)] uppercase tracking-tighter mt-1">
                Administrator
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[var(--color-industrial-border)]/40 border border-[var(--color-industrial-border)] flex items-center justify-center text-[var(--color-industrial-text)] font-bold text-xs ring-2 ring-[var(--color-industrial-border)]">
              AA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
