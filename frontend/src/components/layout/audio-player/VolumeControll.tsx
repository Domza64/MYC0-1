import { useState } from "react";
import { usePlayer } from "../../../contexts/PlayerContext";
import { FaVolumeUp, FaVolumeMute, FaVolumeDown } from "react-icons/fa";

export default function VolumeControll() {
  const [volumeOpen, setVolumeOpen] = useState(false);
  const { dispatch, state } = usePlayer();

  const { volume } = state;

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    dispatch({ type: "SET_VOLUME", payload: newVolume });
  };

  return (
    <div className="relative hidden md:block">
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
  );
}
