import { Link } from "react-router-dom";
import type { Playlist } from "../../../types/data";
import { FaItunesNote } from "react-icons/fa6";

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Link
      to={`/playlists/${playlist.id}`}
      key={playlist.id}
      className="group flex flex-col items-start w-40"
    >
      <div className="w-40 h-40 rounded-2xl overflow-hidden">
        {playlist.playlist_image ? (
          <img
            src={"images/" + playlist.playlist_image}
            alt={playlist.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-stone-800 text-stone-400">
            <FaItunesNote className="text-4xl" />
          </div>
        )}
      </div>
      <p className="pt-2 w-40 truncate">{playlist.name}</p>
      <span className="truncate w-40 text-sm text-stone-400">
        {playlist.description}
      </span>
    </Link>
  );
}
