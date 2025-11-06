import { HiOutlineDotsVertical } from "react-icons/hi";
import type { Song } from "../../types/music";
import { usePlayer } from "../../contexts/PlayerContext";
import { FaItunesNote } from "react-icons/fa6";

export default function SongCard({
  song,
  onClick,
}: {
  song: Song;
  onClick?: () => void;
}) {
  const player = usePlayer();

  const active = player.state.currentSong?.id === song.id;
  return (
    <li className="bg-stone-900 my-2 flex justify-between items-center select-none cursor-grab overflow-hidden rounded-md">
      <div className="bg-stone-800 h-10 w-10 flex justify-center items-center text-stone-400">
        {song.album_art ? (
          <img src={song.album_art} alt="img" />
        ) : (
          <FaItunesNote />
        )}
      </div>
      <span
        onClick={onClick}
        className={`${
          active ? "font-semibold text-rose-500" : "text-stone-300"
        } w-full p-2 `}
      >
        {song.title}
      </span>
      <HiOutlineDotsVertical
        onClick={() => alert("Not implemented yet.")}
        className="mx-2"
      />
    </li>
  );
}
