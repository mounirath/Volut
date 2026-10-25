# StreamVault — Unified Supabase & Xtreme Codes Platform

A modern, high-performance React application uniting Supabase metadata and cloud database storage with Xtreme Codes IPTV streams (Live TV, VOD, and Series).

## Features

- **Dashboard Supabase & System Overview**:
  - Real-time connection status monitoring for Supabase and Xtreme Codes.
  - Dynamic media counter and category distributions (Live TV, VOD movies, Series).
  - Quick access actions for media discovery and configuration.

- **Catalogue Unifié (Supabase + Xtreme Codes)**:
  - Combined media catalog integrating Supabase VOD titles with Xtreme Codes live feeds and movies.
  - Search filtering by keyword, genre, and description.
  - Multi-category filtering: All, Supabase exclusives, Xtreme Codes, Live TV, VOD, and Series.
  - Dynamic stream refresh with simulated or real IPTV synchronization.
  - In-app media addition to register custom streams and VODs.

- **Configuration Xtreme Codes API**:
  - Host server URL, username, and password management.
  - Local persistent storage with one-click test connection diagnostic.
  - Xtream API endpoint reference generator (`player_api.php`).
  - Preconfigured demo credentials for instant live testing.

- **Configuration Supabase Cloud**:
  - Supabase project URL and public anon key configuration.
  - Schema documentation and table structures for metadata persistence.

- **Mode Netflix Cinema**:
  - Immersive cinema experience with hero spotlight banner and backdrop preview.
  - Horizontally scrolling carousels for Trending, Live Channels, Supabase Exclusives, and Blockbuster VODs.
  - Seamless navigation back to the Dashboard.

- **Universal Video Streaming Player**:
  - Integrated HLS.js streaming engine with low-latency support for `.m3u8` playlists and MPEG-TS feeds.
  - Native video fallback for MP4 and Safari HLS streams.
  - Playback controls, fullscreen toggle, volume, and automatic error recovery with demo stream fallback.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Glassmorphism aesthetic (Dark Slate 950 with Sky & Netflix Red accents)
- **Icons**: Lucide React + FontAwesome
- **Streaming**: Hls.js
- **Backend SDK**: @supabase/supabase-js

## Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
