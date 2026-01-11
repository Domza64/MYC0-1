import { HiOutlineDotsVertical } from "react-icons/hi";
import { usePlayer } from "../../../contexts/PlayerContext";
import { FaItunesNote } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { Song } from "../../../types/Song";

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
 * @param {boolean} [props.square] - Optional flag to display the card in a square shape.
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

// TODO: Add default onClick handler and menuActions that interact with the player context.
export default function SongCard({
  song,
  onClick,
  menuActions,
  square = false,
}: {
  song: Song;
  onClick?: () => void;
  menuActions?: MenuAction[];
  square?: boolean;
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
  if (square) {
    return (
      <div className="bg-stone-900/75 hover:bg-stone-900 transition-colors flex flex-col select-none rounded-lg overflow-hidden relative aspect-square w-full h-full max-w-[200px]">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-0 bg-stone-800 flex justify-center items-center">
            {song.image ? (
              <img
                src={"/images/" + song.image}
                alt={song.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaItunesNote className="w-12 h-12 text-stone-400" />
            )}
          </div>
        </div>

        <div className="p-2 flex flex-col gap-1">
          <span
            onClick={onClick}
            className={`${
              active ? "text-rose-500" : "text-stone-300"
            } font-semibold text-sm truncate`}
          >
            {song.displayName}
          </span>
          {song.author?.name && (
            <span className="text-stone-400 text-xs truncate">
              {song.author.name}
            </span>
          )}
        </div>

        <div className="absolute top-2 right-1">
          <HiOutlineDotsVertical
            id={song.id.toString()}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="w-6 h-6 cursor-pointer text-stone-400 hover:text-white p-1"
          />
          {showMenu && (
            <div className="absolute right-0 top-6 bg-stone-800 rounded mt-1 z-10 min-w-[120px] shadow-lg">
              <ul>
                {menuActions?.map((action) => (
                  <li
                    key={action.text}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                      setShowMenu(false);
                    }}
                    className="cursor-pointer hover:bg-stone-900 px-3 py-2 text-sm"
                  >
                    {action.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Maybe this shouldnt be li element
  return (
    <li className="bg-stone-900/75 border-stone-900 shadow-stone-900 shadow-sm border hover:bg-stone-900 transition-colors flex justify-between items-center select-none rounded-md relative">
      <div className="bg-stone-800 h-10 w-10 flex justify-center items-center text-stone-400">
        {song.image ? (
          <img src={"/images/" + song.image} alt="img" />
        ) : (
          <FaItunesNote />
        )}
      </div>
      <span
        onClick={onClick}
        className={`${
          active ? "font-semibold text-rose-500" : "text-stone-300"
        } w-full p-2 truncate`}
      >
        {song.displayName}
      </span>
      <HiOutlineDotsVertical
        id={song.id.toString()}
        onClick={(e) => {
          e.stopPropagation();
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
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                  setShowMenu(false);
                }}
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
