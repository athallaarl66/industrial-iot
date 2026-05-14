/**
 * Footer Component
 * Provides system version and copyright information.
 */
export function Footer() {
  return (
    <footer className="bg-[var(--color-industrial-panel)] border-t border-[var(--color-industrial-border)] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] font-bold text-[var(--color-industrial-text-muted)] uppercase tracking-widest">
          <div className="flex items-center space-x-4">
            <p>© 2025 Industrial IoT Core. Platform Enterprise.</p>
            <span className="hidden md:inline text-[var(--color-industrial-border)]">
              |
            </span>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Documentation
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span className="status-dot status-dot-running"></span>
              API Status: Healthy
            </div>
            <div className="px-3 py-1 bg-[var(--color-industrial-bg)] border border-[var(--color-industrial-border)] rounded-lg text-[var(--color-industrial-text)]">
              System ID: <span className="font-semibold">PRO-IND-400</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
