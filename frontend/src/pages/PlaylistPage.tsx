import { useEffect, useState } from "react";
import type { Playlist, Song } from "../types/music";
import SongCard from "../components/ui/SongCard";
import { useParams } from "react-router-dom";
import { usePlayer } from "../contexts/PlayerContext";
import { playlistsApi } from "../lib/api/playlists";

export default function PlaylistsPage() {
  const [playlist, setPlaylist] = useState<Playlist>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const { dispatch } = usePlayer();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    playlistsApi
      .get(Number(id))
      .then(setPlaylist)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!playlist) return;
    playlistsApi.getSongs(Number(id)).then(setSongs);
  }, [playlist]);

  // TODO: move this to some utils file
  const handleSongClick = (song: Song) => {
    dispatch({ type: "CLEAR_QUEUE" });
    dispatch({ type: "ADD_TO_QUEUE", payload: songs });
    dispatch({ type: "PLAY_SONG", payload: song });
  };

  const removeFromPlaylist = (song: Song) => {
    playlistsApi.removeSong(Number(id), song.id).then(() => {
      setSongs((prev) => prev.filter((s) => s.id !== song.id));
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1>{playlist.name}</h1>
      </div>
      <ul className="flex flex-col">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onClick={() => handleSongClick(song)}
            menuActions={[
              {
                onClick: () => removeFromPlaylist(song),
                text: "Playlist",
              },
            ]}
          />
        ))}
      </ul>
    </div>
  );
}
