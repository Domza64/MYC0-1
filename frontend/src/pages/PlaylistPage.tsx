import { useEffect, useRef, useState } from "react";
import type { Playlist } from "../types/data";
import { useNavigate, useParams } from "react-router-dom";
import { usePlayer } from "../contexts/PlayerContext";
import { playlistsApi } from "../lib/api/playlists";
import Button from "../components/ui/buttons/Button";
import { FaPlay, FaUser } from "react-icons/fa6";
import { MdEdit, MdOutlineQueueMusic } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";
import type { Song } from "../types/Song";
import { FaRegTrashAlt, FaSave } from "react-icons/fa";
import { useModal } from "../contexts/ModalContext";
import DeletePlaylistModal from "../components/ui/modals/DeletePlaylistModal";
import { useSongMenuActions } from "../hooks/useSongMenuActions";
import { BsPeopleFill } from "react-icons/bs";
import { useAuth } from "../contexts/AuthContext";
import { ImCancelCircle } from "react-icons/im";
import { formatSmartDate } from "../lib/formatters";
import SongRow from "../components/ui/cards/SongRow";

export default function PlaylistsPage() {
  const [playlist, setPlaylist] = useState<Playlist>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const player = usePlayer();
  const { id } = useParams();
  const { addModal, closeModal } = useModal();
  const { addToPlaylist } = useSongMenuActions();
  const [editing, setEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shared, setShared] = useState(false);

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

  // TODO: Move form for update to separat component
  const updatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playlist) return;

    const previous = playlist;

    const optimistic = {
      ...playlist,
      name,
      description,
      shared,
    };

    // update UI immediately
    setPlaylist(optimistic);
    setEditing(false);

    try {
      const updated = await playlistsApi.updatePlaylist(playlist.id, {
        name,
        description,
        shared,
      });

      // replace optimistic values with server values
      setPlaylist(updated);
    } catch (err) {
      // rollback on failure
      setPlaylist(previous);
      alert("Failed to update playlist.");
    }
  };

  useEffect(() => {
    if (!playlist) return;

    setName(playlist.name);
    setDescription(playlist.description || "");
    setShared(playlist.shared);
  }, [playlist]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  const isOwner = auth && playlist.user_id == auth.id;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3 mb-2">
          <IoChevronBack
            className="text-2xl cursor-pointer mt-2"
            onClick={() => navigate(-1)}
          />
          <div>
            {editing ? (
              <>
                <form
                  ref={formRef}
                  className="flex flex-col gap-2"
                  onSubmit={updatePlaylist}
                >
                  <input
                    type="text"
                    className="w-full px-2 py-1 border border-stone-700 rounded focus:outline-none focus:border-stone-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Playlist name"
                  />
                  <input
                    type="text"
                    className="w-full px-2 py-1 border border-stone-700 rounded focus:outline-none focus:border-stone-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={shared}
                      onChange={(e) => setShared(e.target.checked)}
                    />
                    <label className="text-sm font-medium">
                      Shared playlist
                    </label>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-xl">{playlist.name}</h1>
                <p>{playlist.description}</p>
              </>
            )}
          </div>
          {isOwner && (
            <div className="mt-3">
              {editing ? (
                <>
                  <ImCancelCircle onClick={() => setEditing(false)} />
                  <FaSave onClick={() => formRef.current?.requestSubmit()} />
                </>
              ) : (
                <MdEdit
                  className="hover:text-gray-300 cursor-pointer text-xl"
                  onClick={() => setEditing(true)}
                />
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
          {isOwner ? (
            playlist.shared && (
              <>
                <BsPeopleFill />
                <span className="text-xs">Shared playlist</span>
              </>
            )
          ) : (
            <>
              <FaUser className="text-base text-rose-600" />
              <span>{playlist.username}</span>
            </>
          )}
          <div className="text-right">
            <span className="font-semibold text-rose-700">Updated</span>
            <br />
            <span>{formatSmartDate(playlist.updated_at)}</span>
          </div>
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
            <SongRow
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
