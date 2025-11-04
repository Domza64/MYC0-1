import { FaMusic } from "react-icons/fa6";
import type { Playlist } from "../types/music";
import VerticalScrollSection from "../components/layout/VerticalScrollSection";
import PlaylistCard from "../components/ui/PlaylistCard";

export default function Home() {
  /*
    id: string;
    name: string;
    description?: string;
    songs: Song[];
    songCount: number;
    totalDuration: number;
    isPublic: boolean;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    coverArt?: string;
  */
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
    <div className="flex flex-col p-4 gap-8">
      <section>
        <h1 className="text-2xl">
          Hello <span className="font-semibold">Domza</span>
        </h1>
      </section>
      <VerticalScrollSection title="My playlists">
        {playlists.map((playlist) => (
          <PlaylistCard playlist={playlist} key={playlist.id} />
        ))}
      </VerticalScrollSection>
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
