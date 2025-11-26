import { useState } from "react";
import Button from "../buttons/Button";
import type { User } from "../../../types/user";
import toast from "react-hot-toast";

interface DeleteUserModalProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DeleteUserModal({
  user,
  onSuccess,
  onCancel,
}: DeleteUserModalProps) {
  const [deleteing, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorData;
        const raw = await response.text();

        try {
          errorData = JSON.parse(raw);
        } catch {
          errorData = raw;
        }
        throw new Error(errorData || "Failed to delete user");
      }

      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="w-full p-6 space-y-4">
      <h3 className="text-lg font-semibold text-rose-500">{`Delete user '${user.username}'?`}</h3>

      <p className="text-sm text-stone-300">
        Are you sure you want to delete this user and all of their data? This
        action cannot be undone.
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
