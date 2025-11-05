import { HiOutlineDotsVertical } from "react-icons/hi";
import { usePlayer } from "../../contexts/PlayerContext";
import type { Song } from "../../types/music";

export default function SongCard({ song }: { song: Song }) {
  const player = usePlayer();
  return (
    <li
      onClick={() => {
        player.dispatch({ type: "PLAY_SONG", payload: song });
        player.dispatch({ type: "ADD_TO_QUEUE", payload: [song] });
      }}
      className="p-2 my-2 flex justify-between items-center select-none cursor-grab bg-stone-800 rounded-md"
    >
      <span className="text-stone-300">{song.title}</span>
      <HiOutlineDotsVertical />
    </li>
  );
}
