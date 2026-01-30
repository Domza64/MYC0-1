import { FaBackward, FaStepBackward, FaStepForward } from "react-icons/fa";
import { usePlayer } from "../../../contexts/PlayerContext";
import { FaForward, FaPause, FaPlay } from "react-icons/fa6";

export default function PlaybackControlls({
  skipBackward,
  skipForward,
  playerOpen = false,
}: {
  skipBackward: () => void;
  skipForward: () => void;
  playerOpen?: boolean;
}) {
  const { state, dispatch } = usePlayer();
  const { isPlaying, shuffle, repeat } = state;

  const hasNext = state.currentQueue.length > state.currentIndex + 1;
  const hasPrevious = state.currentIndex > 0;

  const playNext = () => {
    dispatch({ type: "NEXT_SONG" });
  };

  const playPrevious = () => {
    if (hasPrevious) {
      dispatch({ type: "PREVIOUS_SONG" });
    }
  };

  const togglePlayback = () => {
    dispatch({ type: "SET_PLAYBACK", payload: !isPlaying });
  };

  const iconSize = playerOpen ? "w-6 h-6" : "w-4 h-4";
  const padding = playerOpen ? "p-3" : "p-2";

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`flex items-center mx-auto justify-center md:gap-x-4 ${
        playerOpen ? "mb-4" : ""
      }`}
    >
      <button
        onClick={playPrevious}
        className={`text-stone-400 hover:text-white ${padding} disabled:text-stone-600 cursor-grab`}
        disabled={!hasPrevious}
      >
        <FaStepBackward className={iconSize} />
      </button>

      <button
        onClick={skipBackward}
        className={`text-stone-400 hover:text-white ${padding} ${
          playerOpen ? "" : "md:block hidden"
        }`}
      >
        <FaBackward className={iconSize} />
      </button>

      <button
        onClick={togglePlayback}
        className={`bg-white text-stone-900 rounded-full ${padding} mx-1 text-lg`}
      >
        {isPlaying ? (
          <FaPause className={iconSize} />
        ) : (
          <FaPlay className={`${iconSize} pl-0.5`} />
        )}
      </button>

      <button
        onClick={skipForward}
        className={`text-stone-400 hover:text-white ${padding} ${
          playerOpen ? "" : "md:block hidden"
        }`}
      >
        <FaForward className={iconSize} />
      </button>

      <button
        onClick={playNext}
        className={`text-stone-400 hover:text-white ${padding} disabled:text-stone-600 cursor-grab`}
        disabled={!hasNext && !shuffle && !repeat}
      >
        <FaStepForward className={iconSize} />
      </button>
    </div>
  );
}
