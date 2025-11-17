import type { Song } from "./Song";

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Song[];
  currentIndex: number;
  message: string | null;
  shuffle: boolean;
  repeat: boolean;
  // TODO - Implement shuffle queue so that shuffle doesn't go to random song
  // but actually goes song by song through the randomly generated queue
}
