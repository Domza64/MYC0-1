import { Link } from "react-router-dom";
import type { Playlist } from "../../types/music";

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Link
      to={`/playlists/${playlist.id}`}
      key={playlist.id}
      className="group flex flex-col items-center backdrop-blur-md transition-all duration-300"
    >
      <div className="w-40 h-40 rounded-2xl overflow-hidden">
        <img
          src="/static/album_cover.png"
          /*src={playlist.coverArt}*/
          alt={playlist.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          draggable={false}
        />
      </div>
      <p className="pt-2 w-full">{playlist.name}</p>
    </Link>
  );
}
