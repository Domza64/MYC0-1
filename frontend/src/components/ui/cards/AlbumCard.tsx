import { Link } from "react-router-dom";
import type { Album } from "../../../types/data";
import { FaItunesNote } from "react-icons/fa6";

export default function AlbumCard({ album }: { album: Album }) {
  return (
    <Link to={`/albums/${album.id}`} className="flex flex-col w-full">
      <div className="w-full aspect-square rounded-2xl overflow-hidden">
        {album.album_art ? (
          <img
            src={"images/" + album.album_art}
            alt={album.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-stone-800 text-stone-400">
            <FaItunesNote className="text-4xl" />
          </div>
        )}
      </div>
      <span className="pl-0.5 pt-1 w-full truncate">{album.title}</span>
      <span className="pl-0.5 text-sm text-stone-400 truncate">
        {album.author.name}
      </span>
    </Link>
  );
}
