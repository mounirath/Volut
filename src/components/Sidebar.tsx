import React from 'react';
import { Play, LineChart, Film, Server, Database, Tv, Radio, X } from 'lucide-react';

export type TabId = 'dashboard' | 'iptv-section' | 'unified-content' | 'xtreme-config' | 'supabase-config';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onOpenNetflix: () => void;
  isXcConfigured: boolean;
  onCloseMobile?: () => void;
  isMobile?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenNetflix,
  isXcConfigured,
  onCloseMobile,
  isMobile = false,
}) => {
  const handleTabClick = (tab: TabId) => {
    onTabChange(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`${
        isMobile ? 'w-72 h-full' : 'w-64 hidden lg:flex'
      } glass-panel border-r border-sky-500/20 flex flex-col justify-between shrink-0 z-40 select-none`}
    >
      <div className="p-5 flex flex-col h-full overflow-y-auto">
        {/* Logo & Mobile Close */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white">
                Stream<span className="text-sky-400">Vault</span>
              </h1>
              <p className="text-[10px] text-sky-300 font-semibold tracking-wider uppercase">
                Supabase & Xtreme
              </p>
            </div>
          </div>

          {isMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 flex-1 text-xs">
          <button
            onClick={() => handleTabClick('dashboard')}
            data-nav="dashboard"
            className={`nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
              activeTab === 'dashboard'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LineChart className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Dashboard Supabase</span>
          </button>

          {/* New Dedicated IPTV Section Tab */}
          <button
            onClick={() => handleTabClick('iptv-section')}
            data-nav="iptv-section"
            className={`nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${
              activeTab === 'iptv-section'
                ? 'bg-red-600/20 text-red-300 border border-red-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Radio className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
              <span>Section IPTV Xtreme</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-red-600/80 text-white uppercase tracking-wider">
              Live & VOD
            </span>
          </button>

          <button
            onClick={() => handleTabClick('unified-content')}
            data-nav="unified-content"
            className={`nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
              activeTab === 'unified-content'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Film className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="truncate">Contenu Unifié (Supabase + Xtreme)</span>
          </button>

          <button
            onClick={() => handleTabClick('xtreme-config')}
            data-nav="xtreme-config"
            className={`nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition ${
              activeTab === 'xtreme-config'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <Server className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Config Xtreme Codes</span>
            </div>
            {isXcConfigured && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Xtreme Codes configuré" />
            )}
          </button>

          <button
            onClick={() => handleTabClick('supabase-config')}
            data-nav="supabase-config"
            className={`nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition ${
              activeTab === 'supabase-config'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Database className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Config Supabase</span>
          </button>
        </nav>

        {/* Footer / Switch to Netflix */}
        <div className="pt-4 border-t border-slate-800 mt-auto">
          <button
            onClick={() => {
              onOpenNetflix();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-netflix-red hover:bg-red-700 text-white font-bold text-xs transition shadow-lg shadow-red-900/40 group active:scale-[0.98]"
          >
            <Tv className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Ouvrir Mode Netflix</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
