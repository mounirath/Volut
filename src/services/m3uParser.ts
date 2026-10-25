import { MediaItem } from '../types';

export interface M3uParseResult {
  items: MediaItem[];
  totalChannels: number;
  totalVod: number;
  totalSeries: number;
  groups: string[];
}

/**
 * Parses M3U or M3U_PLUS playlist text into structured MediaItem list
 * categorizing into Live TV, Films (VOD), and Séries based on group-title,
 * URL structure (/live/, /movie/, /series/), and title heuristics.
 */
export function parseM3uContent(content: string): M3uParseResult {
  const lines = content.split(/\r?\n/);
  const items: MediaItem[] = [];
  const groupsSet = new Set<string>();

  let currentTitle = '';
  let currentGroup = '';
  let currentLogo = '';
  let currentTvgName = '';
  let currentChannelNum = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      // Parse attributes like tvg-logo, tvg-name, group-title
      const groupMatch = line.match(/group-title="([^"]*)"/i);
      currentGroup = groupMatch ? groupMatch[1].trim() : 'Général';

      const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
      currentLogo = logoMatch ? logoMatch[1].trim() : '';

      const tvgNameMatch = line.match(/tvg-name="([^"]*)"/i);
      currentTvgName = tvgNameMatch ? tvgNameMatch[1].trim() : '';

      const tvgChnoMatch = line.match(/tvg-chno="([^"]*)"/i);
      currentChannelNum = tvgChnoMatch ? parseInt(tvgChnoMatch[1], 10) : 0;

      // Extract title after last comma
      const lastCommaIndex = line.lastIndexOf(',');
      if (lastCommaIndex !== -1) {
        currentTitle = line.substring(lastCommaIndex + 1).trim();
      } else {
        currentTitle = currentTvgName || 'Flux Sans Titre';
      }

      if (currentGroup) {
        groupsSet.add(currentGroup);
      }
    } else if (!line.startsWith('#') && (line.startsWith('http://') || line.startsWith('https://') || line.startsWith('rtmp://'))) {
      const streamUrl = line;
      const title = currentTitle || currentTvgName || `Flux ${items.length + 1}`;
      const groupLower = currentGroup.toLowerCase();
      const urlLower = streamUrl.toLowerCase();
      const titleLower = title.toLowerCase();

      // Intelligent classification: Live vs VOD (Film) vs Series
      let category: 'Live' | 'VOD' | 'Series' = 'Live';

      if (
        urlLower.includes('/series/') ||
        groupLower.includes('serie') ||
        groupLower.includes('season') ||
        /s\d+\s*e\d+/i.test(titleLower) ||
        /saison\s*\d+/i.test(titleLower)
      ) {
        category = 'Series';
      } else if (
        urlLower.includes('/movie/') ||
        groupLower.includes('vod') ||
        groupLower.includes('film') ||
        groupLower.includes('movie') ||
        groupLower.includes('cinema') ||
        /\(\d{4}\)/.test(title)
      ) {
        category = 'VOD';
      } else {
        category = 'Live';
      }

      // Quality detection
      let quality: '4K UHD' | 'FHD 1080p' | 'HD 720p' = 'FHD 1080p';
      if (titleLower.includes('4k') || titleLower.includes('uhd')) {
        quality = '4K UHD';
      } else if (titleLower.includes('720') || titleLower.includes('hd')) {
        quality = 'HD 720p';
      }

      // Default poster if none in M3U
      const fallbackPoster =
        category === 'Live'
          ? 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop'
          : category === 'VOD'
          ? 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop'
          : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop';

      const mediaItem: MediaItem = {
        id: `m3u-${Date.now()}-${items.length}-${Math.random().toString(36).substring(2, 6)}`,
        title,
        type: 'Xtreme Codes',
        category,
        subCategory: currentGroup || (category === 'Live' ? 'Chaînes Direct' : category === 'VOD' ? 'Films' : 'Séries'),
        quality,
        channelNumber: currentChannelNum || (category === 'Live' ? items.length + 1 : undefined),
        poster: currentLogo && currentLogo.startsWith('http') ? currentLogo : fallbackPoster,
        backdrop: fallbackPoster,
        streamUrl,
        description: `Flux importé depuis la playlist M3U dans la catégorie ${currentGroup || category}.`,
        genre: currentGroup || category,
        rating: category === 'Live' ? 'Direct' : '8.6',
        year: category === 'Live' ? 'En Direct' : '2024',
        duration: category === 'Live' ? 'Direct TV' : category === 'VOD' ? '2h 00m' : 'Saison Complète',
        streamFormat: streamUrl.includes('.m3u8') ? 'hls' : streamUrl.includes('.mp4') ? 'mp4' : 'ts',
      };

      items.push(mediaItem);

      // Reset item metadata for next entry
      currentTitle = '';
      currentGroup = '';
      currentLogo = '';
      currentTvgName = '';
      currentChannelNum = 0;
    }
  }

  const totalChannels = items.filter((i) => i.category === 'Live').length;
  const totalVod = items.filter((i) => i.category === 'VOD').length;
  const totalSeries = items.filter((i) => i.category === 'Series').length;

  return {
    items,
    totalChannels,
    totalVod,
    totalSeries,
    groups: Array.from(groupsSet),
  };
}

