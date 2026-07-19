import { FaItunesNote } from "react-icons/fa6";
import { usePlayer } from "../../../contexts/PlayerContext";
import type { Song } from "../../../types/Song";
import SongRating from "../SongRating";
import SongDropdownMenu, { type MenuAction } from "./SongDropdownMenu";

interface SongRowProps {
  song: Song;
  menuActions?: MenuAction[];
}

export default function SongRow({ song, menuActions }: SongRowProps) {
  const { state, dispatch } = usePlayer();
  const isActive = state.currentSong?.id === song.id;

  return (
    <li className="relative flex select-none items-center justify-between rounded-md border border-stone-900 bg-stone-900/75 shadow-sm shadow-stone-900 transition-colors hover:bg-stone-900">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-stone-800 text-stone-400">
        {song.image ? (
          <img
            src={"/images/" + song.image}
            alt={song.displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          <FaItunesNote />
        )}
      </div>

      <span
        onClick={() => dispatch({ type: "PLAY_SONG", payload: song })}
        className={`w-full cursor-pointer truncate p-2 ${isActive ? "font-semibold text-rose-500" : "text-stone-300"}`}
      >
        {song.displayName}
      </span>

      <SongRating song={song} className="mr-2" />

      <SongDropdownMenu
        actions={menuActions}
        className="mr-2"
        iconClassName="w-4"
        menuClassName="right-0 top-full mt-1"
      />
    </li>
  );
}
