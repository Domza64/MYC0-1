import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import type { Song } from "../types/music";
import toast from "react-hot-toast";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  queue: Song[];
  currentIndex: number;
  message: string | null;
}

type PlayerAction =
  | { type: "PLAY_SONG"; payload: Song }
  | { type: "SET_PLAYBACK"; payload: boolean }
  | { type: "SET_VOLUME"; payload: number }
  | { type: "SET_CURRENT_TIME"; payload: number }
  | { type: "SET_DURATION"; payload: number }
  | { type: "NEXT_SONG" }
  | { type: "PREVIOUS_SONG" }
  | { type: "ADD_TO_QUEUE"; payload: Song[] }
  | { type: "SET_CURRENT_INDEX"; payload: number }
  | { type: "RESET_STATE" }
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
      return {
        ...state,
        currentSong: action.payload,
        isPlaying: true,
      };
    case "SET_PLAYBACK":
      return {
        ...state,
        isPlaying: action.payload,
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
      return nextIndex < state.queue.length
        ? {
            ...state,
            currentIndex: nextIndex,
            currentSong: state.queue[nextIndex],
          }
        : state;
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
      const newSongs = action.payload.filter(
        (newSong) =>
          !state.queue.some((existingSong) => existingSong.id === newSong.id)
      );
      var message = "No new song(s) added to queue";
      if (newSongs.length > 0) {
        message = `${newSongs.length} song(s) added to queue`;
      }
      return {
        ...state,
        queue: [...state.queue, ...newSongs],
        message: message,
      };
    case "CLEAR_QUEUE":
      return {
        ...state,
        queue: [],
        currentIndex: 0,
      };
    case "RESET_STATE":
      return {
        ...state,
        currentSong: state.queue[0],
        currentIndex: 0,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
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
};

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);

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
