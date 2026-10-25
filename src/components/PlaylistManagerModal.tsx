import React, { useState, useEffect } from 'react';
import { SavedPlaylist, MediaItem } from '../types';
import {
  getSavedPlaylists,
  savePlaylistRecord,
  deletePlaylistRecord,
  setActivePlaylistRecord
} from '../services/storage';
import {
  X,
  ListVideo,
  Plus,
  Check,
  Trash2,
  Edit2,
  Radio,
  Film,
  Download,
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react';

interface PlaylistManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaylistActivated: () => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export const PlaylistManagerModal: React.FC<PlaylistManagerModalProps> = ({
  isOpen,
  onClose,
  onPlaylistActivated,
  onShowToast,
}) => {
  const [playlists, setPlaylists] = useState<SavedPlaylist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPlaylists(getSavedPlaylists());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const newPl: SavedPlaylist = {
      id: `pl-${Date.now()}`,
      name: newPlaylistName.trim(),
      type: 'custom',
      itemCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: false,
      items: [],
    };

    const updated = savePlaylistRecord(newPl);
    setPlaylists(updated);
    setNewPlaylistName('');
    setIsCreating(false);
    onShowToast(`Nouvelle liste "${newPl.name}" créée !`, 'success');
  };

  const handleActivate = (id: string) => {
    const updated = setActivePlaylistRecord(id);
    setPlaylists(updated);
    onPlaylistActivated();
    const active = updated.find((p) => p.id === id);
    onShowToast(`Liste active : "${active?.name}"`, 'success');
  };

  const handleDelete = (id: string, name: string) => {
    if (playlists.length <= 1) {
      onShowToast("Vous devez conserver au moins une liste active.", "warning");
      return;
    }
    const updated = deletePlaylistRecord(id);
    setPlaylists(updated);
    onShowToast(`Liste "${name}" supprimée.`, 'info');
  };

  const handleSaveRename = (id: string) => {
    if (!editName.trim()) return;
    const pl = playlists.find((p) => p.id === id);
    if (!pl) return;

    const updatedPl: SavedPlaylist = {
      ...pl,
      name: editName.trim(),
    };
    const updated = savePlaylistRecord(updatedPl);
    setPlaylists(updated);
    setEditingId(null);
    onShowToast(`Liste renommée en "${updatedPl.name}"`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none animate-in fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-sky-500/30 rounded-2xl p-6 shadow-2xl relative space-y-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <ListVideo className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Gestion des Listes & Playlists</h3>
              <p className="text-[11px] text-slate-400">
                Gérez plusieurs listes M3U et bouquets Xtreme Codes simultanément.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Playlists List */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 text-xs">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                pl.isActive
                  ? 'bg-sky-500/15 border-sky-400/50 shadow-md shadow-sky-500/10'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1 flex-1 pr-3">
                {editingId === pl.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-slate-900 border border-sky-400 rounded px-2 py-1 text-xs text-white"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveRename(pl.id)}
                      className="p-1 rounded bg-sky-600 text-white"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 rounded bg-slate-800 text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{pl.name}</span>
                    {pl.isActive && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span>{pl.itemCount} flux enregistrés</span>
                  <span>•</span>
                  <span>Créée le {pl.createdAt}</span>
                  <span>•</span>
                  <span className="uppercase text-[9px] font-mono text-sky-400">{pl.type}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                {!pl.isActive && (
                  <button
                    onClick={() => handleActivate(pl.id)}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition"
                  >
                    Activer
                  </button>
                )}

                <button
                  onClick={() => {
                    setEditingId(pl.id);
                    setEditName(pl.name);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Renommer la liste"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {!pl.isActive && (
                  <button
                    onClick={() => handleDelete(pl.id, pl.name)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-rose-400 hover:text-white transition"
                    title="Supprimer la liste"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Create New Playlist Form */}
        {isCreating ? (
          <form onSubmit={handleCreateNew} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <label className="block text-slate-400 font-medium">Nom de la nouvelle liste</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Ex: Chaînes Sport VIP, Films 4K 2025..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-bold text-xs"
              >
                Créer
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                Annuler
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-800 hover:border-sky-500/40 text-slate-400 hover:text-sky-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Nouvelle Playlist</span>
          </button>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
