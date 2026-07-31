import { apiRequest } from "./client";
import { Song } from "../../types/Song";
import type { SearchResult } from "../../types/search";

export const searchApi = {
  /**
   * Perform a full text search for songs (title, album, author).
   * @param {string} query - Search query.
   * @param {number} page - Page number for pagination.
   * @returns {Promise<SearchResult>} - Search results.
   */
  search: (query: string, page: number = 0): Promise<SearchResult> =>
    apiRequest<SearchResult>(`/search?query=${query}&page=${page}`, {
      converter: (data): SearchResult => ({
        songs: data.songs.map((songData) => new Song(songData)),
        albums: data.albums,
        authors: data.authors,
      }),
    }),
};
