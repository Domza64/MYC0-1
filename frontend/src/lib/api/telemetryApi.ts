import { apiRequest } from "./client";
import { Song } from "../../types/Song";

export const telemetryApi = {
  /**
   * Update backend that a song is being played
   * @param {number} songId - songId
   * @example
   * await telemetryApi.playSong(songId);
   */
  playSong: (songId: number): Promise<Song[]> =>
    apiRequest<Song[]>(`/telemetry/play-song/${songId}`, {
      method: "POST",
      showToastError: false,
    }),
};
