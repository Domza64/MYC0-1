import { useEffect, useState } from "react";
import PlaylistCard from "../components/ui/PlaylistCard";
import type { Playlist } from "../types/music";
import { playlistsApi } from "../lib/api/playlists";
import toast from "react-hot-toast";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    playlistsApi
      .getAll()
      .then(setPlaylists)
      .catch(() => toast.error("Failed to load playlists"));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1>My Playlists</h1>
      </div>
      <ul className="flex gap-4">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </ul>
    </div>
  );
}
