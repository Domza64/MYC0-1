import { usePlayer } from "../../../contexts/PlayerContext";
import { FaVolumeUp, FaVolumeMute, FaVolumeDown } from "react-icons/fa";

export default function VolumeControll() {
  const { dispatch, state } = usePlayer();

  const { volume } = state;

  const toggleMute = () => {
    dispatch({ type: "SET_VOLUME", payload: volume > 0 ? 0 : 1.0 });
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    dispatch({ type: "SET_VOLUME", payload: newVolume });
  };

  return (
    <div className="hidden lg:flex">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        className="text-stone-400 hover:text-white p-2 transition-colors"
        title="Volume"
      >
        {getVolumeIcon()}
      </button>

      <div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-stone-600 rounded-lg appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-2
          [&::-webkit-slider-thumb]:w-2
          [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-stone-400
          hover:[&::-webkit-slider-thumb]:scale-115
          hover:[&::-webkit-slider-thumb]:bg-white"
        />
      </div>
    </div>
  );
}
