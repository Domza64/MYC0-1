import { useRef, useEffect } from "react";
import { usePlayer } from "../../../contexts/PlayerContext";
import { FaMusic } from "react-icons/fa";
import VolumeControll from "./VolumeControlls";
import SongInfo from "./SongInfo";
import PlaybackControlls from "./PlaybackControlls";
import Time from "./Time";
import ProgressBar from "./ProgressBar";
import ShuffleButton from "../../ui/buttons/ShuffleButton";
import RepeatButton from "../../ui/buttons/RepeatButton";
import { telemetryApi } from "../../../lib/api/telemetryApi";

export default function AudioPlayer({ playerOpen }: { playerOpen: boolean }) {
  const { state, dispatch } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);

  const { currentSong, isPlaying, volume, currentTime, duration } = state;

  // Ensure audio resets when the user restarts a song from the beginning
  useEffect(() => {
    if (currentTime == 0) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }
  }, [currentTime]);

  // Telemetry
  useEffect(() => {
    if (!audioRef.current || !state.currentSong) return;

    // Wait 15 seconds before sending telemetry.
    // If song is playing for less than 15 seconds telemetry won't be sent
    const timer = setTimeout(() => {
      telemetryApi.playSong(state.currentSong!.id);
    }, 15000);

    return () => {
      clearTimeout(timer);
    };
  }, [state.currentSong]);

  // Sync audio element with player state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      dispatch({ type: "SET_DURATION", payload: audio.duration });
    };

    const handleEnded = () => {
      dispatch({ type: "NEXT_SONG" });
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

  // Media Session API for Mobile/Desktop notifications
  useEffect(() => {
    if (!currentSong || !("mediaSession" in navigator)) return;

    const mediaSession = navigator.mediaSession;

    // Set metadata for the currently playing song
    mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentSong.author.name,
      album: currentSong.album.title,
      artwork: [
        {
          src: "/images/" + currentSong.image || "/static/album_cover.png",
        },
      ],
    });

    mediaSession.setActionHandler("nexttrack", () => {
      dispatch({ type: "NEXT_SONG" });
    });

    mediaSession.setActionHandler("previoustrack", () => {
      dispatch({ type: "PREVIOUS_SONG" });
    });

    // Update playback state in media session
    mediaSession.playbackState = isPlaying ? "playing" : "paused";

    // Cleanup: remove action handlers when component unmounts or song changes
    return () => {
      mediaSession.setActionHandler("nexttrack", null);
      mediaSession.setActionHandler("previoustrack", null);
    };
  }, [currentSong, isPlaying, dispatch]);

  if (!currentSong) {
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-center text-stone-400"
      >
        <FaMusic className="w-4 h-4 mr-2" />
        <p>No song selected</p>
      </div>
    );
  }

  // Months are 0-indexed in JavaScript Date
  const isAprilFools =
    new Date().getDate() === 1 && new Date().getMonth() === 3;

  const fullscreenAudioDisplay = (
    <div
      className={`flex flex-col justify-between h-full max-w-2xl w-full mx-auto ${
        isAprilFools && "animate-bounce"
      }`}
    >
      <div className=" m-auto">
        <SongInfo playerOpen={playerOpen} />
      </div>

      <PlaybackControlls
        skipBackward={skipBackward}
        skipForward={skipForward}
        playerOpen={playerOpen}
      />
      <div className="mt-4">
        <ProgressBar audioRef={audioRef} />
        <div className="flex items-center justify-between select-none">
          <div className="flex items-center gap-4">
            <ShuffleButton />
            <RepeatButton />
            <VolumeControll />
          </div>
          <Time />
        </div>
      </div>
    </div>
  );

  const bottomAudioDisplay = (
    <>
      <div className="hidden md:block">
        <ProgressBar audioRef={audioRef} />
      </div>
      <div className="flex items-center justify-between">
        <SongInfo />
        <PlaybackControlls
          skipBackward={skipBackward}
          skipForward={skipForward}
        />
        <div className="hidden md:flex items-center space-x-4 min-w-0 flex-1 justify-end select-none">
          <ShuffleButton />
          <RepeatButton />
          <Time />
          <VolumeControll />
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <audio
        ref={audioRef}
        src={
          currentSong ? `/music/${encodeURI(currentSong.file_path)}` : undefined
        }
        preload="metadata"
      />

      {playerOpen ? fullscreenAudioDisplay : bottomAudioDisplay}
    </div>
  );
}
