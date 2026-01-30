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
  | { type: "START_PLAYBACK" }
  | { type: "CLEAR_QUEUE" };

const PlayerContext = createContext<{
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
} | null>(null);

const playerReducer = (
  state: PlayerState,
  action: PlayerAction,
): PlayerState => {
  switch (action.type) {
    case "PLAY_SONG":
      const songIndex = state.currentQueue.findIndex(
        (song) => song.id === action.payload.id,
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
    case "START_PLAYBACK":
      if (state.currentQueue.length === 0) {
        return state;
      }

      let index = state.currentIndex;
      if (index >= state.currentQueue.length) index = 0;

      return {
        ...state,
        currentIndex: index,
        currentSong: state.currentQueue[index],
        isPlaying: true,
      };
    case "TOGGLE_SHUFFLE":
      const shuffle = !state.shuffle;
      const currentId = state.currentSong?.id;

      const shuffled = shuffle
        ? [...state.unshuffledQueue].sort((a, b) => {
            if (a.id === currentId) return -1;
            if (b.id === currentId) return 1;
            return Math.random() - 0.5;
          })
        : state.shuffledQueue;

      return {
        ...state,
        shuffle,
        shuffledQueue: shuffled,
        currentIndex: 0,
        currentQueue: shuffle ? shuffled : state.unshuffledQueue,
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
      const nextIndex = state.currentIndex + 1;
      return nextIndex < state.currentQueue.length
        ? {
            ...state,
            currentIndex: nextIndex,
            currentSong: state.currentQueue[nextIndex],
            isPlaying: true,
          }
        : {
            ...state,
            currentSong: state.currentQueue[0],
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
          currentSong: state.currentQueue[prevIndex],
        };
      }

      return state;
    case "RESET_MESSAGE":
      return {
        ...state,
        message: null,
      };
    case "ADD_TO_QUEUE": {
      const incoming = action.payload;

      const newSongs = action.replace
        ? incoming
        : incoming.filter(
            (newSong) =>
              !state.unshuffledQueue.some(
                (existingSong) => existingSong.id === newSong.id,
              ),
          );

      let message: string | null = null;
      if (newSongs.length > 0) {
        message = `${newSongs.length} song(s) added to queue`;
      } else if (!action.replace) {
        message = "Song(s) are already in the queue";
      }

      const unshuffledQueue = action.replace
        ? [...newSongs]
        : [...state.unshuffledQueue, ...newSongs];

      if (state.shuffle) {
        const currentId = state.currentSong?.id;
        newSongs.sort((a, b) => {
          if (a.id === currentId) return -1;
          if (b.id === currentId) return 1;
          return Math.random() - 0.5;
        });
      }

      let shuffledQueue = action.replace
        ? newSongs
        : [...state.shuffledQueue, ...newSongs];

      return {
        ...state,
        unshuffledQueue,
        shuffledQueue,
        currentQueue: state.shuffle ? shuffledQueue : unshuffledQueue,
        message: action.showMessage ? message : null,
      };
    }
    case "CLEAR_QUEUE":
      return {
        ...state,
        currentSong: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        currentQueue: [],
        shuffledQueue: [],
        unshuffledQueue: [],
        currentIndex: 0,
      };
    case "SET_CURRENT_INDEX":
      var newIndex;
      if (action.payload < 0) {
        newIndex = 0;
      } else if (action.payload >= state.currentQueue.length) {
        newIndex = state.currentQueue.length - 1;
      } else {
        newIndex = action.payload;
      }
      return {
        ...state,
        currentIndex: newIndex,
        currentSong: state.currentQueue[newIndex],
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
  unshuffledQueue: [],
  shuffledQueue: [],
  currentQueue: [],
};

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState, (init) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        // Convert stored plain objects back to Song instances
        const shuffledQueue =
          parsed.shuffledQueue?.map((songData: any) => new Song(songData)) ||
          [];
        const unshuffledQueue =
          parsed.unshuffledQueue?.map((songData: any) => new Song(songData)) ||
          [];
        const shuffle = parsed.shuffle;
        const currentSong = parsed.currentSong
          ? new Song(parsed.currentSong)
          : null;

        return {
          ...init,
          ...parsed,
          shuffledQueue,
          unshuffledQueue,
          currentQueue: shuffle ? shuffledQueue : unshuffledQueue,
          shuffle,
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
        shuffledQueue: state.shuffledQueue.map((song) =>
          song.toJSON ? song.toJSON() : song,
        ),
        unshuffledQueue: state.unshuffledQueue.map((song) =>
          song.toJSON ? song.toJSON() : song,
        ),
        currentSong: state.currentSong?.toJSON
          ? state.currentSong.toJSON()
          : state.currentSong,
        isPlaying: false,
        currentTime: 0,
        message: null,
        shuffle: state.shuffle,
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

  // TODO: Idealy this exported state should only have currentQueue, and shouldn't have
  // shuffledQueue and unshuffledQueue to avoid confusion since they are and should only be used internally.
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
