import React from 'react';
import { TabId } from './Sidebar';
import { MediaItem } from '../types';
import { Database, Server, Film, Radio, Tv, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';

interface DashboardProps {
  isXcConfigured: boolean;
  totalMediaCount: number;
  mediaItems: MediaItem[];
  onNavigate: (tab: TabId) => void;
  onOpenNetflix: () => void;
  onPlayMedia: (item: MediaItem) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  isXcConfigured,
  totalMediaCount,
  mediaItems,
  onNavigate,
  onOpenNetflix,
  onPlayMedia,
}) => {
  const liveCount = mediaItems.filter(i => i.category === 'Live').length;
  const vodCount = mediaItems.filter(i => i.category === 'VOD').length;
  const seriesCount = mediaItems.filter(i => i.category === 'Series').length;

  return (
    <div id="tab-dashboard" className="tab-content space-y-6">
      {/* Hero Banner */}
      <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-slate-900 to-sky-950/40 border border-sky-500/20 space-y-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 mb-2">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Architecture Hybride Décentralisée</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Plateforme Hybride StreamVault
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
            Cette interface combine le backend Supabase (stockage cloud de vos métadonnées) et les flux Xtreme Codes (Live TV, VOD, Séries de votre fournisseur IPTV).
          </p>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('iptv-section')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md shadow-red-600/30 transition active:scale-[0.98]"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Section IPTV Xtreme</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('unified-content')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition active:scale-[0.98]"
          >
            <Film className="w-4 h-4" />
            <span>Catalogue Unifié</span>
          </button>
          <button
            onClick={onOpenNetflix}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-netflix-red hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-900/30 transition active:scale-[0.98]"
          >
            <Tv className="w-4 h-4" />
            <span>Mode Netflix</span>
          </button>
          {!isXcConfigured && (
            <button
              onClick={() => onNavigate('xtreme-config')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-xs font-semibold transition"
            >
              <Server className="w-4 h-4 text-sky-400" />
              <span>Connecter Xtreme Codes</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Main Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Supabase Status */}
        <div className="glass-card rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Statut Supabase</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-bold text-emerald-400 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Connecté (Backend actif)
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            Stockage PostgreSQL & tables de métadonnées opérationnelles
          </p>
        </div>

        {/* Xtreme Codes Status */}
        <div className="glass-card rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Statut Xtreme Codes</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
              isXcConfigured 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <Server className="w-4 h-4" />
            </div>
          </div>
          <p
            id="dash-xc-status"
            className={`text-lg font-bold mt-2 flex items-center gap-2 ${
              isXcConfigured ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isXcConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            {isXcConfigured ? 'Configuré & Prêt' : 'Non configuré'}
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            {isXcConfigured
              ? 'Passerelle API active et flux HLS/TS synchronisés'
              : 'Cliquez sur Config Xtreme Codes pour renseigner vos identifiants'}
          </p>
        </div>

        {/* Total Media Count */}
        <div className="glass-card rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Médias Affichés</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 border border-sky-500/20">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <p id="dash-total-media" className="text-lg font-bold text-white mt-2">
            {totalMediaCount}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-red-400" /> {liveCount} Live
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Film className="w-3 h-3 text-sky-400" /> {vodCount} VOD
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-purple-400" /> {seriesCount} Séries
            </span>
          </div>
        </div>
      </div>

      {/* Feature Highlights & Quick Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Architecture & Security */}
        <div className="glass-card rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <h4>Synchronisation & Sécurité</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            StreamVault garantit que les clés d'accès IPTV et les jetons d'authentification Supabase restent sécurisés dans votre navigateur (localStorage chiffrable) sans relai tiers non autorisé.
          </p>
          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Backend Métadonnées Supabase
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">Actif 24/7</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isXcConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                Lecteur HLS.js Universel
              </span>
              <span className="text-[11px] text-sky-400 font-mono">VOD & Live TV</span>
            </div>
          </div>
        </div>

        {/* Media Preview Highlight */}
        <div className="glass-card rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Zap className="w-4 h-4 text-amber-400" />
              <h4>Flux Recommandés</h4>
            </div>
            <button
              onClick={() => onNavigate('unified-content')}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            {mediaItems.slice(0, 2).map((item) => (
              <div
                key={item.id}
                onClick={() => onPlayMedia(item)}
                className="group cursor-pointer rounded-lg overflow-hidden bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition relative"
              >
                <div className="aspect-video relative overflow-hidden bg-black">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg">
                      <Tv className="w-4 h-4 ml-0.5" />
                    </div>
                  </div>
                  <span
                    className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                      item.type === 'Supabase' ? 'bg-sky-600 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {item.type}
                  </span>
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-semibold text-white truncate">{item.title}</p>
                  <p className="text-[10px] text-slate-400">{item.genre || item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
