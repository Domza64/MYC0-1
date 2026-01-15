import React, { createContext, useContext, useEffect, useReducer } from "react";
import toast from "react-hot-toast";
import type { PlayerState } from "../types/player";
import { Song } from "../types/Song";

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
        return {
          ...state,
          currentSong: action.payload,
          isPlaying: true,
        };
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
      // Is this the most efficient way to do this?
      let new_queue = state.queue;
      let unsuhffledQueue = state.unsuhffledQueue;
      if (!state.shuffle) {
        unsuhffledQueue = state.queue;
        new_queue = [...state.queue];
        // At some point in future, give sort priority to some songs. eg. songs with least plays.
        new_queue.sort(function (_, __) {
          return Math.random() - 0.5;
        });
      } else {
        new_queue = unsuhffledQueue;
        unsuhffledQueue = [];
      }
      return {
        ...state,
        queue: new_queue,
        unsuhffledQueue,
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
      if (state.currentTime > 4) {
        return {
          ...state,
          currentTime: 0,
        };
      }

      const prevIndex = state.currentIndex - 1;
      if (prevIndex >= 0) {
        return {
          ...state,
          currentIndex: prevIndex,
          currentSong: state.queue[prevIndex],
        };
      }

      return state;
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
        currentSong: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
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
  volume: 1.0,
  currentTime: 0,
  duration: 0,
  currentIndex: 0,
  message: null,
  shuffle: false,
  repeat: false,
  unsuhffledQueue: [],
  queue: [],
};

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState, (init) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        // Convert stored plain objects back to Song instances
        const queue =
          parsed.queue?.map((songData: any) => new Song(songData)) || [];
        const currentSong = parsed.currentSong
          ? new Song(parsed.currentSong)
          : null;

        return {
          ...init,
          ...parsed,
          queue,
          currentSong,
          isPlaying: false,
          currentTime: 0,
        };
      }
      return init;
    } catch {
      return init;
    }
  });

  // Save player state to local storage
  useEffect(() => {
    try {
      const stateToStore = {
        ...state,
        // Convert Song instances to plain objects
        queue: state.queue.map((song) => (song.toJSON ? song.toJSON() : song)),
        currentSong: state.currentSong?.toJSON
          ? state.currentSong.toJSON()
          : state.currentSong,
        isPlaying: false,
        currentTime: 0,
        message: null,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
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
