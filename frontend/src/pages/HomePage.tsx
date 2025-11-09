import type { Playlist } from "../types/music";
import VerticalScrollSection from "../components/layout/VerticalScrollSection";
import PlaylistCard from "../components/ui/cards/PlaylistCard";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { playlistsApi } from "../lib/api/playlists";

export default function HomePage() {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);

  const { auth } = useAuth();

  useEffect(() => {
    playlistsApi.getAll().then(setPlaylists);
  }, []);

  return (
    <div className="flex flex-col">
      <section>
        <h1>
          Hello <span className="font-semibold">{auth.username}</span>
        </h1>
      </section>
      <VerticalScrollSection title="My playlists">
        {playlists ? (
          playlists.map((playlist) => (
            <PlaylistCard playlist={playlist} key={playlist.id} />
          ))
        ) : (
          <span>Loading...</span>
        )}
      </VerticalScrollSection>
    </div>
  );
}
