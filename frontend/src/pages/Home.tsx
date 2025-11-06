import type { Playlist } from "../types/music";
import VerticalScrollSection from "../components/layout/VerticalScrollSection";
import PlaylistCard from "../components/ui/PlaylistCard";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { auth } = useAuth();

  const playlists: Playlist[] = [
    {
      id: "1",
      name: "My playlist",
      description: "My playlist description",
      songs: [],
      songCount: 0,
      totalDuration: 0,
      isPublic: true,
      ownerId: "1",
      createdAt: "2021-01-01",
      updatedAt: "2021-01-01",
    },
    {
      id: "2",
      name: "Chill vibes",
      description: "Relaxing and chill music",
      songs: [],
      songCount: 0,
      totalDuration: 0,
      isPublic: false,
      ownerId: "1",
      createdAt: "2021-02-01",
      updatedAt: "2021-02-01",
    },
    {
      id: "3",
      name: "Workout",
      description: "Workout music",
      songs: [],
      songCount: 0,
      totalDuration: 0,
      isPublic: true,
      ownerId: "1",
      createdAt: "2021-03-01",
      updatedAt: "2021-03-01",
    },
  ];
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
