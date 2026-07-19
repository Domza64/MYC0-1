import type { Playlist } from "../types/data";
import HorizontalScrollSection from "../components/layout/HorizontalScrollSection";
import PlaylistCard from "../components/ui/cards/PlaylistCard";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { playlistsApi } from "../lib/api/playlists";
import { recommendationsApi } from "../lib/api/recommendations";
import type { Song } from "../types/Song";
import { Link } from "react-router-dom";
import { useSongMenuActions } from "../hooks/useSongMenuActions";
import SongGridCard from "../components/ui/cards/SongGridCard";

export default function HomePage() {
  // TODO: Handle loading and error loading states
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[] | null>(null);

  const { addToPlaylist, addToQueue } = useSongMenuActions();

  const { auth } = useAuth();

  useEffect(() => {
    playlistsApi.getAll().then(setPlaylists);
    recommendationsApi.getRecentlyPlayed().then(setRecentlyPlayed);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="font-normal!">
          Hello <span className="font-semibold">{auth?.username}</span>
        </h1>
      </section>

      <HorizontalScrollSection title="Your playlists">
        {playlists ? (
          playlists.length === 0 ? (
            <span>
              No playlists, <Link to={"/playlists"}>create them</Link>
            </span>
          ) : (
            playlists.map((playlist) => (
              <PlaylistCard playlist={playlist} key={playlist.id} />
            ))
          )
        ) : (
          <span>Loading...</span>
        )}
      </HorizontalScrollSection>

      <HorizontalScrollSection title="Recently played songs">
        {recentlyPlayed ? (
          recentlyPlayed.map((song) => (
            <SongGridCard
              song={song}
              key={song.id}
              menuActions={[addToPlaylist(song), addToQueue(song)]}
            />
          ))
        ) : (
          <span>Loading...</span>
        )}
      </HorizontalScrollSection>

      <HorizontalScrollSection title="Recommended for today">
        <p>
          List of custom servermade playlists.{" "}
          <span className="text-s text-stone-400">soon</span>
        </p>
      </HorizontalScrollSection>

      <HorizontalScrollSection title="Most listened artists">
        <span>Soon...</span>
      </HorizontalScrollSection>
    </div>
  );
}
