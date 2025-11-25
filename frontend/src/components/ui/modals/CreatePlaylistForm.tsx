import { useState } from "react";
import Button from "../buttons/Button";
import { playlistsApi } from "../../../lib/api/playlists";
import type { Playlist } from "../../../types/music";

interface CreatePlaylistFormProps {
  onSuccess?: (playlist: Playlist) => void;
  onCancel?: () => void;
}

export default function CreatePlaylistForm({
  onSuccess,
  onCancel,
}: CreatePlaylistFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shared, setShared] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    playlistsApi
      .create({ name, description, shared })
      .then((playlist) => {
        onSuccess?.(playlist);
      })
      .catch((err) => {
        setError(err.message || "Failed to create playlist");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 space-y-4">
      <h3 className="text-lg font-semibold">Create New Playlist</h3>

      {error && (
        <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-300 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 bg-stone-800/50 border border-stone-700 rounded-lg focus:outline-none focus:border-stone-500"
            placeholder="Enter playlist name"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-stone-800/50 border border-stone-700 rounded-lg focus:outline-none focus:border-stone-500"
            placeholder="Optional description"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="shared"
            checked={shared}
            onChange={(e) => setShared(e.target.checked)}
            className="w-4 h-4 text-blue-500 bg-stone-800 border-stone-700 rounded focus:ring-blue-400"
          />
          <label htmlFor="shared" className="text-sm font-medium">
            Shared playlist
          </label>
        </div>
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
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Creating..." : "Create Playlist"}
        </Button>
      </div>
    </form>
  );
}
