import React, { useState } from 'react';
import { MediaItem, MediaType, CategoryType } from '../types';
import {
  FolderKanban,
  Search,
  Plus,
  Edit2,
  Trash2,
  Play,
  Download,
  RotateCcw,
  Check,
  X,
  Radio,
  Film,
  Layers,
  Sparkles,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  SlidersHorizontal,
  Link
} from 'lucide-react';

interface MediaManagerProps {
  mediaItems: MediaItem[];
  onPlayMedia: (item: MediaItem) => void;
  onUpdateMedia: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
  onAddNewMedia: (item: MediaItem) => void;
  onResetXtremeContent: () => void;
  onOpenM3uModal: () => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  mediaItems,
  onPlayMedia,
  onUpdateMedia,
  onDeleteMedia,
  onAddNewMedia,
  onResetXtremeContent,
  onOpenM3uModal,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<'all' | 'Xtreme Codes' | 'Supabase'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Live' | 'VOD' | 'Series'>('all');
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for editing or creating
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<MediaType>('Xtreme Codes');
  const [editCategory, setEditCategory] = useState<CategoryType>('Live');
  const [editSubCategory, setEditSubCategory] = useState('');
  const [editPoster, setEditPoster] = useState('');
  const [editStreamUrl, setEditStreamUrl] = useState('');
  const [editQuality, setEditQuality] = useState<'4K UHD' | 'FHD 1080p' | 'HD 720p'>('FHD 1080p');
  const [editChannelNum, setEditChannelNum] = useState<number | undefined>(undefined);
  const [editEpgNow, setEditEpgNow] = useState('');

