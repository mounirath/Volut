import React from 'react';

export type BackgroundTheme = 'ambient-grid' | 'cinema-mesh' | 'studio-dots' | 'obsidian-clean';

interface AmbientBackgroundProps {
  theme?: BackgroundTheme;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ theme = 'ambient-grid' }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Base Deep Tone */}
      <div className="absolute inset-0 bg-[#070a13]" />

      {/* Theme specific ambient layers */}
      {theme === 'ambient-grid' && (
        <>
          {/* Top-Right Sky Light Cone */}
          <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[140px] opacity-70 transform-gpu" />

          {/* Bottom-Left Deep Violet/Cyan Glow */}
          <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px] opacity-60 transform-gpu" />

          {/* Center Stream Ambient Flare */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-sky-400/5 rounded-full blur-[160px] opacity-50 transform-gpu" />

          {/* Structured High-Precision Geometric Grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-80" />

          {/* Soft Vignette Frame for Depth */}
          <div className="absolute inset-0 bg-radial-vignette opacity-70" />
        </>
      )}

      {theme === 'cinema-mesh' && (
        <>
          {/* Deep Cinematic Atmosphere with Netflix Red & Sky Brand Accents */}
          <div className="absolute -top-32 left-1/3 w-[700px] h-[500px] bg-red-600/7 rounded-full blur-[160px] opacity-70 transform-gpu" />
          <div className="absolute top-1/2 right-10 w-[550px] h-[550px] bg-sky-500/9 rounded-full blur-[140px] opacity-60 transform-gpu" />
          <div className="absolute -bottom-20 left-10 w-[600px] h-[400px] bg-indigo-600/6 rounded-full blur-[130px] opacity-50 transform-gpu" />
          <div className="absolute inset-0 bg-radial-vignette opacity-90" />
        </>
      )}

      {theme === 'studio-dots' && (
        <>
          <div className="absolute -top-20 right-1/4 w-[650px] h-[450px] bg-sky-500/8 rounded-full blur-[130px] opacity-60" />
          <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-slate-700/10 rounded-full blur-[110px]" />
          {/* Subtle Studio Dot Matrix */}
          <div className="absolute inset-0 bg-dots-pattern opacity-70" />
          <div className="absolute inset-0 bg-radial-vignette opacity-80" />
        </>
      )}

      {theme === 'obsidian-clean' && (
        <>
          {/* Ultra clean deep obsidian slate with subtle top horizon rim light */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-500/20 to-transparent" />
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-sky-500/5 to-transparent opacity-40" />
          <div className="absolute inset-0 bg-[#080d1a]/60" />
        </>
      )}
    </div>
  );
};
