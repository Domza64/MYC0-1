import type { Playlist } from "../types/music";
import VerticalScrollSection from "../components/layout/VerticalScrollSection";
import PlaylistCard from "../components/ui/PlaylistCard";
import { useAuth } from "../contexts/AuthContext";

export default function HomePage() {
  const { auth } = useAuth();

  const playlists: Playlist[] = [];

  return (
    <div className="flex flex-col">
      <section>
        <h1>
          Hello <span className="font-semibold">{auth.username}</span>
        </h1>
      </section>
      <VerticalScrollSection title="My playlists">
        {playlists.map((playlist) => (
          <PlaylistCard playlist={playlist} key={playlist.id} />
        ))}
      </VerticalScrollSection>
      <div className="my-64"></div>
      <VerticalScrollSection title="Recently played">
        {playlists.map((playlist) => (
          <div className="w-20 h-20 bg-stone-700" key={playlist.id}>
            {playlist.name}
          </div>
        ))}
      </VerticalScrollSection>
    </div>
  );
}
