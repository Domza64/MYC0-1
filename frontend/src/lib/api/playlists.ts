import toast from "react-hot-toast";
import type { Playlist } from "../../types/music";
import { apiRequest } from "./client";
import { Song } from "../../types/Song";

export const playlistsApi = {
  /**
   * Fetch all playlists.
   * @returns {Promise<Playlist[]>} - Array of playlists.
   * @example
   * const playlists = await playlistsApi.getAll();
   */
  getAll: (): Promise<Playlist[]> => apiRequest<Playlist[]>("/playlists"),

  /**
   * Fetch a single playlist by ID.
   * @param {number} id - Playlist ID.
   * @returns {Promise<Playlist>} - Playlist object.
   * @example
   * const playlist = await playlistsApi.get(1);
   */
  get: (id: number): Promise<Playlist> =>
    apiRequest<Playlist>(`/playlists/${id}`),

  /**
   * Fetch all songs in a playlist.
   * @param {number} id - Playlist ID.
   * @returns {Promise<Song[]>} - Array of songs in the playlist.
   * @example
   * const songs = await playlistsApi.getSongs(1);
   */
  getSongs: (id: number): Promise<Song[]> =>
    apiRequest<Song[]>(`/playlists/songs/${id}`, {
      converter: (data) => data.map((songData) => new Song(songData)),
    }),

  /**
   * Create a new playlist.
   * @param {{ name: string; description?: string; shared: boolean }} data - Playlist info.
   * @returns {Promise<Playlist>} - The created playlist.
   * @example
   * const newPlaylist = await playlistsApi.create({ name: "Chill Hits", shared: true });
   */
  create: (data: {
    name: string;
    description?: string;
    shared: boolean;
  }): Promise<Playlist> =>
    apiRequest<Playlist>("/playlists", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /**
   * Add songs to a playlist.
   * Shows a success toast with the number of songs added, or an error toast if songs already exist.
   * @param {number} playlistId - The playlist ID.
   * @param {number[]} songIds - Array of song IDs to add.
   * @returns {Promise<{ added_count: number }>} - Number of songs successfully added.
   * @example
   * const result = await playlistsApi.addSongs(1, [101, 102]);
   * console.log(result.added_count);
   */
  addSongs: (
    playlistId: number,
    songIds: number[]
  ): Promise<{ added_count: number }> =>
    apiRequest<{ added_count: number }>(`/playlists/songs/${playlistId}`, {
      method: "POST",
      body: JSON.stringify({ song_ids: songIds }),
      onSuccess: (data) => {
        const addedCount = data.added_count;
        if (addedCount > 0) {
          toast.success(`Added ${addedCount} song(s) to playlist`);
        } else {
          toast.error("Song(s) already in playlist");
        }
        return addedCount;
      },
    }),

  /**
   * Remove a song from a playlist.
   * @param {number} playlistId - The playlist ID.
   * @param {number} songId - The song ID to remove.
   * @returns {Promise<void>}
   * @example
   * await playlistsApi.removeSong(1, 101);
   */
  removeSong: (playlistId: number, songId: number): Promise<void> =>
    apiRequest(`/playlists/${playlistId}/${songId}`, {
      method: "DELETE",
    }),
};
