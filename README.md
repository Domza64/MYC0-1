# MYC0-1

**MYC0-1** (_My Collection_) is a self-contained, self-hosted music streaming application designed for personal music libraries. It provides a modern web interface to stream your local music collection from anywhere, with a focus on simplicity, privacy, and ease of deployment.

---

## Overview

MYC0-1 transforms your local music folder into a personal streaming service. The application automatically scans your music collection, indexes metadata, and serves it through a beautiful Progressive Web App (PWA) that works seamlessly across all your devices.

---

## Features

### Music Management

- **Automatic Library Scanning** - Recursively scans your music folder for audio files (MP3, FLAC, WAV, etc.)
- **Metadata Extraction** - Reads ID3 tags and audio metadata including title, artist, album, genre, duration, and bitrate
- **Organized Browsing** - Browse your collection by artist, album, genre, or folder structure
- **Search & Filter** - Find songs quickly with real-time search and filtering

### User Experience

- **Playlist Support** - Create and manage playlists
- **Progressive Web App** - Installable on mobile and desktop with offline capabilities
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **JWT Authentication** - Secure local multi user management
- **Album Art Display** - Shows embedded album artwork when available
- **Metadata Editing** - Edit song information directly through the web interface

### Future AI Features

- **Smart Recommendations** - Discover similar music based on your listening habits
- **Audio Analysis** - ChromaDB-powered embeddings for intelligent music matching
- **Auto Playlists** - Dynamic playlists generated based on mood, tempo, or similarity

---

## Technology Stack

| Component          | Technology                | Purpose                                   |
| ------------------ | ------------------------- | ----------------------------------------- |
| **Backend API**    | FastAPI (Python)          | REST API, authentication, audio streaming |
| **Database**       | SQLite                    | Music metadata and user storage           |
| **Frontend**       | React + Vite + TypeScript | Modern PWA with responsive UI             |
| **Metadata**       | Mutagen                   | Audio file metadata extraction            |
| **Authentication** | JWT + bcrypt              | Secure user login and sessions            |
| **AI Engine**      | ChromaDB                  | Vector embeddings and similarity search   |
| **Deployment**     | Docker + Docker Compose   | Containerized deployment                  |

---

## Getting Started

### Prerequisites

- A folder with your music collection

### Quick Start

1. **Soon...** still in early development

---

## Development

### Project Philosophy

- **Self-Contained** - Single container deployment for simplicity
- **Privacy-First** - Your music stays on your infrastructure
- **Local-Focused** - Optimized for personal music collections

### Roadmap

- **Phase 1**: Core music streaming and library management ✓
- **Phase 2**: Enhanced UX with playlists and metadata editing
- **Phase 3**: AI-powered recommendations and smart features

---

**MYC0-1** - Your music, your control, everywhere.
