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
      className="p-2 my-2 flex justify-center items-center select-none cursor-grab bg-stone-700"
    >
      {song.title}
    </li>
  );
}
