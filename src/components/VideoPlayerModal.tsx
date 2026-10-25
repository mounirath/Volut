import React, { useEffect, useRef, useState } from 'react';
import { MediaItem } from '../types';
import Hls from 'hls.js';
import { X, Play, Pause, Volume2, VolumeX, Maximize, AlertCircle, RefreshCw, Radio } from 'lucide-react';

interface VideoPlayerModalProps {
  media: MediaItem | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ media, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string>('');

  useEffect(() => {
    if (!media) return;
    setCurrentStreamUrl(media.streamUrl);
    setStreamError(null);
    setIsLoading(true);
  }, [media]);

  useEffect(() => {
    if (!media || !currentStreamUrl || !videoRef.current) return;

    const video = videoRef.current;
    let hls: Hls | null = null;
    setIsLoading(true);
    setStreamError(null);

    const isHlsStream = currentStreamUrl.includes('.m3u8') || media.category === 'Live';

    if (isHlsStream && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(currentStreamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().then(() => setIsPlaying(true)).catch(() => {
          // Autoplay policy might require user click or mute
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setStreamError("Erreur réseau ou restriction CORS sur le flux IPTV.");
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setStreamError("Erreur de décodage du flux multimédia.");
              hls?.recoverMediaError();
              break;
            default:
              setStreamError("Impossible de lire ce flux direct.");
              hls?.destroy();
              break;
          }
          setIsLoading(false);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari HLS support
      video.src = currentStreamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
      video.addEventListener('error', () => {
        setStreamError("Erreur lors de la lecture du flux natif.");
        setIsLoading(false);
      });
    } else {
      // Standard MP4 or direct video
      video.src = currentStreamUrl;
      video.addEventListener('canplay', () => {
        setIsLoading(false);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
      video.addEventListener('error', () => {
        setStreamError("Erreur de lecture de la source vidéo.");
        setIsLoading(false);
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      video.removeAttribute('src');
      video.load();
    };
  }, [currentStreamUrl, media]);

  if (!media) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleFallbackStream = () => {
    // Switch to certified public working test stream
    setCurrentStreamUrl('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
    setStreamError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
      <div
        ref={containerRef}
        className="w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden border border-sky-500/30 shadow-2xl flex flex-col relative group"
      >
        {/* Header Bar */}
        <div className="h-14 bg-gradient-to-b from-black/90 to-transparent px-4 sm:px-6 flex items-center justify-between z-20 absolute top-0 left-0 right-0">
          <div className="flex items-center gap-2.5">
            <span
              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                media.type === 'Supabase' ? 'bg-sky-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {media.type}
            </span>
            <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
              {media.title}
            </span>
            {media.category === 'Live' && (
              <span className="flex items-center gap-1 text-[9px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                <Radio className="w-2.5 h-2.5 text-red-500 animate-pulse" />
                LIVE
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition"
            aria-label="Fermer le lecteur"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Area */}
        <div className="aspect-video w-full bg-black relative flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
          />

          {/* Loading Indicator */}
          {isLoading && !streamError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 pointer-events-none">
              <RefreshCw className="w-10 h-10 text-sky-400 animate-spin mb-2" />
              <p className="text-xs text-sky-200 font-medium">Chargement du flux HLS / VOD...</p>
            </div>
          )}

          {/* Error Banner */}
          {streamError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center z-10 space-y-3">
              <AlertCircle className="w-12 h-12 text-rose-500" />
              <h4 className="text-sm font-bold text-white">Flux momentanément inaccessible</h4>
              <p className="text-xs text-slate-400 max-w-md">
                {streamError} (CORS ou serveur IPTV distant indisponible).
              </p>
              <button
                onClick={handleFallbackStream}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Tester le flux HLS de secours (Mux Live)</span>
              </button>
            </div>
          )}
        </div>

        {/* Controls Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <div className="hidden sm:block text-xs text-slate-400">
              <span className="text-white font-medium">{media.category}</span>
              {media.duration && <span className="ml-2 font-mono">• {media.duration}</span>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-[11px] font-mono text-slate-500 truncate max-w-xs">
              {currentStreamUrl}
            </span>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Plein écran"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
