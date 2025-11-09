import React, { createContext, useContext, useEffect, useReducer } from "react";
import type { Song } from "../types/music";
import toast from "react-hot-toast";
import type { PlayerState } from "../types/player";

const STORAGE_KEY = "player_state";

type PlayerAction =
  | { type: "PLAY_SONG"; payload: Song }
  | { type: "SET_PLAYBACK"; payload: boolean }
  | { type: "SET_VOLUME"; payload: number }
  | { type: "SET_CURRENT_TIME"; payload: number }
  | { type: "SET_DURATION"; payload: number }
  | { type: "NEXT_SONG" }
  | { type: "PREVIOUS_SONG" }
  | { type: "TOGGLE_SHUFFLE" }
  | { type: "TOGGLE_REPEAT" }
  | {
      type: "ADD_TO_QUEUE";
      payload: Song[];
      replace?: boolean;
      showMessage?: boolean;
    }
  | { type: "SET_CURRENT_INDEX"; payload: number }
  | { type: "RESET_MESSAGE" }
  | { type: "CLEAR_QUEUE" };

const PlayerContext = createContext<{
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
} | null>(null);

const playerReducer = (
  state: PlayerState,
  action: PlayerAction
): PlayerState => {
  switch (action.type) {
    case "PLAY_SONG":
      const songIndex = state.queue.findIndex(
        (song) => song.id === action.payload.id
      );
      if (songIndex === -1) {
        toast.error("Song not in queue found");
        return state;
      }
      return {
        ...state,
        currentSong: action.payload,
        currentIndex: songIndex,
        isPlaying: true,
      };
    case "SET_PLAYBACK":
      return {
        ...state,
        isPlaying: action.payload,
      };
    case "TOGGLE_SHUFFLE":
      return {
        ...state,
        shuffle: !state.shuffle,
      };
    case "TOGGLE_REPEAT":
      return {
        ...state,
        repeat: !state.repeat,
      };
    case "SET_VOLUME":
      return {
        ...state,
        volume: action.payload,
      };
    case "SET_CURRENT_TIME":
      return {
        ...state,
        currentTime: action.payload,
      };
    case "SET_DURATION":
      return {
        ...state,
        duration: action.payload,
      };
    case "NEXT_SONG":
      if (state.shuffle) {
        const nextIndex = Math.floor(Math.random() * state.queue.length);
        return {
          ...state,
          currentIndex: nextIndex,
          currentSong: state.queue[nextIndex],
          isPlaying: true,
        };
      }

      const nextIndex = state.currentIndex + 1;
      return nextIndex < state.queue.length
        ? {
            ...state,
            currentIndex: nextIndex,
            currentSong: state.queue[nextIndex],
            isPlaying: true,
          }
        : {
            ...state,
            currentSong: state.queue[0],
            currentIndex: 0,
            isPlaying: state.repeat,
            currentTime: 0,
            duration: 0,
          };
    case "PREVIOUS_SONG":
      const prevIndex = state.currentIndex - 1;
      return prevIndex >= 0
        ? {
            ...state,
            currentIndex: prevIndex,
            currentSong: state.queue[prevIndex],
          }
        : state;
    case "RESET_MESSAGE":
      return {
        ...state,
        message: null,
      };
    case "ADD_TO_QUEUE":
      let newSongs: Song[] = [];
      let message: string | null = null;

      if (action.replace) {
        newSongs = action.payload;
        if (newSongs.length > 0) {
          message = `${newSongs.length} song(s) added to queue`;
        }
      } else {
        newSongs = action.payload.filter(
          (newSong) =>
            !state.queue.some((existingSong) => existingSong.id === newSong.id)
        );
        // Display message
        if (newSongs.length > 0) {
          message = `${newSongs.length} song(s) added to queue`;
        } else {
          message = "Song(s) are already in the queue";
        }
        newSongs = [...state.queue, ...newSongs];
      }

      return {
        ...state,
        queue: newSongs,
        message: action.showMessage ? message : null,
      };
    case "CLEAR_QUEUE":
      return {
        ...state,
        queue: [],
        currentIndex: 0,
      };
    case "SET_CURRENT_INDEX":
      var newIndex;
      if (action.payload < 0) {
        newIndex = 0;
      } else if (action.payload >= state.queue.length) {
        newIndex = state.queue.length - 1;
      } else {
        newIndex = action.payload;
      }
      return {
        ...state,
        currentIndex: newIndex,
        currentSong: state.queue[newIndex],
      };
    default:
      return state;
  }
};

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  queue: [],
  currentIndex: 0,
  message: null,
  shuffle: false,
  repeat: false,
};

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState, (init) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...init, ...JSON.parse(stored) } : init;
    } catch {
      return init;
    }
  });

  // Save player state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...state, isPlaying: false, currentTime: 0 })
      );
    } catch (e) {
      console.warn("Failed to save player state:", e);
    }
  }, [state]);

  // Display message eg. "Song added to queue"
  useEffect(() => {
    if (state.message) {
      toast(state.message);
      dispatch({ type: "RESET_MESSAGE" });
    }
  }, [state.message]);

  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
