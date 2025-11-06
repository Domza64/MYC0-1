import { FaBackward, FaStepBackward, FaStepForward } from "react-icons/fa";
import { usePlayer } from "../../../contexts/PlayerContext";
import { FaForward, FaPause, FaPlay } from "react-icons/fa6";

export default function PlaybackControlls({
  skipBackward,
  skipForward,
}: {
  skipBackward: () => void;
  skipForward: () => void;
}) {
  const { state, dispatch } = usePlayer();
  const { isPlaying, shuffle, repeat } = state;

  const hasNext = state.queue.length > state.currentIndex + 1;
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

  return (
    <div className="flex items-center space-x-1 md:space-x-2 mx-1 md:mx-8">
      <button
        onClick={playPrevious}
        className="text-stone-400 hover:text-white p-2 disabled:text-stone-600 cursor-grab"
        disabled={!hasPrevious}
      >
        <FaStepBackward className="w-4 h-4" />
      </button>

      <button
        onClick={skipBackward}
        className="text-stone-400 hover:text-white p-2 md:block hidden"
      >
        <FaBackward className="w-4 h-4" />
      </button>

      <button
        onClick={togglePlayback}
        className="bg-white text-stone-900 rounded-full p-3 hover:scale-105 transition-transform"
      >
        {isPlaying ? (
          <FaPause className="w-4 h-4" />
        ) : (
          <FaPlay className="w-4 h-4 pl-0.5" />
        )}
      </button>

      <button
        onClick={skipForward}
        className="text-stone-400 hover:text-white p-2 md:block hidden"
      >
        <FaForward className="w-4 h-4" />
      </button>

      <button
        onClick={playNext}
        className="text-stone-400 hover:text-white p-2 disabled:text-stone-600 cursor-grab"
        disabled={!hasNext && !shuffle && !repeat}
      >
        <FaStepForward className="w-4 h-4" />
      </button>
    </div>
  );
}
