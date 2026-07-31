import type { Album, Author } from "./data";
import type { Song } from "./Song";

export interface SearchResult {
  songs: Song[];
  albums: Album[];
  authors: Author[];
}
