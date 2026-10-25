import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MediaItem } from '../types';
import Hls from 'hls.js';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Gauge,
  Radio,
  Tv,
  Film,
  Layers,
  PictureInPicture2,
  ListVideo,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';

interface IntegratedPlayerProps {
  media: MediaItem | null;
  playlistItems?: MediaItem[];
  onClose: () => void;
  onSelectMedia?: (item: MediaItem) => void;
}

export const IntegratedPlayer: React.FC<IntegratedPlayerProps> = ({
  media,
  playlistItems = [],
  onClose,
  onSelectMedia,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isChannelDrawerOpen, setIsChannelDrawerOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'contain' | 'cover' | 'fill'>('contain');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [currentStreamUrl, setCurrentStreamUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state with selected media
  useEffect(() => {
    if (!media) return;
    setCurrentStreamUrl(media.streamUrl);
    setIsLive(media.category === 'Live');
    setStreamError(null);
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);
  }, [media]);

  // Handle Controls Auto-hide
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 4000);
  };

  // Video and HLS.js streaming lifecycle
  useEffect(() => {
    if (!media || !currentStreamUrl || !videoRef.current) return;

    const video = videoRef.current;
    let hls: Hls | null = null;
    setIsLoading(true);
    setStreamError(null);

    const isHls = currentStreamUrl.includes('.m3u8') || media.category === 'Live';

    if (isHls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(currentStreamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.LEVEL_LOADED, (_event, data) => {
        if (data.details.live) {
          setIsLive(true);
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setStreamError("Erreur réseau / restriction CORS sur ce flux IPTV.");
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setStreamError("Erreur de décodage média.");
              hls?.recoverMediaError();
              break;
            default:
              setStreamError("Flux momentanément indisponible.");
              hls?.destroy();
              break;
          }
          setIsLoading(false);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Apple HLS
      video.src = currentStreamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
      video.addEventListener('error', () => {
        setStreamError("Erreur de lecture du flux natif.");
        setIsLoading(false);
      });
    } else {
      // Direct MP4 / WebM VOD
      video.src = currentStreamUrl;
      video.addEventListener('canplay', () => {
        setIsLoading(false);
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      });
      video.addEventListener('error', () => {
        setStreamError("Erreur de lecture de la source vidéo VOD.");
        setIsLoading(false);
      });
    }

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      if (hls) hls.destroy();
      video.removeAttribute('src');
      video.load();
    };
  }, [currentStreamUrl, media]);

  // Fullscreen change listener
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Android TV Remote & Keyboard Controls in Player
  useEffect(() => {
    if (!media) return;

    const handleTvKeyDown = (e: KeyboardEvent) => {
      // Reveal controls on any remote press
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 4000);

      const key = e.key;

      // Back / Return -> close player
      if (key === 'Escape' || key === 'Back' || key === 'BrowserBack' || e.keyCode === 27 || e.keyCode === 4) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      // Play / Pause
      if (key === ' ' || key === 'MediaPlayPause' || key === 'Play' || key === 'Pause' || key === 'k' || key === 'K') {
        e.preventDefault();
        togglePlay();
        return;
      }

      // Seek / D-Pad Left & Right
      if (key === 'ArrowLeft' || key === 'MediaRewind' || key === 'j') {
        e.preventDefault();
        handleSkip(-10);
        return;
      }
      if (key === 'ArrowRight' || key === 'MediaFastForward' || key === 'l') {
        e.preventDefault();
        handleSkip(10);
        return;
      }

      // Volume / D-Pad Up & Down
      if (key === 'ArrowUp' || key === '+' || key === '=') {
        e.preventDefault();
        if (videoRef.current) {
          const newVol = Math.min(1, Math.round((videoRef.current.volume + 0.1) * 10) / 10);
          setVolume(newVol);
          videoRef.current.volume = newVol;
          videoRef.current.muted = false;
          setIsMuted(false);
        }
        return;
      }
      if (key === 'ArrowDown' || key === '-') {
        e.preventDefault();
        if (videoRef.current) {
          const newVol = Math.max(0, Math.round((videoRef.current.volume - 0.1) * 10) / 10);
          setVolume(newVol);
          videoRef.current.volume = newVol;
          videoRef.current.muted = newVol === 0;
          setIsMuted(newVol === 0);
        }
        return;
      }

      // Channel Zapping / Next & Prev Track
      if (key === 'ChannelUp' || key === 'PageUp' || key === 'MediaTrackNext') {
        e.preventDefault();
        if (playlistItems.length > 0 && onSelectMedia) {
          const currentIndex = playlistItems.findIndex((i) => i.id === media.id);
          const nextIndex = (currentIndex + 1) % playlistItems.length;
          onSelectMedia(playlistItems[nextIndex]);
        }
        return;
      }

      if (key === 'ChannelDown' || key === 'PageDown' || key === 'MediaTrackPrevious') {
        e.preventDefault();
        if (playlistItems.length > 0 && onSelectMedia) {
          const currentIndex = playlistItems.findIndex((i) => i.id === media.id);
          const prevIndex = (currentIndex - 1 + playlistItems.length) % playlistItems.length;
          onSelectMedia(playlistItems[prevIndex]);
        }
        return;
      }

      // Mute toggle
      if (key === 'm' || key === 'M' || key === 'AudioVolumeMute') {
        e.preventDefault();
        toggleMute();
        return;
      }

      // Fullscreen toggle
      if (key === 'f' || key === 'F') {
        e.preventDefault();
        toggleFullscreen();
        return;
      }
    };

    window.addEventListener('keydown', handleTvKeyDown, true);
    return () => window.removeEventListener('keydown', handleTvKeyDown, true);
  }, [media, isPlaying, playlistItems, onSelectMedia, onClose]);

  if (!media) return null;

  // Format time (HH:MM:SS or MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current || isLive || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkip = (seconds: number) => {
    if (!videoRef.current || isLive) return;
    const newTime = Math.max(0, Math.min(duration || 999999, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch {
      // PiP not allowed or failed
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleCopyStreamUrl = () => {
    navigator.clipboard.writeText(currentStreamUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleFallbackStream = () => {
    setCurrentStreamUrl('https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8');
    setStreamError(null);
  };

  const videoObjectFitClass =
    aspectRatio === 'cover' ? 'object-cover' : aspectRatio === 'fill' ? 'object-fill' : 'object-contain';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 select-none animate-in fade-in">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="w-full max-w-6xl h-full max-h-[92vh] bg-slate-950 rounded-2xl overflow-hidden border border-sky-500/30 shadow-2xl flex flex-col relative group"
      >
        {/* TOP BAR / TITLE */}
        <div
          className={`h-16 bg-gradient-to-b from-black/95 via-black/60 to-transparent px-4 sm:px-6 flex items-center justify-between z-30 absolute top-0 left-0 right-0 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                media.type === 'Supabase' ? 'bg-sky-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {media.type}
            </span>

            <div className="max-w-md truncate">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">{media.title}</h3>
              <p className="text-[10px] text-slate-400 truncate">
                {media.genre || media.subCategory || (isLive ? 'Live Stream' : 'Film VOD')}
                {media.quality && ` • ${media.quality}`}
              </p>
            </div>

            {isLive ? (
              <span className="flex items-center gap-1 text-[9px] font-bold text-red-400 bg-red-600/15 border border-red-500/30 px-2 py-0.5 rounded-full ml-1">
                <Radio className="w-2.5 h-2.5 text-red-500 animate-pulse" />
                DIRECT
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[9px] font-semibold text-sky-300 bg-sky-500/15 border border-sky-400/30 px-2 py-0.5 rounded-full ml-1">
                <Film className="w-2.5 h-2.5 text-sky-400" />
                VOD CINEMA
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {playlistItems.length > 0 && onSelectMedia && (
              <button
                onClick={() => setIsChannelDrawerOpen(!isChannelDrawerOpen)}
                className={`p-2 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                  isChannelDrawerOpen
                    ? 'bg-sky-500 text-white border-sky-400'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Liste des chaînes / épisodes"
              >
                <ListVideo className="w-4 h-4" />
                <span className="hidden sm:inline">Zapping & Épisodes ({playlistItems.length})</span>
              </button>
            )}

            <button
              onClick={handleCopyStreamUrl}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
              title="Copier le lien du flux"
            >
              {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 transition"
              aria-label="Fermer le lecteur"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIDEO DISPLAY AREA */}
        <div className="flex-1 w-full bg-black relative flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            className={`w-full h-full ${videoObjectFitClass}`}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
          />

          {/* Loading Indicator */}
          {isLoading && !streamError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 pointer-events-none z-10">
              <RefreshCw className="w-10 h-10 text-sky-400 animate-spin mb-2" />
              <p className="text-xs text-sky-200 font-semibold tracking-wide">
                Initialisation du flux HLS / VOD...
              </p>
            </div>
          )}

          {/* Error Banner */}
          {streamError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center z-20 space-y-3">
              <AlertCircle className="w-12 h-12 text-rose-500" />
              <h4 className="text-sm font-bold text-white">Flux momentanément inaccessible</h4>
              <p className="text-xs text-slate-400 max-w-md">
                {streamError} (Vérifiez le lien IPTV ou la politique CORS de votre fournisseur).
              </p>
              <button
                onClick={handleFallbackStream}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/30 transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Tester flux de secours Mux Live</span>
              </button>
            </div>
          )}

          {/* SIDEBAR ZAPPING / EPISODES DRAWER */}
          {isChannelDrawerOpen && playlistItems.length > 0 && onSelectMedia && (
            <div className="absolute right-0 top-16 bottom-20 w-72 sm:w-80 bg-slate-950/95 border-l border-sky-500/30 z-30 flex flex-col backdrop-blur-xl animate-in slide-in-from-right duration-200">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ListVideo className="w-4 h-4 text-sky-400" />
                  <span>Sélection Rapide</span>
                </span>
                <button
                  onClick={() => setIsChannelDrawerOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
                {playlistItems.map((item) => {
                  const isCurrent = item.id === media.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectMedia(item);
                        setIsChannelDrawerOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 transition ${
                        isCurrent
                          ? 'bg-sky-600/30 border border-sky-400/50 text-white font-semibold'
                          : 'hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <div className="w-10 h-7 rounded overflow-hidden bg-black shrink-0 relative">
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-sky-500/30 flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 truncate">
                        <div className="truncate text-xs">{item.title}</div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {item.subCategory || item.genre}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM CONTROLS BAR (VOD Progress Scrubber & Buttons) */}
        <div
          className={`bg-slate-950/95 border-t border-slate-800/80 px-4 py-3 z-30 transition-opacity duration-300 space-y-2 backdrop-blur-md ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* VOD SEEK PROGRESS SCRUBBER (Only for VOD/Series, or seekable live) */}
          {!isLive && (
            <div className="space-y-1">
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="h-2 w-full bg-slate-800 hover:h-3 rounded-full cursor-pointer relative overflow-hidden transition-all group/progress"
              >
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full relative"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          )}

          {/* MAIN CONTROLS ROW */}
          <div className="flex items-center justify-between text-xs">
            {/* Left Controls: Play/Pause, Skip 10s, Volume, Time */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition active:scale-95 shadow-md shadow-sky-600/30"
                title={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              {!isLive && (
                <>
                  <button
                    onClick={() => handleSkip(-10)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition active:scale-95"
                    title="Reculer de 10 secondes"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSkip(10)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition active:scale-95"
                    title="Avancer de 10 secondes"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Volume Slider & Toggle */}
              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
                  title={isMuted ? 'Rétablir le son' : 'Couper le son'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>

              {/* Time Display */}
              <div className="font-mono text-[11px] text-slate-400 hidden sm:block">
                {isLive ? (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    DIRECT
                  </span>
                ) : (
                  <span>
                    <strong className="text-white">{formatTime(currentTime)}</strong> / {formatTime(duration)}
                  </span>
                )}
              </div>
            </div>

            {/* Right Controls: Playback Speed, Aspect Ratio, PiP, Fullscreen */}
            <div className="flex items-center gap-2">
              {/* Speed Selector (for VOD) */}
              {!isLive && (
                <div className="relative group/speed hidden sm:block">
                  <button
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono hover:text-white flex items-center gap-1 transition"
                    title="Vitesse de lecture"
                  >
                    <Gauge className="w-3.5 h-3.5 text-sky-400" />
                    <span>{playbackSpeed}x</span>
                  </button>
                  <div className="absolute bottom-full right-0 mb-1 hidden group-hover/speed:flex flex-col bg-slate-900 border border-slate-800 rounded-lg p-1 shadow-xl z-40 text-[11px]">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpeedChange(s)}
                        className={`px-3 py-1 rounded text-left hover:bg-slate-800 transition ${
                          playbackSpeed === s ? 'text-sky-400 font-bold' : 'text-slate-300'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Aspect Ratio Toggle */}
              <button
                onClick={() => {
                  const next = aspectRatio === 'contain' ? 'cover' : aspectRatio === 'cover' ? 'fill' : 'contain';
                  setAspectRatio(next);
                }}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[10px] font-mono transition uppercase hidden md:inline"
                title="Format d'affichage de l'image"
              >
                {aspectRatio}
              </button>

              {/* Picture-in-Picture */}
              <button
                onClick={togglePictureInPicture}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
                title="Mini-lecteur flottant (Picture-in-Picture)"
              >
                <PictureInPicture2 className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
                title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
