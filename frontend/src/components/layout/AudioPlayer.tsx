import { useState, useRef, useEffect } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import { formatDuration } from "../../utils/formatters";
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
  FaVolumeMute,
  FaVolumeDown,
  FaMusic,
  FaForward,
  FaBackward,
} from "react-icons/fa";

export default function AudioPlayer() {
  const { state, dispatch } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [volumeOpen, setVolumeOpen] = useState(false);

  const { currentSong, isPlaying, volume, currentTime, duration } = state;

  // Sync audio element with player state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        dispatch({ type: "SET_CURRENT_TIME", payload: audio.currentTime });
      }
    };

    const handleLoadedMetadata = () => {
      dispatch({ type: "SET_DURATION", payload: audio.duration });
    };

    const handleEnded = () => {
      // Auto-play next song if available
      if (state.queue.length > state.currentIndex + 1) {
        dispatch({ type: "NEXT_SONG" });
      } else {
        dispatch({ type: "TOGGLE_PLAYBACK" });
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [dispatch, isDragging, state.queue, state.currentIndex]);

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

  const togglePlayback = () => {
    dispatch({ type: "TOGGLE_PLAYBACK" });
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      dispatch({ type: "SET_CURRENT_TIME", payload: newTime });
    }
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleSeek(moveEvent as unknown as React.MouseEvent<HTMLDivElement>);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    dispatch({ type: "SET_VOLUME", payload: newVolume });
  };

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

  const playNext = () => {
    dispatch({ type: "NEXT_SONG" });
  };

  const playPrevious = () => {
    dispatch({ type: "PREVIOUS_SONG" });
  };

  const toggleMute = () => {
    dispatch({ type: "SET_VOLUME", payload: volume > 0 ? 0 : 0.7 });
  };

  const getVolumeIcon = () => {
    if (volume === 0) {
      return <FaVolumeMute className="w-4 h-4" />;
    } else if (volume < 0.5) {
      return <FaVolumeDown className="w-4 h-4" />;
    } else {
      return <FaVolumeUp className="w-4 h-4" />;
    }
  };

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

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={
          currentSong
            ? `http://localhost:8000/music/${encodeURI(currentSong.file_path)}`
            : undefined
        }
        preload="metadata"
      />

      {/* Progress Bar */}
      <div>
        <div
          className="h-2 bg-stone-600 cursor-pointer mb-3 rounded-full overflow-hidden"
          onClick={handleSeek}
          onMouseDown={handleProgressDrag}
        >
          <div
            className="h-full bg-rose-500 transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <div className="w-12 h-12 bg-stone-700 rounded shrink-0 flex items-center justify-center">
            {currentSong.album_art ? (
              <img
                src={currentSong.album_art}
                alt={currentSong.album}
                className="w-12 h-12 rounded object-cover"
              />
            ) : (
              <div className="text-stone-400">
                <FaMusic className="w-6 h-6" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-white font-medium truncate">
              {currentSong.title}
            </h4>
            <p className="text-stone-400 text-sm truncate">
              {currentSong.artist} • {currentSong.album}
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-4 mx-8">
          <button
            onClick={playPrevious}
            className="text-stone-400 hover:text-white p-2 transition-colors"
            title="Previous"
          >
            <FaStepBackward className="w-4 h-4" />
          </button>

          <button
            onClick={skipBackward}
            className="text-stone-400 hover:text-white p-2 transition-colors"
            title="Skip backward 10s"
          >
            <FaBackward className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlayback}
            className="bg-white text-stone-900 rounded-full p-3 hover:scale-105 transition-transform"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <FaPause className="w-4 h-4" />
            ) : (
              <FaPlay className="w-4 h-4 pl-0.5" />
            )}
          </button>

          <button
            onClick={skipForward}
            className="text-stone-400 hover:text-white p-2 transition-colors"
            title="Skip forward 10s"
          >
            <FaForward className="w-4 h-4" />
          </button>

          <button
            onClick={playNext}
            className="text-stone-400 hover:text-white p-2 transition-colors"
            title="Next"
          >
            <FaStepForward className="w-4 h-4" />
          </button>
        </div>

        {/* Time and Volume Controls */}
        <div className="flex items-center space-x-4 min-w-0 flex-1 justify-end">
          <div className="text-stone-400 text-sm whitespace-nowrap">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </div>

          {/* Volume Control */}
          <div className="relative">
            <button
              onClick={toggleMute}
              onMouseEnter={() => setVolumeOpen(true)}
              onMouseLeave={() => setVolumeOpen(false)}
              className="text-stone-400 hover:text-white p-2 transition-colors"
              title="Volume"
            >
              {getVolumeIcon()}
            </button>

            {volumeOpen && (
              <div
                className="absolute bottom-full mb-2 right-0 bg-stone-700 rounded-lg p-4 shadow-xl"
                onMouseEnter={() => setVolumeOpen(true)}
                onMouseLeave={() => setVolumeOpen(false)}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-stone-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
