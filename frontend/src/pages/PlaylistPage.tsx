import { useEffect, useState } from "react";
import type { Playlist, Song } from "../types/music";
import SongCard from "../components/ui/SongCard";
import { useParams } from "react-router-dom";
import { usePlayer } from "../contexts/PlayerContext";
import toast from "react-hot-toast";

export default function PlaylistsPage() {
  const [playlist, setPlaylist] = useState<Playlist>();
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<Song[]>([]);
  const { dispatch } = usePlayer();
  const { id } = useParams();

  const fetchPlaylistData = async () => {
    try {
      const response = await fetch(`/api/playlists/${id}`);
      const data = await response.json();
      if (response.ok) {
        setPlaylist(data);
      }
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSongs = async () => {
    if (!playlist) return;
    try {
      const response = await fetch(`/api/playlists/songs/${id}`);
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  useEffect(() => {
    fetchPlaylistData();
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [playlist]);

  const handleSongClick = (song: Song) => {
    dispatch({ type: "CLEAR_QUEUE" });
    dispatch({ type: "ADD_TO_QUEUE", payload: songs });
    dispatch({ type: "PLAY_SONG", payload: song });
  };

  const removeFromPlaylist = (song: Song) => {
    try {
      fetch(`/api/playlists/${id}/${song.id}`, {
        method: "DELETE",
      });
      setSongs((prevSongs) => prevSongs.filter((s) => s.id !== song.id));
    } catch (error) {
      toast.error("Failed to remove song from playlist");
      console.error("Error removing song from playlist:", error);
    }
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
