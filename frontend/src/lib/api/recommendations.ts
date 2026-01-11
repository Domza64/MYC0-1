import { apiRequest } from "./client";
import { Song } from "../../types/Song";

export const recommendationsApi = {
  /**
   * Returns a list of last played songs
   * @param {number} [limit=10] - Number of songs to return (optional, defaults to 10)
   * @returns {Promise<Song[]>} - List of songs
   * @example
   * const songs = await recommendationsApi.getRecentlyPlayed(10);
   */
  getRecentlyPlayed: (limit: number = 10): Promise<Song[]> =>
    apiRequest<Song[]>(`/recommendations/recently-played?limit=${limit}`, {
      converter: (data) => data.map((songData: any) => new Song(songData)),
    }),
};
