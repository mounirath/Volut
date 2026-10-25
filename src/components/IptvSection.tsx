import React, { useState } from 'react';
import { MediaItem, XtremeConfig } from '../types';
import {
  Radio,
  Film,
  Layers,
  Search,
  Play,
  Server,
  RotateCw,
  Sparkles,
  Tv,
  Star,
  Clock,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Filter,
  Link
} from 'lucide-react';

interface IptvSectionProps {
  mediaItems: MediaItem[];
  xtremeConfig: XtremeConfig;
  onPlayMedia: (item: MediaItem) => void;
  onNavigateToConfig: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onLoadDemoConfig: () => void;
  onOpenM3uModal: () => void;
}

type IptvTab = 'live' | 'vod' | 'series';

export const IptvSection: React.FC<IptvSectionProps> = ({
  mediaItems,
  xtremeConfig,
  onPlayMedia,
  onNavigateToConfig,
  onRefresh,
  isRefreshing,
  onLoadDemoConfig,
  onOpenM3uModal,
}) => {
  const [activeIptvTab, setActiveIptvTab] = useState<IptvTab>('live');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [qualityFilter, setQualityFilter] = useState<'all' | '4K UHD' | 'FHD 1080p'>('all');

  // Filter only Xtreme Codes and M3U items
  const allIptvItems = mediaItems.filter((i) => i.type === 'Xtreme Codes');

  const liveItems = allIptvItems.filter((i) => i.category === 'Live');
  const vodItems = allIptvItems.filter((i) => i.category === 'VOD');
  const seriesItems = allIptvItems.filter((i) => i.category === 'Series');

  const currentTabItems = activeIptvTab === 'live' ? liveItems : activeIptvTab === 'vod' ? vodItems : seriesItems;

  // Subcategories extracted from M3U playlist groups + defaults
  const getSubcategories = () => {
    const defaultSubs =
      activeIptvTab === 'live'
        ? ['Sport en direct', 'Cinéma & Séries', 'Actualités & Monde', 'Documentaires & Découverte']
        : activeIptvTab === 'vod'
        ? ['Action & Aventure', 'Science-Fiction', 'Thriller & Espionnage', 'Animation & Famille']
        : ['Drame & Pouvoir', 'Cyberpunk & Sci-Fi', 'Action & Militaire'];

    const dynamicSubs = new Set<string>();
    currentTabItems.forEach((item) => {
      if (item.subCategory && item.subCategory !== 'Général') {
        dynamicSubs.add(item.subCategory);
      }
    });

    const combined = Array.from(new Set([...defaultSubs, ...Array.from(dynamicSubs)]));
    return ['all', ...combined];
  };

  const filteredItems = currentTabItems.filter((item) => {
    // Search query
    const matchQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.genre && item.genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.epgNow && item.epgNow.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchQuery) return false;

    // Subcategory filter
    if (selectedSubCategory !== 'all' && item.subCategory !== selectedSubCategory) {
      return false;
    }

    // Quality filter
    if (qualityFilter !== 'all' && item.quality !== qualityFilter) {
      return false;
    }

    return true;
  });

  return (
    <div id="tab-iptv-section" className="space-y-6">
      {/* Top Banner & IPTV Server Credentials Status */}
      <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-slate-900/90 via-sky-950/30 to-slate-900/90 border border-sky-500/25 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-red-600/10 via-sky-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-600/20 text-red-300 border border-red-500/30 mb-2">
              <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>Passerelle IPTV Xtreme Codes</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Section IPTV Dédiée
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Explorez l’ensemble des flux Xtreme Codes classés avec précision en <strong className="text-white">Chaînes Live TV</strong>, <strong className="text-white">Films VOD</strong> et <strong className="text-white">Séries Complètes</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {xtremeConfig.isConnected ? (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span>{xtremeConfig.user || 'Utilisateur'}</span>
                    <span className="text-[10px] text-emerald-400 font-normal border border-emerald-500/30 px-1.5 rounded">
                      Connecté
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                    {xtremeConfig.host}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onLoadDemoConfig}
                className="px-3.5 py-2 rounded-xl bg-sky-600/30 hover:bg-sky-600/40 text-sky-300 border border-sky-400/30 text-xs font-semibold transition flex items-center gap-1.5 active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Charger Flux IPTV Démo</span>
              </button>
            )}

            <button
              onClick={onOpenM3uModal}
              className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-500 hover:to-sky-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-sky-900/30 active:scale-[0.98]"
            >
              <Link className="w-3.5 h-3.5" />
              <span>Gérer URL & Listes M3U</span>
            </button>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 active:scale-[0.98]"
              title="Rafraîchir la playlist"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* Quick metrics bar */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400 shrink-0" />
            <div>
              <span className="text-slate-400 text-[11px]">Live TV :</span>{' '}
              <span className="font-bold text-white">{liveItems.length} chaînes</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <span className="text-slate-400 text-[11px]">Films VOD :</span>{' '}
              <span className="font-bold text-white">{vodItems.length} titres</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-slate-400 text-[11px]">Séries TV :</span>{' '}
              <span className="font-bold text-white">{seriesItems.length} séries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Category Selector (Segmented 3-Way Tabs) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 w-full md:w-auto shadow-sm">
          <button
            onClick={() => {
              setActiveIptvTab('live');
              setSelectedSubCategory('all');
            }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition ${
              activeIptvTab === 'live'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live TV (Chaînes)</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeIptvTab === 'live' ? 'bg-red-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
              {liveItems.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveIptvTab('vod');
              setSelectedSubCategory('all');
            }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition ${
              activeIptvTab === 'vod'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Films (VOD)</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeIptvTab === 'vod' ? 'bg-sky-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
              {vodItems.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveIptvTab('series');
              setSelectedSubCategory('all');
            }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition ${
              activeIptvTab === 'series'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Séries TV</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] ${activeIptvTab === 'series' ? 'bg-purple-800 text-white' : 'bg-slate-800 text-slate-400'}`}>
              {seriesItems.length}
            </span>
          </button>
        </div>

        {/* Quality selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] hidden sm:inline">Qualité :</span>
          {(['all', '4K UHD', 'FHD 1080p'] as const).map((q) => (
            <button
              key={q}
              onClick={() => setQualityFilter(q)}
              className={`px-2.5 py-1.5 rounded-lg transition text-[11px] font-medium ${
                qualityFilter === q
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30 font-semibold'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
              }`}
            >
              {q === 'all' ? 'Toutes' : q}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Sub-Category Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Rechercher dans ${activeIptvTab === 'live' ? 'les chaînes en direct' : activeIptvTab === 'vod' ? 'les films VOD' : 'les séries'}...`}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <span className="text-xs text-slate-400">
            {filteredItems.length} résultat{filteredItems.length > 1 ? 's' : ''} trouvé{filteredItems.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Sub-Category Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {getSubcategories().map((sub) => {
            const isSelected = selectedSubCategory === sub;
            const label = sub === 'all' ? 'Tout afficher' : sub;

            return (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? activeIptvTab === 'live'
                      ? 'bg-red-600/25 text-red-300 border border-red-500/40 font-semibold'
                      : activeIptvTab === 'vod'
                      ? 'bg-sky-600/25 text-sky-300 border border-sky-500/40 font-semibold'
                      : 'bg-purple-600/25 text-purple-300 border border-purple-500/40 font-semibold'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800/90'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- CONTENT CARDS: LIVE TV --- */}
      {activeIptvTab === 'live' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((channel) => (
            <div
              key={channel.id}
              onClick={() => onPlayMedia(channel)}
              className="glass-card rounded-xl overflow-hidden flex flex-col justify-between group cursor-pointer border border-slate-800/80 hover:border-red-500/40 transition duration-200"
            >
              {/* Channel Visual Header */}
              <div className="aspect-[16/9] relative bg-black overflow-hidden">
                <img
                  src={channel.poster}
                  alt={channel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  {channel.channelNumber && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-white border border-white/20">
                      CH {channel.channelNumber}
                    </span>
                  )}
                  {channel.quality && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-600/90 text-white">
                      {channel.quality}
                    </span>
                  )}
                </div>

                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-red-600 text-white flex items-center gap-1 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    DIRECT
                  </span>
                </div>

                {/* Play on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Channel Info & EPG Guide */}
              <div className="p-3.5 bg-slate-900/60 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-red-300 transition truncate">
                    {channel.title}
                  </h4>
                  <p className="text-[10px] text-slate-400">{channel.genre || channel.subCategory}</p>
                </div>

                {/* EPG Snippet */}
                {channel.epgNow && (
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3 h-3 text-red-400 shrink-0" />
                      <span className="truncate font-medium">{channel.epgNow}</span>
                    </div>
                    {channel.epgNext && (
                      <div className="text-[10px] text-slate-500 truncate pl-4">
                        Suivant : {channel.epgNext}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayMedia(channel);
                  }}
                  className="w-full py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-[11px] font-semibold transition flex items-center justify-center gap-1.5 mt-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Regarder le direct</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- CONTENT CARDS: FILMS (VOD) --- */}
      {activeIptvTab === 'vod' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onPlayMedia(movie)}
              className="glass-card rounded-xl overflow-hidden flex flex-col justify-between group cursor-pointer border border-slate-800/80 hover:border-sky-500/40 transition duration-200"
            >
              <div className="aspect-[16/9] relative bg-black overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-sky-600 text-white">
                  {movie.quality || 'FHD 1080p'}
                </span>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/40 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60">
                <p className="text-xs font-bold text-white truncate group-hover:text-sky-300 transition" title={movie.title}>
                  {movie.title}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{movie.year || '2024'}</span>
                  {movie.rating && (
                    <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      {movie.rating}
                    </span>
                  )}
                  {movie.duration && <span>{movie.duration}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- CONTENT CARDS: SÉRIES TV --- */}
      {activeIptvTab === 'series' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((serie) => (
            <div
              key={serie.id}
              onClick={() => onPlayMedia(serie)}
              className="glass-card rounded-xl overflow-hidden flex flex-col justify-between group cursor-pointer border border-slate-800/80 hover:border-purple-500/40 transition duration-200"
            >
              <div className="aspect-[16/9] relative bg-black overflow-hidden">
                <img
                  src={serie.poster}
                  alt={serie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-600 text-white">
                    SÉRIE
                  </span>
                  {serie.seasonsCount && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-black/70 text-slate-300 border border-white/10">
                      {serie.seasonsCount} Saisons ({serie.episodesCount || 16} ép.)
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900/60 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition">
                      {serie.title}
                    </h4>
                    <p className="text-[10px] text-slate-400">{serie.genre || serie.subCategory}</p>
                  </div>
                  {serie.rating && (
                    <span className="flex items-center gap-0.5 text-xs text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      {serie.rating}
                    </span>
                  )}
                </div>

                {serie.description && (
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {serie.description}
                  </p>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayMedia(serie);
                  }}
                  className="w-full py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-[11px] font-semibold transition flex items-center justify-center gap-1.5 mt-2"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Lancer le premier épisode</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center space-y-3">
          <Radio className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-white">Aucun flux trouvé dans cette catégorie</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Aucun résultat ne correspond aux filtres actuels. Assurez-vous que vos identifiants Xtreme Codes sont configurés ou chargez les flux démo.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubCategory('all');
                setQualityFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
            >
              Réinitialiser les filtres
            </button>
            <button
              onClick={onNavigateToConfig}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Gérer config Xtreme Codes</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
