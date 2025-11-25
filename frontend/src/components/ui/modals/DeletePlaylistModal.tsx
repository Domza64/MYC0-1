import { useState } from "react";
import Button from "../buttons/Button";
import { playlistsApi } from "../../../lib/api/playlists";

interface DeletePlaylistModalProps {
  id: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DeletePlaylistModal({
  id,
  onSuccess,
  onCancel,
}: DeletePlaylistModalProps) {
  const [deleteing, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    playlistsApi
      .deletePlaylist(id)
      .then(() => {
        onSuccess();
      })
      .catch(() => {
        onCancel();
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  return (
    <div className="w-full p-6 space-y-4">
      <h3 className="text-lg font-semibold text-rose-500">Delete Playlist</h3>

      <p className="text-sm text-stone-300">
        Are you sure you want to delete this playlist? This action cannot be
        undone.
      </p>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            className="w-full bg-stone-700 hover:bg-stone-600 text-gray-300!"
          >
            Cancel
          </Button>
        )}
        <Button
          type="button"
          onClick={handleDelete}
          disabled={deleteing}
          className="w-full"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
