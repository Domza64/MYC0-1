import { useEffect, useState } from "react";
import PlaylistCard from "../components/ui/cards/PlaylistCard";
import type { Playlist } from "../types/music";
import { playlistsApi } from "../lib/api/playlists";
import toast from "react-hot-toast";
import { useModal } from "../contexts/ModalContext";
import CreatePlaylistForm from "../components/ui/modals/CreatePlaylistForm";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const { addModal, closeModal } = useModal();

  useEffect(() => {
    playlistsApi
      .getAll()
      .then(setPlaylists)
      .catch(() => toast.error("Failed to load playlists"));
  }, []);

  const handleSuccess = (newPlaylist: Playlist) => {
    setPlaylists((playlists) => [...playlists, newPlaylist]);
    toast.success("Playlist created");
    closeModal();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1>My Playlists</h1>
      </div>
      <ul className="flex flex-wrap gap-4">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
        <button
          onClick={() => {
            addModal(
              <CreatePlaylistForm
                onSuccess={handleSuccess}
                onCancel={closeModal}
              />
            );
          }}
          className="group flex flex-col items-center backdrop-blur-md transition-all duration-300"
        >
          <div className="w-40 h-40 rounded-2xl overflow-hidden flex justify-center items-center bg-stone-800 hover:bg-stone-900 cursor-grab transition-colors">
            Create Playlist
          </div>
        </button>
      </ul>
    </div>
  );
}
