import React, { useState } from 'react';
import { MediaItem } from '../types';
import { Play, Info, ArrowLeft, ChevronLeft, ChevronRight, Volume2, Star, Radio } from 'lucide-react';

interface NetflixModeProps {
  mediaItems: MediaItem[];
  onBackToDashboard: () => void;
  onPlayMedia: (item: MediaItem) => void;
}

export const NetflixMode: React.FC<NetflixModeProps> = ({
  mediaItems,
  onBackToDashboard,
  onPlayMedia,
}) => {
  const featuredItem: MediaItem = mediaItems[0] || {
    id: 'sb-1',
    title: 'Interstellar 2099',
    type: 'Supabase',
    category: 'VOD',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    description: 'Une odyssée spatiale captivante au-delà du système solaire, synchronisée directement depuis votre cluster Supabase Storage.',
    rating: '9.4',
    year: '2025',
    duration: '2h 45m',
    genre: 'Science-Fiction / Aventure'
  };

  const [activeHero, setActiveHero] = useState<MediaItem>(featuredItem);

  const trendingItems = mediaItems;
  const liveItems = mediaItems.filter(i => i.category === 'Live');
  const supabaseItems = mediaItems.filter(i => i.type === 'Supabase');
  const vodItems = mediaItems.filter(i => i.category === 'VOD');
  const seriesItems = mediaItems.filter(i => i.category === 'Series');

  const renderCarousel = (title: string, items: MediaItem[], icon?: React.ReactNode) => {
    if (items.length === 0) return null;

    return (
      <section className="space-y-3 px-8 md:px-14">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          {icon}
          <span>{title}</span>
          <span className="text-xs text-slate-400 font-normal">({items.length})</span>
        </h3>

        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 scroll-smooth">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveHero(item);
                onPlayMedia(item);
              }}
              className="flex-none w-48 sm:w-56 group cursor-pointer relative rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-red-600 transition-all duration-300 hover:scale-[1.04] shadow-lg hover:shadow-red-600/20"
            >
              <div className="aspect-[16/9] relative bg-black overflow-hidden">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <span
                  className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                    item.type === 'Supabase' ? 'bg-sky-600 text-white' : 'bg-red-600 text-white'
                  }`}
                >
                  {item.type}
                </span>

                {item.category === 'Live' && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-red-600 text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    LIVE
                  </span>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900/90">
                <p className="text-xs font-bold text-white truncate">{item.title}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{item.year || '2025'}</span>
                  {item.rating && (
                    <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      {item.rating}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="h-full w-full bg-[#0c0e17]/85 backdrop-blur-2xl text-white overflow-y-auto flex flex-col font-sans relative z-10">
      {/* Netflix Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/90 to-transparent z-40 px-6 sm:px-12 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-netflix-red drop-shadow">
              STREAMVAULT
            </span>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-red-600 text-white">
              NETFLIX MODE
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-300">
            <button onClick={() => setActiveHero(featuredItem)} className="hover:text-white transition">
              Accueil
            </button>
            <span className="hover:text-white cursor-pointer transition">Films VOD</span>
            <span className="hover:text-white cursor-pointer transition">Chaînes Live</span>
            <span className="hover:text-white cursor-pointer transition">Séries</span>
          </div>
        </div>

        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold transition active:scale-[0.98]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour au Dashboard</span>
        </button>
      </nav>

      {/* Featured Hero Banner */}
      <div className="relative min-h-[500px] sm:min-h-[580px] w-full flex items-end pb-16 pt-24 px-8 md:px-14 overflow-hidden">
        {/* Background Backdrop Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeHero.backdrop || activeHero.poster}
            alt={activeHero.title}
            className="w-full h-full object-cover object-center filter brightness-[0.65]"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-black/60" />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#141414] to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                activeHero.type === 'Supabase' ? 'bg-sky-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {activeHero.type}
            </span>
            <span className="text-xs text-slate-300 font-semibold">{activeHero.genre || 'Cinéma'}</span>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> {activeHero.rating || '8.9'}
            </span>
            <span className="text-xs text-slate-400 border border-slate-600 px-1 rounded">HD 1080p</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            {activeHero.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed max-w-xl drop-shadow">
            {activeHero.description ||
              "Découvrez cette production haute définition diffusée en continu grâce à l'infrastructure unifiée StreamVault."}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onPlayMedia(activeHero)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white hover:bg-slate-200 text-black font-bold text-sm transition shadow-xl active:scale-[0.98]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Lecture</span>
            </button>

            <button
              onClick={() => {
                // cycle hero
                const nextIndex = (mediaItems.indexOf(activeHero) + 1) % mediaItems.length;
                setActiveHero(mediaItems[nextIndex]);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-700/80 hover:bg-slate-600/90 text-white font-semibold text-sm transition backdrop-blur-md active:scale-[0.98]"
            >
              <Info className="w-4 h-4" />
              <span>Titre suivant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousels */}
      <div className="relative z-20 space-y-8 pb-16">
        {renderCarousel('Tendances Actuelles', trendingItems)}
        {renderCarousel('Chaînes TV en Direct (Xtreme Live)', liveItems, <Radio className="w-4 h-4 text-red-500" />)}
        {renderCarousel('Exclusivités Supabase Cloud', supabaseItems)}
        {renderCarousel('Films & Blockbusters VOD', vodItems)}
        {renderCarousel('Séries Populaires', seriesItems)}
      </div>
    </div>
  );
};
