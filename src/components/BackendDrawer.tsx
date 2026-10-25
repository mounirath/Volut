import React from 'react';
import { BackgroundTheme } from './AmbientBackground';
import { TabId } from './Sidebar';
import { XtremeConfig, SupabaseConfig } from '../types';
import {
  X,
  Palette,
  Database,
  Server,
  Radio,
  LineChart,
  Film,
  Tv,
  Check,
  Grid,
  Sparkles,
  CircleDot,
  Moon,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Link
} from 'lucide-react';

interface BackendDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundTheme: BackgroundTheme;
  onSelectBackgroundTheme: (theme: BackgroundTheme) => void;
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  xtremeConfig: XtremeConfig;
  supabaseConfig: SupabaseConfig;
  onOpenNetflix: () => void;
  onRefreshStreams: () => void;
  isRefreshing: boolean;
  onOpenM3uModal?: () => void;
}

export const BackendDrawer: React.FC<BackendDrawerProps> = ({
  isOpen,
  onClose,
  backgroundTheme,
  onSelectBackgroundTheme,
  activeTab,
  onSelectTab,
  xtremeConfig,
  supabaseConfig,
  onOpenNetflix,
  onRefreshStreams,
  isRefreshing,
  onOpenM3uModal,
}) => {
  if (!isOpen) return null;

  const themes: {
    id: BackgroundTheme;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'ambient-grid',
      label: 'Grille Studio & Aura',
      description: 'Lignes géométriques 40px et lueurs cyan/sky',
      icon: <Grid className="w-4 h-4 text-sky-400" />
    },
    {
      id: 'cinema-mesh',
      label: 'Cinéma Atmosphérique',
      description: 'Halos tamisés rouge et bleu nuit avec vignetage',
      icon: <Sparkles className="w-4 h-4 text-red-400" />
    },
    {
      id: 'studio-dots',
      label: 'Matrice de Points',
      description: 'Micro-points 24px haute précision studio',
      icon: <CircleDot className="w-4 h-4 text-slate-300" />
    },
    {
      id: 'obsidian-clean',
      label: 'Obsidienne Épurée',
      description: 'Noir profond pur, minimaliste et sans trame',
      icon: <Moon className="w-4 h-4 text-slate-400" />
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-slate-950/95 border-l border-sky-500/25 shadow-2xl h-full flex flex-col z-10 backdrop-blur-2xl text-white select-none overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-950/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Menu Backend & Arrière-plan</h3>
              <p className="text-[10px] text-slate-400">StreamVault Hybrid Architecture</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6 flex-1 text-xs">
          {/* SECTION 1: ARRIÈRE-PLAN D'AMBIANCE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Style d'Arrière-Plan Backend</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">CSS Mesh & Grids</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {themes.map((t) => {
                const isSelected = backgroundTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onSelectBackgroundTheme(t.id)}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-400/50 text-white shadow-md shadow-sky-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-sky-500/30' : 'bg-slate-800'}`}>
                        {t.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-white">{t.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{t.description}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 ml-2 shadow-sm">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: ÉTAT DES BACKENDS */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>État des Passerelles Backend</span>
              </span>
              <button
                onClick={onRefreshStreams}
                disabled={isRefreshing}
                className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center gap-1 transition"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Tester</span>
              </button>
            </div>

            {/* Supabase Status Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold text-white">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Supabase Cloud</span>
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Connecté
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                {supabaseConfig.url}
              </p>
              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                <span>Stockage PostgreSQL métadonnées</span>
                <button
                  onClick={() => {
                    onSelectTab('supabase-config');
                    onClose();
                  }}
                  className="text-sky-400 hover:underline"
                >
                  Configurer
                </button>
              </div>
            </div>

            {/* Xtreme Codes Status Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold text-white">
                  <Server className="w-4 h-4 text-sky-400" />
                  <span>Xtreme Codes IPTV</span>
                </span>
                <span
                  className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    xtremeConfig.isConnected
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      xtremeConfig.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  {xtremeConfig.isConnected ? 'Actif & Prêt' : 'En attente'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                {xtremeConfig.host || 'http://line.provider.com:8080'}
              </p>
              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                <span>
                  {xtremeConfig.isConnected ? `Utilisateur: ${xtremeConfig.user}` : 'Non configuré'}
                </span>
                <button
                  onClick={() => {
                    onSelectTab('xtreme-config');
                    onClose();
                  }}
                  className="text-sky-400 hover:underline"
                >
                  Paramètres API
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: NAVIGATION RAPIDE */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Navigation Rapide
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  onSelectTab('dashboard');
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                  activeTab === 'dashboard'
                    ? 'bg-sky-500/20 border-sky-400/40 text-sky-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LineChart className="w-3.5 h-3.5 text-sky-400" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('iptv-section');
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                  activeTab === 'iptv-section'
                    ? 'bg-red-600/20 border-red-500/40 text-red-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>Section IPTV</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('unified-content');
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                  activeTab === 'unified-content'
                    ? 'bg-sky-500/20 border-sky-400/40 text-sky-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-sky-400" />
                <span>Catalogue</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('xtreme-config');
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                  activeTab === 'xtreme-config'
                    ? 'bg-sky-500/20 border-sky-400/40 text-sky-300 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Server className="w-3.5 h-3.5 text-sky-400" />
                <span>Config XC</span>
              </button>
            </div>

            {onOpenM3uModal && (
              <button
                onClick={() => {
                  onOpenM3uModal();
                  onClose();
                }}
                className="w-full mt-2 p-2.5 rounded-xl bg-gradient-to-r from-red-600/20 via-sky-600/20 to-purple-600/20 hover:from-red-600/30 hover:to-sky-600/30 border border-sky-500/40 text-white font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98]"
              >
                <Link className="w-3.5 h-3.5 text-sky-400" />
                <span>Gérer les Listes & URLs M3U</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 sticky bottom-0">
          <button
            onClick={() => {
              onOpenNetflix();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-netflix-red hover:bg-red-700 text-white font-bold text-xs transition shadow-lg shadow-red-900/40 active:scale-[0.98]"
          >
            <Tv className="w-4 h-4" />
            <span>Basculer en Mode Netflix Cinema</span>
          </button>
        </div>
      </div>
    </div>
  );
};
