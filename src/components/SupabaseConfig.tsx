import React, { useState } from 'react';
import { SupabaseConfig } from '../types';
import { Database, CheckCircle2, Shield, Table, Key } from 'lucide-react';

interface SupabaseConfigProps {
  currentConfig: SupabaseConfig;
  onSave: (config: { url: string; anonKey: string }) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export const SupabaseConfigView: React.FC<SupabaseConfigProps> = ({
  currentConfig,
  onSave,
  onShowToast,
}) => {
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      onShowToast("Veuillez renseigner l'URL et la clé anonyme Supabase", "error");
      return;
    }
    onSave({ url: url.trim(), anonKey: anonKey.trim() });
    onShowToast("Configuration Supabase enregistrée !", "success");
  };

  return (
    <div id="tab-supabase-config" className="tab-content space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-5 border border-sky-500/20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Paramètres du Projet Supabase</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Backend Cloud Actif
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">
                URL du Projet Supabase
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">
                Clé Publique Anon (API Key)
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-emerald-600/20 active:scale-[0.98]"
              >
                Mettre à jour la Connexion Supabase
              </button>
            </div>
          </form>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-4 border border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Table className="w-4 h-4 text-emerald-400" />
            <h4>Schéma Supabase Utilisé</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            StreamVault stocke les métadonnées de vos films, séries, profils et historiques dans votre base de données PostgreSQL gérée par Supabase :
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-white font-semibold">
                <span className="text-sky-300 font-mono">streamvault_media</span>
                <span className="text-[10px] text-emerald-400">Public Read</span>
              </div>
              <p className="text-[11px] text-slate-400">
                id, title, category, type, poster_url, stream_url, metadata
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-white font-semibold">
                <span className="text-sky-300 font-mono">user_favorites</span>
                <span className="text-[10px] text-sky-400">RLS Active</span>
              </div>
              <p className="text-[11px] text-slate-400">
                user_id, media_id, progress_seconds, updated_at
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
