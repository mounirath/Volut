import { MediaItem, XtremeConfig, SupabaseConfig } from '../types';

export const INITIAL_SUPABASE_ITEMS: MediaItem[] = [
  {
    id: 'sb-1',
    title: 'Interstellar 2099 (Supabase VOD)',
    type: 'Supabase',
    category: 'VOD',
    subCategory: 'Science-Fiction',
    quality: '4K UHD',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    description: 'Une odyssée spatiale captivante au-delà du système solaire, synchronisée directement depuis votre cluster Supabase Storage.',
    rating: '9.4',
    year: '2025',
    duration: '2h 45m',
    genre: 'Science-Fiction / Aventure'
  },
  {
    id: 'sb-2',
    title: 'Cyberpunk Awakening (Supabase)',
    type: 'Supabase',
    category: 'Series',
    subCategory: 'Cyberpunk & Sci-Fi',
    quality: '4K UHD',
    seasonsCount: 2,
    episodesCount: 16,
    poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    description: 'Dans les ruines éclairées aux néons de Néo-Tokyo, un hacker découvre les secrets enfouis du réseau mondial.',
    rating: '8.8',
    year: '2024',
    duration: 'Saison 1 (8 épisodes)',
    genre: 'Action / Cyberpunk'
  },
  {
    id: 'sb-3',
    title: 'Cosmic Horizons 4K (Supabase Doc)',
    type: 'Supabase',
    category: 'VOD',
    subCategory: 'Documentaire',
    quality: '4K UHD',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    description: 'Documentaire immersif explorant les mystères des nébuleuses lointaines et des trous noirs supermassifs.',
    rating: '9.1',
    year: '2025',
    duration: '1h 32m',
    genre: 'Documentaire / Espace'
  }
];

export const INITIAL_XTREME_ITEMS: MediaItem[] = [
  // --- LIVE TV CHANNELS ---
  {
    id: 'xc-live-1',
    title: 'Sky Sports Main Event HD',
    type: 'Xtreme Codes',
    category: 'Live',
    subCategory: 'Sport en direct',
    channelNumber: 101,
    quality: 'FHD 1080p',
    epgNow: 'Premier League Live : Man City vs Arsenal',
    epgNext: 'Post-Match Analysis & Highlights',
    poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    description: 'Direct HD : Les plus grands événements sportifs mondiaux retransmis en continu 24h/24 sans coupure.',
    rating: 'Direct',
    year: 'En Direct',
    duration: 'Direct TV',
    genre: 'Sport / Football'
  },
  {
    id: 'xc-live-2',
    title: 'Canal+ Cinéma Premier UHD',
    type: 'Xtreme Codes',
    category: 'Live',
    subCategory: 'Cinéma & Séries',
    channelNumber: 104,
    quality: '4K UHD',
    epgNow: 'Oppenheimer (2023) - Version intégrale',
    epgNext: 'Le Cercle Cinéma - Débat critique',
    poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    description: 'Le meilleur du cinéma en première exclusivité, films récents et avant-premières en streaming UHD.',
    rating: 'Direct',
    year: 'En Direct',
    duration: 'Cinéma Live',
    genre: 'Cinéma / Films'
  },
  {
    id: 'xc-live-3',
    title: 'BBC News 24 HD International',
    type: 'Xtreme Codes',
    category: 'Live',
    subCategory: 'Actualités & Monde',
    channelNumber: 110,
    quality: 'FHD 1080p',
    epgNow: 'Global Business & International Flash',
    epgNext: 'BBC World News America',
    poster: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    description: 'Actualités internationales en continu, reportages exclusifs et analyses économiques mondiales en temps réel.',
    rating: 'Direct',
    year: 'En Direct',
    duration: 'Information',
    genre: 'Actualités / Monde'
  },
  {
    id: 'xc-live-4',
    title: 'beIN Sports 1 Premium HD',
    type: 'Xtreme Codes',
    category: 'Live',
    subCategory: 'Sport en direct',
    channelNumber: 102,
    quality: 'FHD 1080p',
    epgNow: 'UEFA Champions League : Match du Soir',
    epgNext: 'Champions Club - Débrief',
    poster: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    description: 'Grands championnats européens, Liga, Serie A, et compétitions internationales en haute fidélité.',
    rating: 'Direct',
    year: 'En Direct',
    duration: 'Direct TV',
    genre: 'Sport / Football'
  },
  {
    id: 'xc-live-5',
    title: 'National Geographic Wild 4K',
    type: 'Xtreme Codes',
    category: 'Live',
    subCategory: 'Documentaires & Découverte',
    channelNumber: 125,
    quality: '4K UHD',
    epgNow: 'Les Prédateurs Invisibles du Serengeti',
    epgNext: 'Abysses Profondes : Secrets Océaniques',
    poster: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    description: 'Documentaires animaliers et scientifiques spectaculaires capturés en très haute résolution.',
    rating: 'Direct',
    year: 'En Direct',
    duration: 'Documentaire',
    genre: 'Nature / Faune'
  },

  // --- FILMS (VOD) ---
  {
    id: 'xc-vod-1',
    title: 'VOD Action Blockbuster (Xtreme)',
    type: 'Xtreme Codes',
    category: 'VOD',
    subCategory: 'Action & Aventure',
    quality: '4K UHD',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'Film d’action hollywoodien à grand spectacle avec effets spéciaux de pointe et mixage audio Dolby Atmos.',
    rating: '8.4',
    year: '2024',
    duration: '2h 12m',
    genre: 'Action / Thriller'
  },
  {
    id: 'xc-vod-2',
    title: 'Dune : Conquête Stellaire',
    type: 'Xtreme Codes',
    category: 'VOD',
    subCategory: 'Science-Fiction',
    quality: '4K UHD',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    description: 'Les armées de l’Empire s’affrontent sur la planète des sables pour le contrôle de l’énergie galactique.',
    rating: '8.9',
    year: '2024',
    duration: '2h 46m',
    genre: 'Sci-Fi / Épique'
  },
  {
    id: 'xc-vod-3',
    title: 'Shadow Protocol : infiltration Tokyo',
    type: 'Xtreme Codes',
    category: 'VOD',
    subCategory: 'Thriller & Espionnage',
    quality: 'FHD 1080p',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    description: 'Un agent renégat pourchasse un syndicat du cybercrime à travers les gratte-ciels néon de Tokyo.',
    rating: '8.1',
    year: '2025',
    duration: '1h 58m',
    genre: 'Thriller / Espionnage'
  },
  {
    id: 'xc-vod-4',
    title: 'L’Odyssée du Roi Dragon (Animation)',
    type: 'Xtreme Codes',
    category: 'VOD',
    subCategory: 'Animation & Famille',
    quality: 'FHD 1080p',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'Conte fantastique spectaculaire mêlant magie ancestrale, combats mythologiques et paysages somptueux.',
    rating: '8.7',
    year: '2025',
    duration: '1h 45m',
    genre: 'Animation / Aventure'
  },

  // --- SÉRIES TV ---
  {
    id: 'xc-ser-1',
    title: 'Dark Dynasty : Succession Royale',
    type: 'Xtreme Codes',
    category: 'Series',
    subCategory: 'Drame & Pouvoir',
    quality: '4K UHD',
    seasonsCount: 4,
    episodesCount: 38,
    poster: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    description: 'Intrigues machiavéliques et trahisons au sommet d’un conglomérat médiatique international.',
    rating: '9.2',
    year: '2024',
    duration: '4 Saisons (38 ép.)',
    genre: 'Drame / Politique'
  },
  {
    id: 'xc-ser-2',
    title: 'Protocol Zero : Forces Spéciales',
    type: 'Xtreme Codes',
    category: 'Series',
    subCategory: 'Action & Militaire',
    quality: 'FHD 1080p',
    seasonsCount: 2,
    episodesCount: 16,
    poster: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    description: 'Une unité tactique clandestine opère dans l’ombre pour déjouer des attaques bioterroristes coordonnées.',
    rating: '8.6',
    year: '2025',
    duration: '2 Saisons (16 ép.)',
    genre: 'Action / Militaire'
  },
  {
    id: 'xc-ser-3',
    title: 'Chroniques du Néo-Tokyo 2088',
    type: 'Xtreme Codes',
    category: 'Series',
    subCategory: 'Cyberpunk & Sci-Fi',
    quality: '4K UHD',
    seasonsCount: 3,
    episodesCount: 24,
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    description: 'Une inspectrice cyborg enquête sur une intelligence artificielle dissidente capable d’effacer des mémoires humaines.',
    rating: '8.9',
    year: '2025',
    duration: '3 Saisons (24 ép.)',
    genre: 'Cyberpunk / Enquête'
  }
];

