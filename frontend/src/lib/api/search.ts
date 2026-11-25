import { apiRequest } from "./client";
import { Song } from "../../types/Song";
import type { SearchResult } from "../../types/search";

export const searchApi = {
  /**
   * Perform a full text search for songs (title, album, author).
   * @param {string} query - Search query.
   * @returns {Promise<SearchResult>} - Search results.
   */
  search: (query: string): Promise<SearchResult> =>
    apiRequest<SearchResult>(`/search?query=${query}`, {
      converter: (data): SearchResult => ({
        matchedSongs: data.matchedSongs.map((songData) => new Song(songData)), // TODO: Update to match new backend response
        matchedAlbums: data.matchedAlbums, // TODO: Display this data
        matchedAuthors: data.matchedAuthors, // TODO: Display this data
      }),
    }),
};
