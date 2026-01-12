import { Song } from "../../types/Song";
import { apiRequest } from "./client";

export const songsApi = {
  /**
   * Fetch songs by author ID.
   *
   * @param {number} authorId - The unique ID of the author whose albums to retrieve.
   * @returns {Promise<Song[]>} A promise that resolves to an array of album objects.
   *
   * @example
   * const songs = await songsApi.getByAuthor(3);
   */
  getByAuthor: (authorId: number): Promise<Song[]> =>
    apiRequest<Song[]>("/authors/" + authorId + "/songs", {
      converter: (data) => data.map((songData) => new Song(songData)),
    }),
};
