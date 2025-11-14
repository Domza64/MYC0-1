import { HiOutlineDotsVertical } from "react-icons/hi";
import type { Song } from "../../../types/music";
import { usePlayer } from "../../../contexts/PlayerContext";
import { FaItunesNote } from "react-icons/fa6";
import { useEffect, useState } from "react";

/**
 * Represents a single action in a song card's dropdown menu.
 */
export interface MenuAction {
  /**
   * Function to execute when the menu item is clicked.
   */
  onClick: () => void;

  /**
   * Text to display for this menu item.
   */
  text: string;
}

/**
 * SongCard Component
 *
 * Displays a song with album art, title, and a dropdown menu for actions.
 *
 * Features:
 * - Highlights the currently playing song.
 * - Optional onClick handler for the song row.
 * - Optional dropdown menu with custom actions.
 *
 * @param {Object} props - Component props
 * @param {Song} props.song - The song to display.
 * @param {() => void} [props.onClick] - Optional click handler when the song row is clicked.
 * @param {MenuAction[]} [props.menuActions] - Optional array of menu actions for the dropdown menu.
 *
 * @example
 * <SongCard
 *   song={song}
 *   onClick={() => playSong(song)}
 *   menuActions={[
 *     { text: "Add to Favorites", onClick: () => addToFavorites(song) },
 *     { text: "Remove", onClick: () => removeSong(song.id) },
 *   ]}
 * />
 */
export default function SongCard({
  song,
  onClick,
  menuActions,
}: {
  song: Song;
  onClick?: () => void;
  menuActions?: MenuAction[];
}) {
  const [showMenu, setShowMenu] = useState(false);
  const player = usePlayer();

  useEffect(() => {
    const onClick = (event: Event) => {
      if (event.target !== document.getElementById(song.id.toString())) {
        setShowMenu(false);
      }
    };

    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, []);

  const active = player.state.currentSong?.id === song.id;
  return (
    <li className="bg-stone-900 my-2 flex justify-between items-center select-none rounded-md relative">
      <div className="bg-stone-800 h-10 w-10 flex justify-center items-center text-stone-400">
        {song.album_art ? (
          <img src={"images/" + song.album_art} alt="img" />
        ) : (
          <>
            {song.album_art}
            <FaItunesNote />
          </>
        )}
      </div>
      <span
        onClick={onClick}
        className={`${
          active ? "font-semibold text-rose-500" : "text-stone-300"
        } w-full p-2 truncate`}
      >
        {song.title || song.file_name}
      </span>
      <HiOutlineDotsVertical
        id={song.id.toString()}
        onClick={() => {
          setShowMenu((prev) => !prev);
        }}
        className="w-4 mr-2 cursor-pointer"
      />
      {showMenu && (
        <div className="absolute right-8 top-0 bg-stone-800 rounded mt-1 z-10">
          <ul>
            {menuActions?.map((action) => (
              <li
                key={action.text}
                onClick={action.onClick}
                className="cursor-pointer hover:bg-stone-900 px-3 py-1"
              >
                {action.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
