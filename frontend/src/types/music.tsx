export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre?: string;
  year?: number;
  file_path: string;
  duration: number; // in seconds
  file_size: number; // in bytes
  file_format: string; // 'mp3', 'flac', 'wav', etc.
  album_art?: string;
  play_count?: number;
  last_played?: string; // ISO string
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
  shared: boolean;
  user_id: string;
  coverArt?: string;
}