  const openEditModal = (item: MediaItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditType(item.type);
    setEditCategory(item.category);
    setEditSubCategory(item.subCategory || '');
    setEditPoster(item.poster);
    setEditStreamUrl(item.streamUrl);
    setEditQuality(item.quality || 'FHD 1080p');
    setEditChannelNum(item.channelNumber);
    setEditEpgNow(item.epgNow || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updated: MediaItem = {
      ...editingItem,
      title: editTitle.trim(),
      type: editType,
      category: editCategory,
      subCategory: editSubCategory.trim() || undefined,
      poster: editPoster.trim(),
      streamUrl: editStreamUrl.trim(),
      quality: editQuality,
      channelNumber: editChannelNum,
      epgNow: editEpgNow.trim() || undefined,
    };

    onUpdateMedia(updated);
    setEditingItem(null);
    onShowToast(`Média "${updated.title}" mis à jour avec succès !`, 'success');
  };

  const handleToggleEnabled = (item: MediaItem) => {
    const updated: MediaItem = {
      ...item,
      enabled: item.enabled === false ? true : false,
    };
    onUpdateMedia(updated);
    onShowToast(`Flux "${item.title}" ${updated.enabled !== false ? 'activé' : 'désactivé'}`, 'info');
  };

  const handleToggleFavorite = (item: MediaItem) => {
    const updated: MediaItem = {
      ...item,
      isFavorite: !item.isFavorite,
    };
    onUpdateMedia(updated);
    onShowToast(`Flux "${item.title}" ${updated.isFavorite ? 'ajouté aux favoris' : 'retiré des favoris'}`, 'info');
  };

  const handleExportM3u = () => {
    let m3uContent = '#EXTM3U\n';
    filteredItems.forEach((item) => {
      const group = item.subCategory || item.genre || item.category;
      const chno = item.channelNumber ? ` tvg-chno="${item.channelNumber}"` : '';
      const logo = item.poster ? ` tvg-logo="${item.poster}"` : '';
      m3uContent += `#EXTINF:-1 tvg-name="${item.title}"${chno}${logo} group-title="${group}",${item.title}\n`;
      m3uContent += `${item.streamUrl}\n`;
    });

    const blob = new Blob([m3uContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `streamvault_export_${Date.now()}.m3u`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast(`Playlist M3U téléchargée (${filteredItems.length} flux)`, 'success');
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(filteredItems, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `streamvault_media_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast(`Fichier JSON de configuration exporté`, 'success');
  };

  const filteredItems = mediaItems.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subCategory && item.subCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.genre && item.genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.streamUrl.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;
    if (selectedSource !== 'all' && item.type !== selectedSource) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;

    return true;
  });

  return (
    <div id="tab-media-manager" className="space-y-6 text-white select-none">
      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-slate-900/90 via-sky-950/40 to-slate-900/90 border border-sky-500/25 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-400/30 mb-2">
              <FolderKanban className="w-3.5 h-3.5 text-sky-400" />
              <span>Gestionnaire Intégral des Médias & Flux</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Gestion des Médias, Xtreme Codes & M3U
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              Modifiez, renommez, activez/désactivez ou remplacez directement le contenu des chaînes IPTV, des films VOD et des séries sans reconfigurer l'application.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenM3uModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 text-xs font-semibold transition flex items-center gap-1.5 active:scale-[0.98]"
            >
              <Link className="w-3.5 h-3.5" />
              <span>Gérer Playlists M3U</span>
            </button>

            <button
              onClick={handleExportM3u}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-sky-600/20 active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter M3U</span>
            </button>

            <button
              onClick={handleExportJson}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium transition"
            >
              JSON
            </button>

            <button
              onClick={onResetXtremeContent}
              className="px-3 py-2 rounded-xl text-slate-400 hover:text-white text-xs flex items-center gap-1 transition"
              title="Réinitialiser les flux aux valeurs par défaut"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre, bouquet, URL..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
          />
        </div>

        {/* Source & Category Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Source Filter */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            {(['all', 'Xtreme Codes', 'Supabase'] as const).map((src) => (
              <button
                key={src}
                onClick={() => setSelectedSource(src)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedSource === src
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {src === 'all' ? 'Toutes Sources' : src}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800">
            {(['all', 'Live', 'VOD', 'Series'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Tous' : cat === 'Live' ? 'Live TV' : cat === 'VOD' ? 'Films VOD' : 'Séries'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Media Items Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="p-3.5 pl-5">Média / Chaîne</th>
                <th className="p-3.5">Source & Catégorie</th>
                <th className="p-3.5">Bouquet (Group)</th>
                <th className="p-3.5">Qualité</th>
                <th className="p-3.5">Statut</th>
                <th className="p-3.5 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredItems.map((item) => {
                const isEnabled = item.enabled !== false;
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-800/40 transition group ${
                      !isEnabled ? 'opacity-50 bg-slate-950/40' : ''
                    }`}
                  >
                    {/* Media Preview + Title */}
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 rounded-lg overflow-hidden bg-black shrink-0 relative border border-slate-800">
                          <img
                            src={item.poster}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="max-w-xs sm:max-w-sm truncate">
                          <div className="font-bold text-white text-xs truncate flex items-center gap-1.5">
                            <span>{item.title}</span>
                            {item.isFavorite && (
                              <Star className="w-3 h-3 text-amber-400 fill-current shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">
                            {item.streamUrl}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Source & Type */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            item.type === 'Supabase'
                              ? 'bg-sky-600/30 text-sky-300 border border-sky-500/40'
                              : 'bg-red-600/30 text-red-300 border border-red-500/40'
                          }`}
                        >
                          {item.type}
                        </span>
                        <span className="text-[11px] text-slate-300 font-medium">
                          {item.category === 'Live' ? 'Direct TV' : item.category === 'VOD' ? 'Film VOD' : 'Série'}
                        </span>
                      </div>
                    </td>

                    {/* Bouquet / Group-Title */}
                    <td className="p-3.5 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                        {item.subCategory || item.genre || 'Général'}
                      </span>
                    </td>

                    {/* Quality */}
                    <td className="p-3.5 font-mono text-[11px] text-slate-400">
                      {item.quality || 'FHD 1080p'}
                    </td>

                    {/* Status Enable/Disable */}
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleEnabled(item)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold transition ${
                          isEnabled
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                        title={isEnabled ? 'Cliquer pour désactiver' : 'Cliquer pour activer'}
                      >
                        {isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{isEnabled ? 'Actif' : 'Masqué'}</span>
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPlayMedia(item)}
                          className="p-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white transition"
                          title="Lancer la lecture"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>

                        <button
                          onClick={() => handleToggleFavorite(item)}
                          className={`p-1.5 rounded-lg transition ${
                            item.isFavorite
                              ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title="Favori"
                        >
                          <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
                        </button>

                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                          title="Modifier le flux (titre, lien, bouquet)"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            onDeleteMedia(item.id);
                            onShowToast(`Flux "${item.title}" supprimé`, 'info');
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-rose-400 hover:text-white transition"
                          title="Supprimer ce média"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <FolderKanban className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-semibold text-white">Aucun média trouvé</p>
            <p className="text-[11px] text-slate-500">
              Modifiez vos critères de recherche ou réinitialisez les filtres.
            </p>
          </div>
        )}
      </div>

      {/* EDIT MEDIA MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-sky-500/30 rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-sky-400" />
                <span>Modifier le Flux / Média</span>
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Titre / Nom du canal *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Source</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as MediaType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Xtreme Codes">Xtreme Codes</option>
                    <option value="Supabase">Supabase</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Catégorie</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as CategoryType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Live">Live TV (Direct)</option>
                    <option value="VOD">Film (VOD)</option>
                    <option value="Series">Série TV</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Bouquet / Sous-Catégorie</label>
                <input
                  type="text"
                  value={editSubCategory}
                  onChange={(e) => setEditSubCategory(e.target.value)}
                  placeholder="Ex: FR | SPORTS LIVE, VOD ACTION 4K..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">URL du Flux Multimédia (.m3u8, .mp4, .ts) *</label>
                <input
                  type="url"
                  required
                  value={editStreamUrl}
                  onChange={(e) => setEditStreamUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">URL du Logo / Affiche (Poster)</label>
                <input
                  type="url"
                  value={editPoster}
                  onChange={(e) => setEditPoster(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Qualité</label>
                  <select
                    value={editQuality}
                    onChange={(e) => setEditQuality(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="4K UHD">4K UHD</option>
                    <option value="FHD 1080p">FHD 1080p</option>
                    <option value="HD 720p">HD 720p</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Numéro de Chaîne</label>
                  <input
                    type="number"
                    value={editChannelNum || ''}
                    onChange={(e) => setEditChannelNum(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                    placeholder="Ex: 101"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {editCategory === 'Live' && (
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Guide EPG (Programme en direct)</label>
                  <input
                    type="text"
                    value={editEpgNow}
                    onChange={(e) => setEditEpgNow(e.target.value)}
                    placeholder="Ex: Match en direct Ligue des Champions"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-sky-600/30"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
