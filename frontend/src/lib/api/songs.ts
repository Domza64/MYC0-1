import type { Folder } from "../../types/data";
import { Song } from "../../types/Song";
import { apiRequest } from "./client";

export const songsApi = {
  /**
   * Fetch all songs.
   * @param {number} offset - The offset to start at.
   * @param {number} limit - The maximum number of songs to return.
   * @returns {Promise<Song[]>} - A promise that resolves to an array of song objects.
   * @example
   * const songs = await songsApi.getSongs(0, 10);
   */
  getSongs: (offset: number, limit: number): Promise<Song[]> =>
    apiRequest<Song[]>(`/songs?offset=${offset}&limit=${limit}`, {
      converter: (data) => data.map((songData) => new Song(songData)),
    }),

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

  /**
   * Fetch all folders, or if a currentFolderId is provided, fetch all subfolders of that folder.
   *
   * @param {number} [currentFolderId] - The unique ID of the folder whose subfolders to retrieve.
   * @returns {Promise<Folder[]>} - A promise that resolves to an array of folder objects.
   * @example
   * const folders = await songsApi.getFolders();
   * const subfolders = await songsApi.getFolders(3);
   */
  getFolders: (currentFolderId?: number): Promise<Folder[]> =>
    apiRequest<Folder[]>(
      "/folders" + (currentFolderId ? `/${currentFolderId}` : "/")
    ),

  /**
   * Fetch songs by folder ID.
   *
   * @param {number} folderId - The unique ID of the folder whose songs to retrieve.
   * @returns {Promise<Song[]>} A promise that resolves to an array of song objects.
   *
   * @example
   * const songs = await songsApi.getByFolder(1);
   */
  getByFolder: (folderId: number): Promise<Song[]> =>
    apiRequest<Song[]>(`/songs/folder/${folderId}`, {
      converter: (data) => data.map((songData) => new Song(songData)),
    }),
};
