export type MediaType = 'Supabase' | 'Xtreme Codes';
export type CategoryType = 'Live' | 'VOD' | 'Series';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  category: CategoryType;
  subCategory?: string;
  poster: string;
  backdrop?: string;
  streamUrl: string;
  description?: string;
  rating?: string;
  year?: string;
  duration?: string;
  genre?: string;
  streamFormat?: 'hls' | 'mp4' | 'ts';
  quality?: '4K UHD' | 'FHD 1080p' | 'HD 720p';
  channelNumber?: number;
  epgNow?: string;
  epgNext?: string;
  seasonsCount?: number;
  episodesCount?: number;
  isFavorite?: boolean;
  enabled?: boolean;
  customNote?: string;
}

export interface SavedPlaylist {
  id: string;
  name: string;
  type: 'm3u' | 'xtreme' | 'custom';
  url?: string;
  itemCount: number;
  createdAt: string;
  isActive: boolean;
  items: MediaItem[];
}

export interface XtremeConfig {
  host: string;
  user: string;
  pass: string;
  isConnected: boolean;
  lastSync?: string;
  activeConnections?: number;
  maxConnections?: number;
  expireDate?: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}
