import React, { useState, useEffect, useCallback } from 'react';
import { MediaItem, ToastNotification, XtremeConfig, SupabaseConfig } from './types';
import {
  INITIAL_SUPABASE_ITEMS,
  INITIAL_XTREME_ITEMS,
  getXtremeConfig,
  saveXtremeConfig as persistXcConfig,
  clearXtremeConfig as removeXcConfig,
  getSupabaseConfig,
  saveSupabaseConfig as persistSbConfig,
  getCustomMedia,
  saveCustomMediaItem,
  deleteCustomMediaItem,
} from './services/storage';
import { Sidebar, TabId } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { IptvSection } from './components/IptvSection';
import { UnifiedContent } from './components/UnifiedContent';
import { XtremeConfigView } from './components/XtremeConfig';
import { SupabaseConfigView } from './components/SupabaseConfig';
import { NetflixMode } from './components/NetflixMode';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AddMediaModal } from './components/AddMediaModal';
import { ToastContainer } from './components/ToastContainer';
import { AmbientBackground, BackgroundTheme } from './components/AmbientBackground';
import { BackendDrawer } from './components/BackendDrawer';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isNetflixMode, setIsNetflixMode] = useState<boolean>(false);
  const [xcConfig, setXcConfig] = useState<XtremeConfig>(getXtremeConfig());
  const [sbConfig, setSbConfig] = useState<SupabaseConfig>(getSupabaseConfig());
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBackendDrawerOpen, setIsBackendDrawerOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>(() => {
    return (localStorage.getItem('streamvault_bg_theme') as BackgroundTheme) || 'ambient-grid';
  });

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectBackgroundTheme = (theme: BackgroundTheme) => {
    setBackgroundTheme(theme);
    localStorage.setItem('streamvault_bg_theme', theme);
    const names: Record<BackgroundTheme, string> = {
      'ambient-grid': 'Grille Studio & Aura',
      'cinema-mesh': 'Cinéma Atmosphérique',
      'studio-dots': 'Matrice de Points',
      'obsidian-clean': 'Obsidienne Épurée',
    };
    showToast(`Arrière-plan configuré : ${names[theme]}`, 'info');
  };

  const loadMedia = useCallback(() => {
    const config = getXtremeConfig();
    const custom = getCustomMedia();

    let items: MediaItem[] = [...custom, ...INITIAL_SUPABASE_ITEMS];

    if (config.isConnected) {
      items = [...items, ...INITIAL_XTREME_ITEMS];
    }

    setMediaItems(items);
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const handleRefreshFlux = () => {
    setIsRefreshing(true);
    showToast("Synchronisation des flux Supabase et Xtreme Codes...", "info");

    setTimeout(() => {
      loadMedia();
      setIsRefreshing(false);
      showToast("Catalogue et flux IPTV actualisés avec succès !", "success");
    }, 600);
  };

  const handleSaveXtreme = (newConfig: { host: string; user: string; pass: string }) => {
    persistXcConfig(newConfig);
    const updated = getXtremeConfig();
    setXcConfig(updated);
    loadMedia();
  };

  const handleClearXtreme = () => {
    removeXcConfig();
    setXcConfig(getXtremeConfig());
    loadMedia();
  };

  const handleSaveSupabase = (newConfig: { url: string; anonKey: string }) => {
    persistSbConfig(newConfig);
    setSbConfig(getSupabaseConfig());
  };

  const handleAddMedia = (item: MediaItem) => {
    saveCustomMediaItem(item);
    loadMedia();
    showToast(`Média "${item.title}" ajouté au catalogue !`, "success");
  };

  const handleDeleteMedia = (id: string) => {
    deleteCustomMediaItem(id);
    loadMedia();
    showToast("Média retiré du catalogue.", "info");
  };

  const handleLoadDemoIptv = () => {
    handleSaveXtreme({
      host: 'http://line.streamvault-demo.net:8080',
      user: 'demo_user_vault',
      pass: 'vault2025secure',
    });
    showToast("Flux IPTV Xtreme de démonstration activés !", "success");
  };

  // If user enters Netflix Mode
  if (isNetflixMode) {
    return (
      <div className="h-full w-full bg-[#0b0f19] overflow-hidden select-none relative">
        <AmbientBackground theme="cinema-mesh" />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <NetflixMode
          mediaItems={mediaItems}
          onBackToDashboard={() => setIsNetflixMode(false)}
          onPlayMedia={(item) => setSelectedMedia(item)}
        />
        <VideoPlayerModal media={selectedMedia} onClose={() => setSelectedMedia(null)} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#070a13] text-[#f8fafc] relative">
      {/* Structured Ambient Background System */}
      <AmbientBackground theme={backgroundTheme} />

      {/* Toast Container matching original DOM */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Desktop Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'unified-content' || tab === 'iptv-section') {
            loadMedia();
          }
        }}
        onOpenNetflix={() => setIsNetflixMode(true)}
        isXcConfigured={xcConfig.isConnected}
      />

      {/* Mobile Drawer Navigation */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in">
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <Sidebar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setIsMobileSidebarOpen(false);
              if (tab === 'unified-content' || tab === 'iptv-section') loadMedia();
            }}
            onOpenNetflix={() => {
              setIsMobileSidebarOpen(false);
              setIsNetflixMode(true);
            }}
            isXcConfigured={xcConfig.isConnected}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            isMobile={true}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Header with Hamburger Trigger */}
        <Header
          activeTab={activeTab}
          isXcConfigured={xcConfig.isConnected}
          onOpenNetflix={() => setIsNetflixMode(true)}
          backgroundTheme={backgroundTheme}
          onSelectBackgroundTheme={handleSelectBackgroundTheme}
          onOpenBackendDrawer={() => setIsBackendDrawerOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Views */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative">
          {activeTab === 'dashboard' && (
            <Dashboard
              isXcConfigured={xcConfig.isConnected}
              totalMediaCount={mediaItems.length}
              mediaItems={mediaItems}
              onNavigate={(tab) => {
                setActiveTab(tab);
                if (tab === 'unified-content' || tab === 'iptv-section') loadMedia();
              }}
              onOpenNetflix={() => setIsNetflixMode(true)}
              onPlayMedia={(item) => setSelectedMedia(item)}
            />
          )}

          {activeTab === 'iptv-section' && (
            <IptvSection
              mediaItems={mediaItems}
              xtremeConfig={xcConfig}
              onPlayMedia={(item) => setSelectedMedia(item)}
              onNavigateToConfig={() => setActiveTab('xtreme-config')}
              onRefresh={handleRefreshFlux}
              isRefreshing={isRefreshing}
              onLoadDemoConfig={handleLoadDemoIptv}
            />
          )}

          {activeTab === 'unified-content' && (
            <UnifiedContent
              mediaItems={mediaItems}
              onRefresh={handleRefreshFlux}
              isRefreshing={isRefreshing}
              onPlayMedia={(item) => setSelectedMedia(item)}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onDeleteCustomMedia={handleDeleteMedia}
            />
          )}

          {activeTab === 'xtreme-config' && (
            <XtremeConfigView
              currentConfig={xcConfig}
              onSave={handleSaveXtreme}
              onClear={handleClearXtreme}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'supabase-config' && (
            <SupabaseConfigView
              currentConfig={sbConfig}
              onSave={handleSaveSupabase}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Backend & Background Hamburger Drawer */}
      <BackendDrawer
        isOpen={isBackendDrawerOpen}
        onClose={() => setIsBackendDrawerOpen(false)}
        backgroundTheme={backgroundTheme}
        onSelectBackgroundTheme={handleSelectBackgroundTheme}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'unified-content' || tab === 'iptv-section') loadMedia();
        }}
        xtremeConfig={xcConfig}
        supabaseConfig={sbConfig}
        onOpenNetflix={() => setIsNetflixMode(true)}
        onRefreshStreams={handleRefreshFlux}
        isRefreshing={isRefreshing}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal media={selectedMedia} onClose={() => setSelectedMedia(null)} />

      {/* Add Media Modal */}
      <AddMediaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMedia}
      />
    </div>
  );
};

export default App;
