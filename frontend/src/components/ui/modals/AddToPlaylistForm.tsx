import { useEffect, useState } from "react";
import Button from "../buttons/Button";
import type { Playlist } from "../../../types/data";
import { playlistsApi } from "../../../lib/api/playlists";
import type { Song } from "../../../types/Song";
import { useModal } from "../../../contexts/ModalContext";
import CreatePlaylistForm from "./CreatePlaylistForm";

interface AddToPlaylistFormProps {
  songs: Song[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

// TODO: When user clicks "New playlist" and creates a playlist songs are automatically added to it.
// Problem is that CreatePlaylistForm modal closes but AddToPlaylistForm remains open underneath it untill
// server responds withouth any visual indication that request is being processed.
export default function AddToPlaylistForm({
  songs,
  onSuccess,
  onCancel,
}: AddToPlaylistFormProps) {
  // Selected playlist ID
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | undefined>(
    undefined,
  );
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { addModal, closeModal } = useModal();

  useEffect(() => {
    if (playlists == null) {
      playlistsApi
        .getAll()
        .then((playlists) => {
          const sorted = playlists.sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime(),
          );
          setPlaylists(sorted);
          setSelectedPlaylist(playlists[0]?.id);
        })
        .catch(() => {
          setError("Failed to load playlists");
        });
    }
  }, [playlists]);

  const addToPlaylist = (playlistId: number) => {
    setSubmitting(true);
    setError("");

    playlistsApi
      .addSongs(
        playlistId,
        songs.map((s) => s.id),
      )
      .then((data) => {
        if (data.added_count !== 0) {
          onSuccess?.();
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to add songs to playlist");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPlaylist == null) {
      setError("Please select a playlist");
      return;
    }

    addToPlaylist(selectedPlaylist);
  };

  const handlePlaylistCreated = (newPlaylist: Playlist) => {
    setPlaylists((playlists) => [...(playlists || []), newPlaylist]);
    setSelectedPlaylist(newPlaylist.id);
    // Seems like closeModal is rerendering this whole component and thus preventing it from properly selecting the new playlist
    closeModal();
  };

  const title =
    songs.length === 1
      ? songs[0].title
      : `${songs[0].title.slice(0, 20)}... and more ${songs.length} songs`;

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 space-y-4">
      <h3 className="text-lg font-semibold">
        Add to playlist:
        <br />
        <span className="text-sm text-stone-300 font-normal">{title}</span>
      </h3>

      {error && (
        <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-300 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {playlists != null
          ? playlists.length > 0 && (
              <div>
                <select
                  id="playlist"
                  name="playlist"
                  value={selectedPlaylist}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedPlaylist(value ? Number(value) : undefined);
                  }}
                  required
                  className="w-full px-3 py-2 bg-stone-800/50 border border-stone-700 rounded-lg focus:outline-none focus:border-stone-500"
                >
                  {playlists.map((playlist: Playlist) => (
                    <option key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </option>
                  ))}
                </select>
              </div>
            )
          : !error && <p>Loading playlists...</p>}
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            className="w-full"
            disabled={submitting}
          >
            Cancel
          </Button>
        )}
        <div className="flex flex-col gap-2 w-full">
          {playlists != null && playlists.length > 0 && (
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Adding..." : "Add"}
            </Button>
          )}
          <Button
            onClick={() => {
              addModal(
                <CreatePlaylistForm onSuccess={handlePlaylistCreated} />,
              );
            }}
          >
            Create New Playlist
          </Button>
        </div>
      </div>
    </form>
  );
}
