import type { Song } from "./Song";

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  currentIndex: number;
  message: string | null;
  shuffle: boolean;
  repeat: boolean;
  unsuhffledQueue: Song[];
  queue: Song[];
}
