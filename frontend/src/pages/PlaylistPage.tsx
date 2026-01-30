import { useEffect, useState } from "react";
import type { Playlist } from "../types/data";
import SongCard from "../components/ui/cards/SongCard";
import { useNavigate, useParams } from "react-router-dom";
import { usePlayer } from "../contexts/PlayerContext";
import { playlistsApi } from "../lib/api/playlists";
import Button from "../components/ui/buttons/Button";
import { FaPlay, FaUser } from "react-icons/fa6";
import { MdOutlineQueueMusic } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";
import type { Song } from "../types/Song";
import { FaRegTrashAlt } from "react-icons/fa";
import { useModal } from "../contexts/ModalContext";
import DeletePlaylistModal from "../components/ui/modals/DeletePlaylistModal";
import { useSongMenuActions } from "../hooks/useSongMenuActions";

export default function PlaylistsPage() {
  const [playlist, setPlaylist] = useState<Playlist>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const player = usePlayer();
  const { id } = useParams();
  const { addModal, closeModal } = useModal();
  const { addToPlaylist } = useSongMenuActions();

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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-2 mb-2">
          <IoChevronBack
            className="text-2xl cursor-pointer mt-1"
            onClick={() => navigate(-1)}
          />
          <div>
            <h1 className="text-xl">{playlist.name}</h1>
            <p>{playlist.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
          <span>{playlist.username}</span>
          <FaUser className="text-base text-rose-600" />
        </div>
      </div>
      <div className="flex gap-2 w-full items-center justify-between">
        <div>
          <h2>
            <span className="font-medium">{songs.length}</span> Songs
          </h2>
          {songs.length == 0 && (
            <div className="text-stone-400">No songs in playlist</div>
          )}
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
              if (player.state.currentQueue.length === 0) {
                player.dispatch({ type: "PLAY_SONG", payload: songs[0] });
              }
            }}
          >
            <MdOutlineQueueMusic />
            <span>Queue</span>
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => {
              addModal(
                <DeletePlaylistModal
                  id={Number(id)}
                  onSuccess={() => {
                    closeModal();
                    navigate("/playlists");
                  }}
                  onCancel={closeModal}
                />,
              );
            }}
          >
            <FaRegTrashAlt />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <ul className="flex flex-col space-y-2">
        {songs.length > 0 &&
          songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              menuActions={[
                {
                  onClick: () => {
                    // TODO: Display modal like for creating playlists and adding songs
                    if (
                      !confirm(
                        "Are you sure you want to remove this song from the playlist?",
                      )
                    )
                      return;
                    removeFromPlaylist(song);
                  },
                  text: "Remove from playlist",
                },
                addToPlaylist(song),
              ]}
            />
          ))}
      </ul>
    </div>
  );
}
