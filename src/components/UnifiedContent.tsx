import React, { useState } from 'react';
import { MediaItem } from '../types';
import { RotateCw, Search, Plus, Play, Film, Radio, Layers, Trash2 } from 'lucide-react';

interface UnifiedContentProps {
  mediaItems: MediaItem[];
  onRefresh: () => void;
  isRefreshing: boolean;
  onPlayMedia: (item: MediaItem) => void;
  onOpenAddModal: () => void;
  onDeleteCustomMedia?: (id: string) => void;
}

export const UnifiedContent: React.FC<UnifiedContentProps> = ({
  mediaItems,
  onRefresh,
  isRefreshing,
  onPlayMedia,
  onOpenAddModal,
  onDeleteCustomMedia,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'supabase' | 'xtreme' | 'live' | 'vod' | 'series'>('all');

  const filteredItems = mediaItems.filter((item) => {
    // Text search
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.genre && item.genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesQuery) return false;

    // Filter type
    if (selectedFilter === 'supabase') return item.type === 'Supabase';
    if (selectedFilter === 'xtreme') return item.type === 'Xtreme Codes';
    if (selectedFilter === 'live') return item.category === 'Live';
    if (selectedFilter === 'vod') return item.category === 'VOD';
    if (selectedFilter === 'series') return item.category === 'Series';

    return true;
  });

  return (
    <div id="tab-unified-content" className="tab-content space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Catalogue Unifié</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30">
              {filteredItems.length} {filteredItems.length > 1 ? 'médias' : 'média'}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Affichage combiné des données Supabase et des chaînes/VOD Xtreme Codes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter Média</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-sky-600/20 active:scale-[0.98]"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Rafraîchir les flux</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre, genre ou description..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              selectedFilter === 'all'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
            }`}
          >
            Tous ({mediaItems.length})
          </button>
          <button
            onClick={() => setSelectedFilter('supabase')}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              selectedFilter === 'supabase'
                ? 'bg-sky-600/30 text-sky-200 border border-sky-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Supabase
          </button>
          <button
            onClick={() => setSelectedFilter('xtreme')}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              selectedFilter === 'xtreme'
                ? 'bg-red-600/30 text-red-200 border border-red-500/40'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Xtreme Codes
          </button>
          <button
            onClick={() => setSelectedFilter('live')}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              selectedFilter === 'live'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
            }`}
          >
            <Radio className="w-3 h-3 text-red-400" />
            Live TV
          </button>
          <button
            onClick={() => setSelectedFilter('vod')}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              selectedFilter === 'vod'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
            }`}
          >
            <Film className="w-3 h-3 text-sky-400" />
            VOD
          </button>
          <button
            onClick={() => setSelectedFilter('series')}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              selectedFilter === 'series'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
            }`}
          >
            <Layers className="w-3 h-3 text-purple-400" />
            Séries
          </button>
        </div>
      </div>

      {/* Grid matching original markup and style */}
      <div id="unified-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-xl overflow-hidden flex flex-col justify-between group relative border border-slate-800/80 hover:border-sky-500/40 transition duration-200"
          >
            {/* Poster container with aspect-ratio [16/9] matching original */}
            <div className="aspect-[16/9] relative bg-black overflow-hidden">
              <img
                src={item.poster}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <span
                className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase shadow-sm ${
                  item.type === 'Supabase' ? 'bg-sky-600 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {item.type}
              </span>

              {item.category === 'Live' && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-red-600/90 text-white flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
              )}

              {/* Play Button Overlay */}
              <button
                onClick={() => onPlayMedia(item)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                aria-label={`Lire ${item.title}`}
              >
                <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/40 group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </button>

              {/* Delete button if custom media */}
              {item.id.startsWith('custom-') && onDeleteCustomMedia && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCustomMedia(item.id);
                  }}
                  className="absolute bottom-2 right-2 p-1.5 rounded-md bg-slate-900/80 text-rose-400 hover:text-white hover:bg-rose-600 transition opacity-0 group-hover:opacity-100"
                  title="Supprimer ce média"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Title & metadata */}
            <div className="p-3 bg-slate-900/40">
              <p className="text-xs font-bold text-white truncate group-hover:text-sky-300 transition" title={item.title}>
                {item.title}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>{item.genre || item.category}</span>
                {item.duration && <span>{item.duration}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center space-y-3">
          <Film className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-white">Aucun flux média trouvé</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Aucun résultat pour "{searchQuery}". Vérifiez votre recherche ou configurez Xtreme Codes pour synchroniser vos flux IPTV.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};
