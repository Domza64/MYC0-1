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
