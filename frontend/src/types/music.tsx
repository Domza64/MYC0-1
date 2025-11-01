export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre?: string;
  year?: number;
  filePath: string;
  duration: number; // in seconds
  fileSize: number; // in bytes
  fileFormat: string; // 'mp3', 'flac', 'wav', etc.
  albumArt?: string;
  playCount?: number;
  lastPlayed?: string; // ISO string
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  year?: number;
  coverArt?: string;
  songs: Song[];
  songCount: number;
  totalDuration: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
  songCount: number;
  totalDuration: number;
  isPublic: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  coverArt?: string;
}

export interface PlayerState {
  currentSong: Song | null;
  currentPlaylist: Playlist | null;
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  isShuffled: boolean;
  repeatMode: "none" | "one" | "all";
  volume: number; // 0.0 to 1.0
  currentTime: number; // in seconds
  duration: number; // in seconds
  playbackRate: number; // 0.5, 1.0, 1.5, 2.0
}
