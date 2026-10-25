import React, { useState } from 'react';
import { MediaItem, MediaType, CategoryType } from '../types';
import { X, Plus, Film, Link, Image, Sparkles } from 'lucide-react';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: MediaItem) => void;
}

export const AddMediaModal: React.FC<AddMediaModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('Supabase');
  const [category, setCategory] = useState<CategoryType>('VOD');
  const [poster, setPoster] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !poster.trim() || !streamUrl.trim()) return;

    const newItem: MediaItem = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      type,
      category,
      poster: poster.trim(),
      streamUrl: streamUrl.trim(),
      description: description.trim() || undefined,
      genre: genre.trim() || (category === 'Live' ? 'Live TV' : 'Cinéma'),
      year: new Date().getFullYear().toString(),
      rating: '8.5',
    };

    onAdd(newItem);
    onClose();

    // Reset
    setTitle('');
    setPoster('');
    setStreamUrl('');
    setDescription('');
    setGenre('');
  };

  const handleFillDemoHls = () => {
    setTitle('Euronews English HD (Live Stream)');
    setType('Xtreme Codes');
    setCategory('Live');
    setPoster('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=600&auto=format&fit=crop');
    setStreamUrl('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
    setDescription('Diffusion en direct haute définition des actualités 24h/24.');
    setGenre('Actualités / Direct');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-sky-500/30 rounded-2xl p-6 shadow-2xl relative space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Ajouter un Média au Catalogue</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Titre du média *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: The Matrix Resurrections (Supabase 4K)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Source / Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MediaType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Supabase">Supabase</option>
                <option value="Xtreme Codes">Xtreme Codes</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              >
                <option value="VOD">VOD (Film)</option>
                <option value="Live">Live TV (Direct)</option>
                <option value="Series">Série</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">URL de l'affiche (Poster) *</label>
            <input
              type="url"
              required
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">URL du Flux Vidéo (.m3u8 ou .mp4) *</label>
            <input
              type="url"
              required
              value={streamUrl}
              onChange={(e) => setStreamUrl(e.target.value)}
              placeholder="https://example.com/stream.m3u8"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Ex: Science-Fiction"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Description rapide</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Synopsis ou descriptif..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleFillDemoHls}
              className="text-slate-400 hover:text-sky-300 text-[11px] flex items-center gap-1 transition"
            >
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>Remplir avec flux démo</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl text-slate-400 hover:text-white transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold transition shadow-md shadow-sky-600/30 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enregistrer</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
