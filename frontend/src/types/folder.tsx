import type { Song } from "./music";

export interface Folder {
  id: number;
  name: string;
  path: string;
  parent_id: string;
  parent: Folder;
  children: Folder[];
  songs: Song[];
}
