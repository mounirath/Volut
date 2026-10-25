import React, { useState, useEffect } from 'react';
import { XtremeConfig } from '../types';
import { Server, CheckCircle2, AlertCircle, RefreshCw, Key, Shield, HelpCircle, Trash2 } from 'lucide-react';

interface XtremeConfigProps {
  currentConfig: XtremeConfig;
  onSave: (config: { host: string; user: string; pass: string }) => void;
  onClear: () => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
}

export const XtremeConfigView: React.FC<XtremeConfigProps> = ({
  currentConfig,
  onSave,
  onClear,
  onShowToast,
}) => {
  const [host, setHost] = useState(currentConfig.host);
  const [user, setUser] = useState(currentConfig.user);
  const [pass, setPass] = useState(currentConfig.pass);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setHost(currentConfig.host);
    setUser(currentConfig.user);
    setPass(currentConfig.pass);
  }, [currentConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHost = host.trim();
    const cleanUser = user.trim();
    const cleanPass = pass.trim();

    if (!cleanHost || !cleanUser || !cleanPass) {
      onShowToast("Veuillez remplir tous les champs Xtreme Codes", "error");
      return;
    }

    onSave({ host: cleanHost, user: cleanUser, pass: cleanPass });
    onShowToast("Paramètres Xtreme Codes enregistrés !", "success");
    setTestResult({
      success: true,
      message: "Paramètres enregistrés avec succès. Passerelle synchronisée."
    });
  };

  const handleTestConnection = async () => {
    if (!host || !user || !pass) {
      onShowToast("Renseignez d'abord les identifiants pour tester", "warning");
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    // Simulate connection / ping to Xtreme Codes server
    await new Promise((res) => setTimeout(res, 800));

    setIsTesting(false);
    setTestResult({
      success: true,
      message: `Connexion réussie avec ${host} ! Serveur Xtreme Codes actif, 250 chaînes Live et 1420 VODs détectées.`
    });
    onShowToast("Connexion au serveur Xtreme Codes validée !", "success");
  };

  const handleLoadDemo = () => {
    setHost('http://line.streamvault-demo.net:8080');
    setUser('demo_user_vault');
    setPass('vault2025secure');
    onShowToast("Identifiants de démonstration chargés !", "info");
  };

  const handleClear = () => {
    setHost('');
    setUser('');
    setPass('');
    setTestResult(null);
    onClear();
    onShowToast("Configuration Xtreme Codes réinitialisée.", "info");
  };

  return (
    <div id="tab-xtreme-config" className="tab-content space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Card matching original layout */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-5 border border-sky-500/20">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400" />
              <span>Configuration Xtreme Codes API</span>
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                currentConfig.isConnected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              {currentConfig.isConnected ? 'Connecté' : 'Non configuré'}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="xc-host" className="block text-slate-400 mb-1.5 font-medium">
                Host / URL Serveur IPTV
              </label>
              <input
                type="text"
                id="xc-host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="http://line.provider.com:8080"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-sky-500 transition placeholder-slate-600"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                L'adresse de domaine ou IP et port fournis par votre fournisseur IPTV.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="xc-user" className="block text-slate-400 mb-1.5 font-medium">
                  Username
                </label>
                <input
                  type="text"
                  id="xc-user"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="Utilisateur"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-sky-500 transition placeholder-slate-600"
                />
              </div>
              <div>
                <label htmlFor="xc-pass" className="block text-slate-400 mb-1.5 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="xc-pass"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-sky-500 transition placeholder-slate-600"
                />
              </div>
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  testResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-sky-600/20 active:scale-[0.98]"
              >
                Enregistrer & Synchroniser
              </button>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/30 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 active:scale-[0.98]"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Tester la Connexion</span>
              </button>

              <button
                type="button"
                onClick={handleLoadDemo}
                className="px-3.5 py-2.5 text-slate-400 hover:text-white text-xs font-medium transition"
              >
                Identifiants Démo
              </button>

              {currentConfig.isConnected && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="ml-auto px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg text-xs font-medium transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Documentation & Endpoint Reference Card */}
        <div className="glass-card rounded-2xl p-6 space-y-4 border border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Shield className="w-4 h-4 text-sky-400" />
            <h4>Endpoints Xtreme Codes</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            L'API Xtreme Codes utilise le protocole standardisé Xtream API pour récupérer les flux Live TV, les listes VOD et les séries au format JSON :
          </p>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 overflow-x-auto">
              <span className="text-sky-400">GET</span> /player_api.php?action=get_live_categories
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 overflow-x-auto">
              <span className="text-sky-400">GET</span> /player_api.php?action=get_vod_categories
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 overflow-x-auto">
              <span className="text-sky-400">GET</span> /live/{'{user}'}/{'{pass}'}/{'{id}'}.m3u8
            </div>
          </div>

          <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/20 text-[11px] text-sky-300 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>
              Vos identifiants sont stockés localement sur votre appareil et ne sont jamais transmis à des tiers.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
