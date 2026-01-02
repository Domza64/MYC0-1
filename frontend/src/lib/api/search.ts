import { apiRequest } from "./client";
import { Song } from "../../types/Song";

export const searchApi = {
  /**
   * Perform a full text search for songs (title, album, author).
   * @param {string} query - Search query.
   * @param {number} page - Page number for pagination.
   * @returns {Promise<Song[]>} - List of songs matching the query.
   * @example
   * const songs = await searchApi.getSongs("Song name");
   */
  getSongs: (query: string, page: number = 0): Promise<Song[]> =>
    apiRequest<Song[]>(`/search?query=${query}&page=${page}`, {
      converter: (data) => data.map((songData) => new Song(songData)),
    }),
};
