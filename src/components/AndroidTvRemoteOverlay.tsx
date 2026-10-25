import React, { useState, useEffect } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Circle,
  Undo2,
  Home,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Tv,
  X,
  Minimize2,
  Maximize2,
  Hash,
  Menu,
  Radio,
  Gamepad2,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { simulateTvRemoteKey, findNextFocusable, focusTvElement } from '../services/androidTvRemote';

interface AndroidTvRemoteOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isTvModeActive: boolean;
  onToggleTvMode: () => void;
  onHomePress: () => void;
  onBackPress: () => void;
  onChannelNext?: () => void;
  onChannelPrev?: () => void;
  onDirectChannelNumber?: (channelNum: number) => void;
  onPlayPauseToggle?: () => void;
  onOpenMenu?: () => void;
}

export const AndroidTvRemoteOverlay: React.FC<AndroidTvRemoteOverlayProps> = ({
  isOpen,
  onClose,
  isTvModeActive,
  onToggleTvMode,
  onHomePress,
  onBackPress,
  onChannelNext,
  onChannelPrev,
  onDirectChannelNumber,
  onPlayPauseToggle,
  onOpenMenu,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  const [numberBuffer, setNumberBuffer] = useState<string>('');

  // Flash indicator on simulated key
  const triggerKeyAction = (name: string, action: () => void) => {
    setLastKeyPressed(name);
    action();
    setTimeout(() => {
      setLastKeyPressed((curr) => (curr === name ? null : curr));
    }, 250);
  };

  const handleDpad = (direction: 'up' | 'down' | 'left' | 'right') => {
    triggerKeyAction(direction.toUpperCase(), () => {
      const activeEl = (document.activeElement as HTMLElement) || null;
      const nextEl = findNextFocusable(activeEl, direction);
      if (nextEl) {
        focusTvElement(nextEl);
      } else {
        simulateTvRemoteKey(`Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}`);
      }
    });
  };

  const handleOk = () => {
    triggerKeyAction('OK', () => {
      const activeEl = document.activeElement as HTMLElement;
      if (activeEl && !activeEl.closest('.tv-remote-ignore')) {
        activeEl.click();
      } else {
        simulateTvRemoteKey('Enter');
      }
    });
  };

  const handleDigit = (digit: string) => {
    const updated = numberBuffer + digit;
    setNumberBuffer(updated);
    triggerKeyAction(`NUM_${digit}`, () => {
      if (onDirectChannelNumber) {
        onDirectChannelNumber(parseInt(updated, 10));
      }
    });

    // Auto-clear buffer after 2 seconds of inactivity
    setTimeout(() => {
      setNumberBuffer('');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Simulateur Télécommande Android TV"
      className="tv-remote-ignore fixed bottom-5 right-5 z-50 select-none animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      {/* Minimized Floating Remote Pill */}
      {isMinimized ? (
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/95 border border-sky-500/40 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition active:scale-95"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Télécommande TV</span>
            {isTvModeActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Full Sleek Android TV Controller */
        <div className="w-72 rounded-3xl bg-slate-950/95 border border-sky-500/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-4 flex flex-col gap-3 text-slate-200">
          {/* Remote Top Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
                <Tv className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">Télécommande TV</h4>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-medium">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isTvModeActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                    }`}
                  />
                  <span>{isTvModeActive ? 'Mode D-Pad Actif' : 'Mode Standard'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
                title="Aide & Raccourcis"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
                title="Réduire"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition"
                title="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick TV Mode Switch Banner */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[11px] font-semibold text-slate-300">Surbrillance 10ft TV</span>
            </div>
            <button
              onClick={onToggleTvMode}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                isTvModeActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isTvModeActive ? 'Activé' : 'Désactivé'}
            </button>
          </div>

          {/* Help Drawer if toggled */}
          {showHelp && (
            <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-[11px] space-y-1.5 animate-in fade-in">
              <p className="font-bold text-sky-300">Contrôle Réel Android TV :</p>
              <ul className="text-slate-300 space-y-1 text-[10px] list-disc list-inside">
                <li><strong className="text-white">D-Pad Flèches :</strong> Navigation spatiale</li>
                <li><strong className="text-white">OK / Center :</strong> Valider / Lancer la chaîne</li>
                <li><strong className="text-white">Retour / Back :</strong> Quitter le lecteur ou fermer menu</li>
                <li><strong className="text-white">CH+ / CH- :</strong> Zapper de flux ou de chaîne</li>
                <li><strong className="text-white">Play/Pause :</strong> Contrôle direct de lecture</li>
              </ul>
            </div>
          )}

          {/* Direct Channel Number Display if buffer exists */}
          {numberBuffer && (
            <div className="text-center py-1 px-3 rounded-xl bg-sky-500/20 border border-sky-400/40 text-xs font-mono font-bold text-sky-300 animate-pulse">
              Chaîne : {numberBuffer}
            </div>
          )}

          {/* --- DPAD (CROSS DIRECTIONAL CONTROLS) --- */}
          <div className="relative w-48 h-48 mx-auto my-1 flex items-center justify-center">
            {/* Outer circular bezel */}
            <div className="absolute inset-0 rounded-full bg-slate-900 border-2 border-slate-800 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]" />

            {/* D-Pad Up */}
            <button
              onClick={() => handleDpad('up')}
              className={`absolute top-1 left-1/2 -translate-x-1/2 w-14 h-12 rounded-t-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/90 active:bg-sky-600/30 transition ${
                lastKeyPressed === 'UP' ? 'bg-sky-600 text-white' : ''
              }`}
              title="Haut (Flèche Haut)"
            >
              <ArrowUp className="w-5 h-5" />
            </button>

            {/* D-Pad Down */}
            <button
              onClick={() => handleDpad('down')}
              className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-12 rounded-b-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/90 active:bg-sky-600/30 transition ${
                lastKeyPressed === 'DOWN' ? 'bg-sky-600 text-white' : ''
              }`}
              title="Bas (Flèche Bas)"
            >
              <ArrowDown className="w-5 h-5" />
            </button>

            {/* D-Pad Left */}
            <button
              onClick={() => handleDpad('left')}
              className={`absolute left-1 top-1/2 -translate-y-1/2 w-12 h-14 rounded-l-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/90 active:bg-sky-600/30 transition ${
                lastKeyPressed === 'LEFT' ? 'bg-sky-600 text-white' : ''
              }`}
              title="Gauche (Flèche Gauche)"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* D-Pad Right */}
            <button
              onClick={() => handleDpad('right')}
              className={`absolute right-1 top-1/2 -translate-y-1/2 w-12 h-14 rounded-r-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/90 active:bg-sky-600/30 transition ${
                lastKeyPressed === 'RIGHT' ? 'bg-sky-600 text-white' : ''
              }`}
              title="Droite (Flèche Droite)"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* OK / Center Button */}
            <button
              onClick={handleOk}
              className={`relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-extrabold text-sm shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center justify-center transition active:scale-95 border border-sky-300/40 ${
                lastKeyPressed === 'OK' ? 'scale-90 ring-4 ring-white' : ''
              }`}
              title="Sélectionner / OK (Entrée)"
            >
              OK
            </button>
          </div>

          {/* System Navigation Buttons: Back, Home, Menu */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => triggerKeyAction('BACK', onBackPress)}
              className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition active:scale-95 ${
                lastKeyPressed === 'BACK' ? 'bg-rose-600/40 text-white border-rose-500' : ''
              }`}
              title="Retour / Échap"
            >
              <Undo2 className="w-4 h-4" />
              <span className="text-[10px] font-semibold">Retour</span>
            </button>

            <button
              onClick={() => triggerKeyAction('HOME', onHomePress)}
              className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition active:scale-95 ${
                lastKeyPressed === 'HOME' ? 'bg-sky-600/40 text-white border-sky-500' : ''
              }`}
              title="Accueil / Dashboard"
            >
              <Home className="w-4 h-4" />
              <span className="text-[10px] font-semibold">Accueil</span>
            </button>

            <button
              onClick={() => triggerKeyAction('MENU', () => (onOpenMenu ? onOpenMenu() : simulateTvRemoteKey('m')))}
              className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition active:scale-95"
              title="Menu Options / Backend"
            >
              <Menu className="w-4 h-4" />
              <span className="text-[10px] font-semibold">Menu</span>
            </button>
          </div>

          {/* Channel (CH) and Volume (VOL) Rockers */}
          <div className="grid grid-cols-2 gap-2">
            {/* Channel Rocker */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-extrabold text-slate-400 pl-1 uppercase tracking-wider">CH</span>
              <div className="flex gap-1">
                <button
                  onClick={() => triggerKeyAction('CH_DOWN', () => (onChannelPrev ? onChannelPrev() : simulateTvRemoteKey('PageDown')))}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs transition active:scale-95"
                  title="Chaîne Précédente (-)"
                >
                  -
                </button>
                <button
                  onClick={() => triggerKeyAction('CH_UP', () => (onChannelNext ? onChannelNext() : simulateTvRemoteKey('PageUp')))}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs transition active:scale-95"
                  title="Chaîne Suivante (+)"
                >
                  +
                </button>
              </div>
            </div>

            {/* Volume Rocker */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] font-extrabold text-slate-400 pl-1 uppercase tracking-wider">VOL</span>
              <div className="flex gap-1">
                <button
                  onClick={() => triggerKeyAction('VOL_DOWN', () => simulateTvRemoteKey('-'))}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs transition active:scale-95"
                  title="Volume Moins (-)"
                >
                  -
                </button>
                <button
                  onClick={() => triggerKeyAction('VOL_UP', () => simulateTvRemoteKey('+'))}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-bold text-xs transition active:scale-95"
                  title="Volume Plus (+)"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Media Playback Controls */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <button
              onClick={() => triggerKeyAction('REWIND', () => simulateTvRemoteKey('ArrowLeft'))}
              className="p-2 rounded-lg hover:bg-slate-800 hover:text-white transition active:scale-95"
              title="Reculer 10s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() =>
                triggerKeyAction('PLAY_PAUSE', () => (onPlayPauseToggle ? onPlayPauseToggle() : simulateTvRemoteKey(' ')))
              }
              className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-md shadow-sky-500/30 transition active:scale-95"
              title="Lecture / Pause"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>

            <button
              onClick={() => triggerKeyAction('FAST_FORWARD', () => simulateTvRemoteKey('ArrowRight'))}
              className="p-2 rounded-lg hover:bg-slate-800 hover:text-white transition active:scale-95"
              title="Avancer 10s"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => triggerKeyAction('MUTE', () => simulateTvRemoteKey('m'))}
              className="p-2 rounded-lg hover:bg-slate-800 hover:text-white transition active:scale-95"
              title="Mettre en sourdine (Mute)"
            >
              <VolumeX className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowKeypad(!showKeypad)}
              className={`p-2 rounded-lg transition active:scale-95 ${
                showKeypad ? 'bg-sky-500 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
              title="Pavé numérique des chaînes"
            >
              <Hash className="w-4 h-4" />
            </button>
          </div>

          {/* Optional Numeric Keypad for direct channel jumping (0-9) */}
          {showKeypad && (
            <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 animate-in fade-in">
              <div className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-wider">
                Numéro de chaîne
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    onClick={() => handleDigit(digit)}
                    className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs transition active:scale-95"
                  >
                    {digit}
                  </button>
                ))}
                <button
                  onClick={() => setNumberBuffer('')}
                  className="py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-300 font-bold text-[10px] transition active:scale-95"
                >
                  Effacer
                </button>
                <button
                  onClick={() => handleDigit('0')}
                  className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs transition active:scale-95"
                >
                  0
                </button>
                <button
                  onClick={() => {
                    if (numberBuffer && onDirectChannelNumber) {
                      onDirectChannelNumber(parseInt(numberBuffer, 10));
                    }
                    setShowKeypad(false);
                  }}
                  className="py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] transition active:scale-95"
                >
                  Aller
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