export const getXtremeConfig = (): XtremeConfig => {
  const host = localStorage.getItem('streamvault_xc_host') || '';
  return {
    host,
    user: localStorage.getItem('streamvault_xc_user') || '',
    pass: localStorage.getItem('streamvault_xc_pass') || '',
    isConnected: Boolean(host),
    lastSync: localStorage.getItem('streamvault_xc_last_sync') || undefined,
    activeConnections: host ? 1 : 0,
    maxConnections: 3,
    expireDate: host ? '2026-12-31' : undefined,
  };
};

export const saveXtremeConfig = (config: { host: string; user: string; pass: string }) => {
  localStorage.setItem('streamvault_xc_host', config.host);
  localStorage.setItem('streamvault_xc_user', config.user);
  localStorage.setItem('streamvault_xc_pass', config.pass);
  localStorage.setItem('streamvault_xc_last_sync', new Date().toISOString());
};

export const clearXtremeConfig = () => {
  localStorage.removeItem('streamvault_xc_host');
  localStorage.removeItem('streamvault_xc_user');
  localStorage.removeItem('streamvault_xc_pass');
  localStorage.removeItem('streamvault_xc_last_sync');
};

export const getSupabaseConfig = (): SupabaseConfig => {
  return {
    url: localStorage.getItem('streamvault_sb_url') || 'https://mock-streamvault.supabase.co',
    anonKey: localStorage.getItem('streamvault_sb_key') || 'mock-anon-key-streamvault-2025',
    isConnected: true,
  };
};

export const saveSupabaseConfig = (config: { url: string; anonKey: string }) => {
  localStorage.setItem('streamvault_sb_url', config.url);
  localStorage.setItem('streamvault_sb_key', config.anonKey);
};

export const getCustomMedia = (): MediaItem[] => {
  const data = localStorage.getItem('streamvault_custom_media');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveCustomMediaItem = (item: MediaItem) => {
  const existing = getCustomMedia();
  const updated = [item, ...existing.filter(i => i.id !== item.id)];
  localStorage.setItem('streamvault_custom_media', JSON.stringify(updated));
  return updated;
};

export const deleteCustomMediaItem = (id: string) => {
  const existing = getCustomMedia();
  const updated = existing.filter(i => i.id !== id);
  localStorage.setItem('streamvault_custom_media', JSON.stringify(updated));
  return updated;
};
