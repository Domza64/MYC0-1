import type { Playlist } from "../types/data";
import VerticalScrollSection from "../components/layout/VerticalScrollSection";
import PlaylistCard from "../components/ui/cards/PlaylistCard";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { playlistsApi } from "../lib/api/playlists";
import { recommendationsApi } from "../lib/api/recommendations";
import type { Song } from "../types/Song";
import SongCard from "../components/ui/cards/SongCard";
import AddToPlaylistForm from "../components/ui/modals/AddToPlaylistForm";
import { useModal } from "../contexts/ModalContext";
import { usePlayer } from "../contexts/PlayerContext";

export default function HomePage() {
  // TODO: Handle loading state
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[] | null>(null);

  const { dispatch } = usePlayer();
  const { addModal, closeModal } = useModal();

  const { auth } = useAuth();

  useEffect(() => {
    playlistsApi.getAll().then(setPlaylists);
    recommendationsApi.getRecentlyPlayed().then(setRecentlyPlayed);
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1>
          Hello <span className="font-semibold">{auth.username}</span>
        </h1>
      </section>
      <VerticalScrollSection title="Recently played">
        {recentlyPlayed ? (
          recentlyPlayed.map((song) => (
            <SongCard
              song={song}
              key={song.id}
              square={true}
              menuActions={[
                {
                  onClick: () =>
                    addModal(
                      <AddToPlaylistForm
                        songs={[song]}
                        onSuccess={closeModal}
                      />
                    ),
                  text: "Add to playlist",
                },
                {
                  onClick: () => {
                    dispatch({
                      type: "ADD_TO_QUEUE",
                      payload: [song],
                      showMessage: true,
                    });
                  },
                  text: "Add to queue",
                },
              ]}
            />
          ))
        ) : (
          <span>Loading...</span>
        )}
      </VerticalScrollSection>
      <VerticalScrollSection title="Recommended for today">
        <span>Soon...</span>
      </VerticalScrollSection>
      <VerticalScrollSection title="My playlists">
        {playlists ? (
          playlists.map((playlist) => (
            <PlaylistCard playlist={playlist} key={playlist.id} />
          ))
        ) : (
          <span>Loading...</span>
        )}
      </VerticalScrollSection>
      <VerticalScrollSection title="Top...">
        <span>Soon...</span>
      </VerticalScrollSection>
    </div>
  );
}
