// src/lib/api/playlists.ts
import toast from "react-hot-toast";
import type { Playlist, Song } from "../../types/music";
import { apiRequest } from "./client";

export const playlistsApi = {
  getAll: () => apiRequest<Playlist[]>("/playlists"),
  get: (id: number) => apiRequest<Playlist>(`/playlists/${id}`),
  getSongs: (id: number) => apiRequest<Song[]>(`/playlists/songs/${id}`),
  create: (data: { name: string; description?: string; shared: boolean }) =>
    apiRequest<Playlist>("/playlists", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  addSongs: (playlistId: number, songIds: number[]) =>
    apiRequest(`/playlists/songs/${playlistId}`, {
      method: "POST",
      body: JSON.stringify({ song_ids: songIds }),
      onSuccess: (data) => {
        const added_count = data.added_count;
        if (added_count > 0) {
          toast.success(`Added ${added_count} song(s) to playlist`);
        } else {
          toast.error("Song already in playlist");
        }
      },
    }),
  removeSong: (playlistId: number, songId: number) =>
    apiRequest(`/playlists/${playlistId}/${songId}`, {
      method: "DELETE",
    }),
};
