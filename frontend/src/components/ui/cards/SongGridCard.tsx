import { FaItunesNote } from "react-icons/fa6";
import { usePlayer } from "../../../contexts/PlayerContext";
import type { Song } from "../../../types/Song";
import SongDropdownMenu, { type MenuAction } from "./SongDropdownMenu";

interface SongGridCardProps {
  song: Song;
  menuActions?: MenuAction[];
}

export default function SongGridCard({ song, menuActions }: SongGridCardProps) {
  const { state, dispatch } = usePlayer();
  const isActive = state.currentSong?.id === song.id;

  return (
    <div className="flex w-full flex-col">
      <div
        onClick={() => dispatch({ type: "PLAY_SONG", payload: song })}
        className="aspect-square w-full cursor-pointer select-none overflow-hidden rounded-2xl bg-stone-900/75 transition-colors hover:bg-stone-900"
      >
        {song.image ? (
          <img
            src={"/images/" + song.image}
            alt={song.displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-stone-800 text-stone-400">
            <FaItunesNote className="text-4xl" />
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-2 pt-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <span
            className={`w-full truncate pl-0.5 ${isActive ? "text-rose-500" : "text-stone-300"}`}
          >
            {song.displayName}
          </span>
          {song.author?.name && (
            <span className="truncate pl-0.5 text-sm text-stone-400">
              {song.author.name}
            </span>
          )}
        </div>

        <SongDropdownMenu
          actions={menuActions}
          className="my-auto"
          iconClassName="h-7 w-7 p-1"
          menuClassName="right-0 bottom-8"
        />
      </div>
    </div>
  );
}
