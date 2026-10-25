import React, { useState, useRef, useEffect } from 'react';
import { TabId } from './Sidebar';
import { BackgroundTheme } from './AmbientBackground';
import { CheckCircle2, Tv, Sparkles, Palette, Check, Menu, Radio, Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: TabId;
  isXcConfigured: boolean;
  onOpenNetflix: () => void;
  backgroundTheme: BackgroundTheme;
  onSelectBackgroundTheme: (theme: BackgroundTheme) => void;
  onOpenBackendDrawer: () => void;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  isXcConfigured,
  onOpenNetflix,
  backgroundTheme,
  onSelectBackgroundTheme,
  onOpenBackendDrawer,
  onToggleMobileSidebar,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Tableau de Bord & Backend Unifié';
      case 'iptv-section':
        return 'Section IPTV Xtreme Codes (Live TV, Films & Séries)';
      case 'unified-content':
        return 'Catalogue & Flux Multimédias Unifiés';
      case 'xtreme-config':
        return 'Paramètres & Configuration Xtreme Codes API';
      case 'supabase-config':
        return 'Connexion & Stockage Cloud Supabase';
      default:
        return 'Tableau de Bord & Backend Unifié';
    }
  };

  const themes: { id: BackgroundTheme; label: string; desc: string }[] = [
    { id: 'ambient-grid', label: 'Grille Studio & Aura', desc: 'Lignes géométriques discrètes et lueurs cyan' },
    { id: 'cinema-mesh', label: 'Cinéma Atmosphérique', desc: 'Lumière tamisée rouge & bleu nuit' },
    { id: 'studio-dots', label: 'Matrice de Points', desc: 'Micro-points réguliers haute précision' },
    { id: 'obsidian-clean', label: 'Obsidienne Épurée', desc: 'Noir profond minimaliste sans motif' },
  ];

  return (
    <header className="h-16 border-b border-sky-500/20 glass-panel px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 relative select-none">
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition active:scale-95"
          aria-label="Ouvrir la navigation latérale"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 id="page-title" className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md md:max-w-xl">
          {getTitle()}
        </h2>

        {activeTab === 'iptv-section' ? (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-600/20 text-red-300 border border-red-500/30">
            <Radio className="w-3 h-3 text-red-400 animate-pulse" />
            <span>Xtreme Live & VOD</span>
          </span>
        ) : (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>V1.0 Hybrid Engine</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {/* Background Quick Switcher Dropdown */}
        <div className="relative hidden sm:block" ref={menuRef}>
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition active:scale-[0.98]"
            title="Style d'arrière-plan"
          >
            <Palette className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Arrière-plan</span>
          </button>

          {isThemeMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900/95 border border-sky-500/30 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-1 text-xs">
              <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1">
                Ambiance d'Arrière-Plan
              </div>
              <div className="space-y-1">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectBackgroundTheme(t.id);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition ${
                      backgroundTheme === t.id
                        ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-400/30'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs">{t.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{t.desc}</div>
                    </div>
                    {backgroundTheme === t.id && (
                      <Check className="w-4 h-4 text-sky-400 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dedicated Hamburger Menu Button for Backend & Background */}
        <button
          onClick={onOpenBackendDrawer}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 hover:text-white border border-sky-400/40 text-xs font-semibold shadow-sm transition active:scale-[0.98]"
          title="Ouvrir le menu hamburger backend & ambiance"
        >
          <Menu className="w-4 h-4 text-sky-400" />
          <span className="hidden sm:inline">Menu Backend</span>
        </button>

        {/* Netflix Button */}
        <button
          onClick={onOpenNetflix}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30 text-xs font-semibold transition"
        >
          <Tv className="w-3.5 h-3.5 text-red-400" />
          <span>Netflix</span>
        </button>

        {/* Connection status indicator */}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
            isXcConfigured
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span className="hidden xl:inline">{isXcConfigured ? 'Supabase & Xtreme Connectés' : 'Supabase Prêt (Xtreme en attente)'}</span>
          <span className="xl:hidden">{isXcConfigured ? 'Connecté' : 'Partiel'}</span>
        </span>
      </div>
    </header>
  );
};
