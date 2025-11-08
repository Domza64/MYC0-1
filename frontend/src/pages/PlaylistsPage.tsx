import { useEffect, useState } from "react";
import PlaylistCard from "../components/ui/PlaylistCard";
import type { Playlist } from "../types/music";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch("/api/playlists");
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
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
