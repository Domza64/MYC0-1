import type { Album, Author } from "./data";
import type { Song } from "./Song";

export interface SearchResult {
  matchedSongs: Song[];
  matchedAlbums: Album[];
  matchedAuthors: Author[];
}
