import { apiRequest } from "./client";
import { Song } from "../../types/Song";

export const telemetryApi = {
  /**
   * Update backend that a song is being played
   * @param {number} song_id - song_id
   * @example
   * await telemetryApi.playSong(song_id);
   */
  playSong: (song_id: number): Promise<Song[]> =>
    apiRequest<Song[]>(`/telemetry/play-song?song_id=${song_id}`, {
      method: "POST",
      showToastError: false,
    }),
};
