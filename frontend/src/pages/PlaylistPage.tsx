import { useEffect, useState } from "react";
import type { Playlist, Song } from "../types/music";
import SongCard from "../components/ui/cards/SongCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePlayer } from "../contexts/PlayerContext";
import { playlistsApi } from "../lib/api/playlists";
import Button from "../components/ui/buttons/Button";
import { FaPlay } from "react-icons/fa6";
import { MdOutlineQueueMusic } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";

export default function PlaylistsPage() {
  const [playlist, setPlaylist] = useState<Playlist>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const player = usePlayer();
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
    player.dispatch({ type: "ADD_TO_QUEUE", payload: songs, replace: true });
    player.dispatch({ type: "PLAY_SONG", payload: song });
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
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <IoChevronBack
            className="text-2xl cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-xl">{playlist.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              player.dispatch({
                type: "ADD_TO_QUEUE",
                payload: songs,
                replace: true,
              });
              player.dispatch({ type: "PLAY_SONG", payload: songs[0] });
            }}
          >
            <FaPlay />
            <span>Play</span>
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              player.dispatch({
                type: "ADD_TO_QUEUE",
                payload: songs,
                showMessage: true,
              });
              if (player.state.queue.length === 0) {
                player.dispatch({ type: "PLAY_SONG", payload: songs[0] });
              }
            }}
          >
            <MdOutlineQueueMusic />
            <span>Add</span>
          </Button>
        </div>
      </div>
      <ul className="flex flex-col">
        {songs.length == 0 ? (
          <div>No songs in playlist</div>
        ) : (
          songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onClick={() => handleSongClick(song)}
              menuActions={[
                {
                  onClick: () => {
                    if (
                      !confirm(
                        "Are you sure you want to remove this song from the playlist?"
                      )
                    )
                      return;
                    removeFromPlaylist(song);
                  },
                  text: "Remove from playlist",
                },
              ]}
            />
          ))
        )}
      </ul>
    </div>
  );
}
