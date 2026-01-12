import type { Song } from "./Song";

export interface Folder {
  id: number;
  name: string;
  path: string;
  parent_id: string;
  parent: Folder;
  children: Folder[];
  songs: Song[];
}

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  shared: boolean;
  user_id: string;
  playlist_image?: string;
  username: string;
}

export interface Author {
  id: number;
  name: string;
}

export interface Album {
  id: number;
  title: string;
  author: Author;
  album_art?: string;
}
