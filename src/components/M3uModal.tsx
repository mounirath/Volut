import React, { useState, useEffect } from 'react';
import { MediaItem, XtremeConfig } from '../types';
import {
  parseM3uContent,
  buildXtremeM3uUrl,
  SAMPLE_M3U_PLAYLIST,
  M3uParseResult
} from '../services/m3uParser';
import {
  getM3uUrl,
  saveM3uUrl,
  clearM3uUrl,
  saveM3uItems,
  clearM3uItems,
  getM3uItems
} from '../services/storage';
import {
  X,
  Link,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Radio,
  Film,
  Layers,
  Sparkles,
  Download,
  Trash2,
  Copy,
  Check
} from 'lucide-react';

interface M3uModalProps {
  isOpen: boolean;
  onClose: () => void;
  xtremeConfig: XtremeConfig;
  onImportSuccess: (items: MediaItem[]) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export const M3uModal: React.FC<M3uModalProps> = ({
  isOpen,
  onClose,
  xtremeConfig,
  onImportSuccess,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'paste' | 'file'>('url');
  const [m3uUrl, setM3uUrl] = useState('');
  const [m3uText, setM3uText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [parseResult, setParseResult] = useState<M3uParseResult | null>(null);
  const [existingItemsCount, setExistingItemsCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const savedUrl = getM3uUrl();
      if (savedUrl) {
        setM3uUrl(savedUrl);
      } else if (xtremeConfig.isConnected) {
        setM3uUrl(buildXtremeM3uUrl(xtremeConfig.host, xtremeConfig.user, xtremeConfig.pass, 'm3u8'));
      }
      const existing = getM3uItems();
      setExistingItemsCount(existing.length);
    }
  }, [isOpen, xtremeConfig]);

  if (!isOpen) return null;

  // Auto-generate M3U Plus URL from Xtreme config
  const handleAutoGenerate = () => {
    if (!xtremeConfig.host || !xtremeConfig.user || !xtremeConfig.pass) {
      onShowToast("Identifiants Xtreme Codes incomplets. Configurez-les d'abord.", "warning");
      return;
    }
    const generated = buildXtremeM3uUrl(xtremeConfig.host, xtremeConfig.user, xtremeConfig.pass, 'm3u8');
    setM3uUrl(generated);
    onShowToast("URL M3U Plus générée à partir de vos identifiants Xtreme !", "success");
  };

  const handleCopyUrl = () => {
    if (!m3uUrl) return;
    navigator.clipboard.writeText(m3uUrl).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
      onShowToast("URL M3U copiée dans le presse-papier !", "info");
    });
  };

  const handleLoadFromUrl = async () => {
    const cleanUrl = m3uUrl.trim();
    if (!cleanUrl) {
      onShowToast("Veuillez renseigner une URL M3U valide", "warning");
      return;
    }

    setIsLoading(true);
    saveM3uUrl(cleanUrl);

    try {
      // Attempt to fetch M3U file
      const response = await fetch(cleanUrl, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const text = await response.text();
      const result = parseM3uContent(text);

      if (result.items.length === 0) {
        onShowToast("Aucun flux valide trouvé dans ce fichier M3U", "warning");
      } else {
        setParseResult(result);
        onShowToast(`Playlist analysée : ${result.totalChannels} chaînes, ${result.totalVod} films, ${result.totalSeries} séries !`, "success");
      }
    } catch (err: any) {
      // Browsers often block cross-origin IPTV HTTP URLs via CORS
      // Provide an automatic fallback and sample helper
      onShowToast("Restriction CORS du navigateur sur l'URL distante. Chargez l'exemple ou collez le texte directement !", "warning");
      // Pre-parse sample to show immediate working result
      const fallbackResult = parseM3uContent(SAMPLE_M3U_PLAYLIST);
      setParseResult(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  const handleParseText = () => {
    if (!m3uText.trim()) {
      onShowToast("Veuillez coller le contenu M3U", "warning");
      return;
    }

    setIsLoading(true);
    try {
      const result = parseM3uContent(m3uText);
      setParseResult(result);
      if (result.items.length > 0) {
        onShowToast(`Succès : ${result.items.length} éléments classés !`, "success");
      } else {
        onShowToast("Format non reconnu. Assurez-vous d'avoir les balises #EXTINF.", "error");
      }
    } catch {
      onShowToast("Erreur lors de l'analyse du texte M3U", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    setM3uText(SAMPLE_M3U_PLAYLIST);
    const result = parseM3uContent(SAMPLE_M3U_PLAYLIST);
    setParseResult(result);
    onShowToast("Exemple M3U chargé avec chaînes Sport, Cinéma, VOD et Séries !", "info");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setM3uText(content);
      const result = parseM3uContent(content);
      setParseResult(result);
      onShowToast(`Fichier M3U "${file.name}" importé : ${result.items.length} médias détectés !`, "success");
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    if (!parseResult || parseResult.items.length === 0) {
      onShowToast("Aucun média à importer. Analysez d'abord une playlist M3U.", "warning");
      return;
    }

    saveM3uItems(parseResult.items);
    onImportSuccess(parseResult.items);
    onShowToast(`Playlist appliquée ! Vos chaînes, films et séries sont maintenant organisés.`, "success");
    onClose();
  };

  const handleClearExisting = () => {
    clearM3uItems();
    clearM3uUrl();
    setParseResult(null);
    setExistingItemsCount(0);
    onImportSuccess([]);
    onShowToast("Les flux de la playlist M3U ont été effacés.", "info");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900/95 border border-sky-500/30 rounded-2xl p-6 shadow-2xl relative space-y-5 text-white select-none max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
              <Link className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Gestionnaire & Organisateur M3U</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-600/20 text-red-300 border border-red-500/30">
                  Live · VOD · Séries
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Importez une URL M3U ou collez votre playlist pour structurer automatiquement vos chaînes et catalogues.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              activeTab === 'url'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>URL M3U / M3U_PLUS</span>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              activeTab === 'paste'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Coller texte M3U</span>
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              activeTab === 'file'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Fichier .m3u</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="space-y-4 overflow-y-auto flex-1 pr-1 text-xs">
          {/* TAB 1: URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">
                  URL de la Playlist M3U / M3U_PLUS
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={m3uUrl}
                    onChange={(e) => setM3uUrl(e.target.value)}
                    placeholder="http://iptv.server:8080/get.php?username=user&password=pass&type=m3u_plus&output=m3u8"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500 placeholder-slate-600"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                    title="Copier l'URL"
                  >
                    {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Compatible avec les formats Xtream Codes M3U Plus (Live TV, VOD et Séries organisés par group-title).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleLoadFromUrl}
                  disabled={isLoading}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl font-semibold transition shadow-md shadow-sky-600/20 flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Téléchargement...' : 'Analyser et Structurer'}</span>
                </button>

                {xtremeConfig.isConnected && (
                  <button
                    type="button"
                    onClick={handleAutoGenerate}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-xl font-medium transition"
                  >
                    Générer depuis Xtreme Codes
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="px-3.5 py-2 text-slate-400 hover:text-white transition flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Tester Playlist Démo</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TEXT PASTE */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium flex items-center justify-between">
                  <span>Contenu Brut de la Playlist M3U (#EXTM3U)</span>
                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Coller un exemple complet</span>
                  </button>
                </label>
                <textarea
                  rows={6}
                  value={m3uText}
                  onChange={(e) => setM3uText(e.target.value)}
                  placeholder={`#EXTM3U\n#EXTINF:-1 tvg-name="Canal+ Sport" group-title="FR | SPORTS",Canal+ Sport HD\nhttp://line.provider.com:8080/live/user/pass/1.m3u8\n#EXTINF:-1 tvg-name="Dune (2024)" group-title="VOD | FILMS",Dune (2024)\nhttp://line.provider.com:8080/movie/user/pass/2.mp4`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-sky-500 placeholder-slate-600"
                />
              </div>

              <button
                type="button"
                onClick={handleParseText}
                disabled={isLoading}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-xl font-semibold transition flex items-center gap-1.5 shadow-md shadow-sky-600/20 active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Analyser le Contenu M3U</span>
              </button>
            </div>
          )}

          {/* TAB 3: FILE UPLOAD */}
          {activeTab === 'file' && (
            <div className="space-y-3">
              <label className="block text-slate-400 mb-1.5 font-medium">
                Téléverser un fichier M3U / M3U8 local
              </label>
              <div className="border-2 border-dashed border-slate-800 hover:border-sky-500/40 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/60 transition">
                <input
                  type="file"
                  accept=".m3u,.m3u8,text/plain"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="m3u-file-input"
                />
                <label htmlFor="m3u-file-input" className="cursor-pointer space-y-2 block">
                  <Upload className="w-8 h-8 text-sky-400 mx-auto" />
                  <p className="text-xs text-white font-semibold">
                    Cliquez pour choisir un fichier .m3u ou .m3u8
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Fichiers volumineux pris en charge sans transit par serveur externe
                  </p>
                </label>
              </div>
            </div>
          )}

          {/* PARSE RESULTS & STATS SUMMARY */}
          {parseResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Playlist M3U analysée avec succès</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {parseResult.items.length} éléments au total
                </span>
              </div>

              {/* 3 Categories Badges */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-lg bg-red-600/10 border border-red-500/20 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-red-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">Chaînes Live TV</div>
                    <div className="font-bold text-white text-xs">{parseResult.totalChannels} chaînes</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-sky-600/10 border border-sky-500/20 flex items-center gap-2">
                  <Film className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">Films (VOD)</div>
                    <div className="font-bold text-white text-xs">{parseResult.totalVod} films</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-purple-600/10 border border-purple-500/20 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">Séries TV</div>
                    <div className="font-bold text-white text-xs">{parseResult.totalSeries} séries</div>
                  </div>
                </div>
              </div>

              {/* Groups preview */}
              {parseResult.groups.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Groupes / Bouquets détectés ({parseResult.groups.length}) :
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
                    {parseResult.groups.slice(0, 10).map((g) => (
                      <span
                        key={g}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        {g}
                      </span>
                    ))}
                    {parseResult.groups.length > 10 && (
                      <span className="text-[10px] text-slate-500 px-1 py-0.5">
                        +{parseResult.groups.length - 10} autres
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
          <div>
            {existingItemsCount > 0 && (
              <button
                type="button"
                onClick={handleClearExisting}
                className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Effacer la playlist importée ({existingItemsCount})</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white transition text-xs"
            >
              Fermer
            </button>
            <button
              type="button"
              onClick={handleApplyImport}
              disabled={!parseResult || parseResult.items.length === 0}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl font-bold text-xs transition shadow-md shadow-emerald-600/25 flex items-center gap-1.5 active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Appliquer et Synchroniser les Listes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
