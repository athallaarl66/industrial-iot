/**
 * Header Component
 * The top navigation bar providing branding and global actions.
 */
export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 h-16 flex items-center shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        {/* Brand Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
              Industrial <span className="text-blue-600">IoT</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Asset Intelligence System
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center space-x-6">
          {/* Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tighter">System Online</span>
          </div>

          <div className="h-4 w-px bg-slate-200"></div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 hover:bg-slate-50 p-1.5 rounded-xl transition-all cursor-pointer">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-sm font-bold text-slate-900 leading-none">A. Arli</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Administrator</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs ring-2 ring-white">
              AA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
