import { FaMusic } from "react-icons/fa";
import { usePlayer } from "../../../contexts/PlayerContext";

export default function SongInfo() {
  const { state } = usePlayer();

  const { currentSong } = state;

  if (!currentSong) return <span>No song playing</span>;

  return (
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
        <h4 className="text-white font-medium truncate">{currentSong.title}</h4>
        <p className="text-stone-400 text-sm truncate">
          {currentSong.artist} • {currentSong.album}
        </p>
      </div>
    </div>
  );
}
