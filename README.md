# MYC0-1

**MYC0-1** (_My Collection_) is a self-contained, self-hosted music streaming application designed for personal music libraries. It provides a modern web interface to stream your local music collection from anywhere, with a focus on simplicity, privacy, and ease of deployment.

---

## Overview

MYC0-1 transforms your local music folder into a personal streaming service. The application scans your music collection, indexes metadata, and serves it through a beautiful Progressive Web App (PWA) that works seamlessly across all your devices.

---

## Features

### Music Management

- **Library Scanning** - Recursively scans your music folder for audio files (MP3, FLAC, WAV, etc.)
- **Metadata Extraction** - Reads ID3 tags and audio metadata including title, artist, album, genre, duration...
- **Organized Browsing** - Browse your collection by artist, album, genre, or folder structure
- **Search & Filter** - Find songs quickly with real-time search and filtering
- **Create playlists** - playlists :)

### Future AI Features

- **Smart Recommendations** - Discover similar music based on your listening habits
- **Audio Analysis** - ChromaDB-powered embeddings for intelligent music matching
- **Auto Playlists** - Dynamic playlists generated based on mood, tempo, or similarity

---

## Getting Started

### Prerequisites

- A folder with your music collection

### Quick Start

> **⚠️ Early Development Notice**
> This app is currently in active development and not yet production ready. Expect frequent breaking changes and do not rely on data persistence between updates. Security has not been thoroughly audited - use behind a firewall and avoid exposing to the internet for now.

1. **Update paths in `docker-compose.yml`:**

   - Set your music folder path
   - Set path to a folder where the app can store it's data

2. **Run:**

```bash
docker-compose up -d
```

3. **Access:** `http://localhost:5000`

---

## Development

### Start dev server

- Install npm dependencies:

  ```bash
  cd frontend
  npm i
  ```

- Start all services:
  ```bash
  docker-compose -f docker-compose.dev.yml up
  ```

**Access the application at: http://localhost:5000**

> **Note:** The application runs behind nginx proxy on port 5000. You may see logs indicating services are running on ports 8000 (backend) and 5173 (frontend) - these are internal container ports and can be ignored. All external access is through port 5000.

### Cleanup if build fails:

```bash
docker compose -f docker-compose.dev.yml down --volumes --remove-orphans
```

### Project Philosophy

- **Self-Contained** - Single container deployment for simplicity
- **Privacy-First** - Your music and all other data stays on your infrastructure
- **Local-Focused** - Optimized for personal music collections

### Roadmap

- **Phase 1**: Core music streaming and library management
- **Phase 2**: Enhanced UX with playlists and metadata editing
- **Phase 3**: AI-powered recommendations and smart features

---

**MYC0-1** - Your music, your control, everywhere.

Made with ❤️ by [Domza64](https://www.domza.xyz).
