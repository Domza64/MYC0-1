import { FaMusic } from "react-icons/fa";
import { usePlayer } from "../../../contexts/PlayerContext";

export default function SongInfo({
  playerOpen = false,
}: {
  playerOpen?: boolean;
}) {
  const { state } = usePlayer();
  const { currentSong } = state;

  if (!currentSong) return <span>No song playing</span>;

  const isExpanded = playerOpen;

  const containerClasses = isExpanded
    ? "flex flex-col items-center text-center mx-auto"
    : "flex items-center space-x-4 min-w-0 flex-1 mr-8";

  const imageWrapperClasses = isExpanded
    ? "bg-stone-800 border-2 rounded-2xl border-stone-950 flex justify-center items-center mb-4 mx-auto overflow-hidden w-[80vw] h-[80vw] max-w-[350px] max-h-[350px]"
    : "w-12 h-12 bg-stone-700 rounded shrink-0 flex items-center justify-center overflow-hidden";

  const imageClasses = isExpanded
    ? "w-full aspect-square object-cover"
    : "w-12 h-12 object-cover";

  const fallbackIconClasses = isExpanded
    ? "text-stone-500 w-12 h-12"
    : "text-stone-400 w-6 h-6";

  return (
    <div className={containerClasses}>
      <div className={imageWrapperClasses}>
        {currentSong.album_art ? (
          <img
            src={"images/" + currentSong.album_art}
            alt={currentSong.album || "Unknown"}
            className={imageClasses}
          />
        ) : (
          <div className="flex items-center justify-center">
            <FaMusic className={fallbackIconClasses} />
          </div>
        )}
      </div>

      <div className="min-w-0 w-full max-w-[80vw] mx-auto">
        <h4 className="text-white font-medium truncate">
          {currentSong.title || currentSong.file_name}
        </h4>
        <p className="text-stone-400 text-sm truncate">
          {currentSong.artist} • {currentSong.album}
        </p>
      </div>
    </div>
  );
}
