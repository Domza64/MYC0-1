import type { Album } from "../../types/data";
import { Song } from "../../types/Song";
import { apiRequest } from "./client";

export const albumsApi = {
  /**
   * Fetch all albums.
   * @returns {Promise<Album[]>} - Array of albums.
   * @example
   * const albums = await albumsApi.getAll();
   */
  getAll: (): Promise<Album[]> => apiRequest<Album[]>("/albums"),

  /**
   * Fetch albums by author ID.
   *
   * @param {number} authorId - The unique ID of the author whose albums to retrieve.
   * @returns {Promise<Album[]>} A promise that resolves to an array of album objects.
   *
   * @example
   * const albums = await albumsApi.getByAuthor(3);
   */
  getByAuthor: (authorId: number): Promise<Album[]> =>
    apiRequest<Album[]>("/albums?author_id=" + authorId),

  /**
   * Fetch a specific album by its ID.
   *
   * @param {number} id - The unique ID of the album to retrieve.
   * @returns {Promise<Album>} A promise that resolves to the album object.
   *
   * @example
   * const album = await albumsApi.get(5);
   */
  get: (id: number): Promise<Album> => apiRequest<Album>("/albums/" + id),

  /**
   * Fetch songs for a specific album by its ID.
   *
   * @param {number} albumId - The unique ID of the album whose songs to retrieve.
   * @returns {Promise<Song[]>} A promise that resolves to an array of song objects.
   *
   * @example
   * const songs = await albumsApi.getSongs(5);
   */
  getSongs: (albumId: number): Promise<Song[]> =>
    apiRequest<Song[]>("/albums/" + albumId + "/songs", {
      converter: (data) => data.map((songData) => new Song(songData)),
    }),
};
