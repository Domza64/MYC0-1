// TODO: Song should be a class and return "Unknown" for null values
export interface Song {
  id: number;
  title: string | null;
  artist: string | null;
  album: string | null;
  genre?: string | null;
  year?: number | null;
  file_path: string;
  file_name: string;
  folder_id?: number | null;
  duration?: number | null; // in seconds
  file_size: number; // in bytes
  file_format: string; // 'mp3', 'flac', 'wav', etc.
  album_art?: string | null;
  play_count?: number;
  last_played?: string | null; // ISO string
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