/**
 * Generates official Xtreme Codes M3U download URL from credentials
 */
export function buildXtremeM3uUrl(host: string, user: string, pass: string, format: 'm3u8' | 'ts' = 'm3u8'): string {
  if (!host || !user || !pass) return '';
  const cleanHost = host.replace(/\/+$/, '');
  return `${cleanHost}/get.php?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&type=m3u_plus&output=${format}`;
}

/**
 * Built-in high-quality sample M3U playlist with French and International
 * Live TV, Movies, and Series for immediate testing
 */
export const SAMPLE_M3U_PLAYLIST = `#EXTM3U
#EXTINF:-1 tvg-id="CANAL_SPORT" tvg-name="Canal+ Sport HD" tvg-logo="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop" group-title="FR | SPORT LIVE",Canal+ Sport HD
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
#EXTINF:-1 tvg-id="BEIN_1" tvg-name="beIN Sports 1 HD" tvg-logo="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop" group-title="FR | SPORT LIVE",beIN Sports 1 HD
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
#EXTINF:-1 tvg-id="CANAL_CINEMA" tvg-name="Canal+ Cinéma 4K" tvg-logo="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600&auto=format&fit=crop" group-title="FR | CINEMA & SERIES",Canal+ Cinéma 4K
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
#EXTINF:-1 tvg-id="BBC_NEWS" tvg-name="BBC World News HD" tvg-logo="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=600&auto=format&fit=crop" group-title="INT | NEWS & INFOS",BBC World News HD
https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8
#EXTINF:-1 tvg-id="NAT_GEO" tvg-name="National Geographic 4K" tvg-logo="https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=600&auto=format&fit=crop" group-title="DOCS | DECOUVERTE",National Geographic 4K
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4
#EXTINF:-1 tvg-id="" tvg-name="Oppenheimer (2023)" tvg-logo="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop" group-title="VOD | FILMS 4K ACTION",Oppenheimer 4K UHD (2023)
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
#EXTINF:-1 tvg-id="" tvg-name="Dune Deuxieme Partie (2024)" tvg-logo="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop" group-title="VOD | FILMS SCI-FI",Dune : Deuxième Partie (2024)
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
#EXTINF:-1 tvg-id="" tvg-name="Gladiator II (2024)" tvg-logo="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop" group-title="VOD | FILMS 4K ACTION",Gladiator II (2024)
https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8
#EXTINF:-1 tvg-id="" tvg-name="House of the Dragon S02" tvg-logo="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop" group-title="SERIES | FANTASY & DRAME",House of the Dragon S02 E01
https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
#EXTINF:-1 tvg-id="" tvg-name="Cyberpunk Edgerunners S01" tvg-logo="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop" group-title="SERIES | ANIME & CYBERPUNK",Cyberpunk Edgerunners S01 E01
https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8
`;
