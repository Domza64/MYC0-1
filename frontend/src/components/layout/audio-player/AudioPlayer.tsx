import { useRef, useEffect } from "react";
import { usePlayer } from "../../../contexts/PlayerContext";
import { FaMusic } from "react-icons/fa";
import VolumeControll from "./VolumeControll";
import SongInfo from "./SongInfo";
import PlaybackControlls from "./PlaybackControlls";
import Time from "./Time";
import ProgressBar from "./ProgressBar";

export default function AudioPlayer() {
  const { state, dispatch } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);

  const { currentSong, isPlaying, volume, currentTime, duration } = state;

  // Sync audio element with player state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      dispatch({ type: "SET_DURATION", payload: audio.duration });
    };

    const handleEnded = () => {
      // Auto-play next song if available or reset player state
      if (state.queue.length > state.currentIndex + 1) {
        dispatch({ type: "NEXT_SONG" });
        dispatch({ type: "SET_PLAYBACK", payload: true });
      } else {
        dispatch({ type: "RESET_STATE" });
      }
    };

    const handlePlay = () => {
      dispatch({ type: "SET_PLAYBACK", payload: true });
    };

    const handlePause = () => {
      dispatch({ type: "SET_PLAYBACK", payload: false });
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [dispatch, state.queue, state.currentIndex]);

  // Control audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  // Control volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  if (!currentSong) {
    return (
      <>
        <div className="flex items-center justify-center text-stone-400">
          <FaMusic className="w-4 h-4 mr-2" />
          <p>No song selected</p>
        </div>
      </>
    );
  }

  const skipForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(currentTime + 10, duration);
      audioRef.current.currentTime = newTime;
      dispatch({ type: "SET_CURRENT_TIME", payload: newTime });
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      const newTime = Math.max(currentTime - 10, 0);
      audioRef.current.currentTime = newTime;
      dispatch({ type: "SET_CURRENT_TIME", payload: newTime });
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={
          currentSong ? `/music/${encodeURI(currentSong.file_path)}` : undefined
        }
        preload="metadata"
      />

      <ProgressBar audioRef={audioRef} />

      <div className="flex items-center justify-between">
        <SongInfo />
        <PlaybackControlls
          skipBackward={skipBackward}
          skipForward={skipForward}
        />
        <div className="flex items-center space-x-4 min-w-0 flex-1 justify-end">
          <Time />
          <VolumeControll />
        </div>
      </div>
    </>
  );
}
