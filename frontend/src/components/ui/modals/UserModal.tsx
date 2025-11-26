/**
 * UserForm Component
 *
 * A reusable form for creating or editing a user.
 *
 * - If a `user` prop is provided, the form enters **edit mode**
 *   and pre-fills the inputs with the existing user data.
 *
 * - If no `user` is provided, the form creates a new user.
 *
 * API behavior:
 * - Create → POST /api/users
 * - Edit → PUT /api/users/:id
 *
 * Props:
 * - user?: User               // existing user to edit
 * - onSuccess?: () => void    // called when save succeeds
 * - onCancel?: () => void     // called when cancel button clicked
 */

import { useEffect, useState } from "react";
import Button from "../buttons/Button";
import type { User } from "../../../types/user";

interface UserModalProps {
  user?: User;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type FormData = {
  username: string;
  password: string;
  role: "MEMBER" | "ADMIN";
};

export default function UserModal({
  user,
  onSuccess,
  onCancel,
}: UserModalProps) {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    role: "MEMBER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: "",
        role: user.role,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const isEditing = !!user;

      const response = await fetch(
        `/api/users${isEditing ? `/${user.id}` : ""}`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `Failed to ${isEditing ? "edit" : "create"} user`
        );
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isEditing = !!user;

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 space-y-4">
      <h3 className="text-lg font-semibold">
        {isEditing ? "Edit User" : "Create New User"}
      </h3>

      {error && (
        <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-300 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-stone-800/50 border border-stone-700 rounded-lg focus:outline-none focus:border-stone-500"
            placeholder="Enter username"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            {isEditing
              ? "New Password (leave blank to keep current)"
              : "Password"}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!isEditing}
            className="w-full px-3 py-2 bg-stone-800/50 border border-stone-700 rounded-lg focus:outline-none focus:border-stone-500"
            placeholder={
              isEditing ? "Leave blank to keep password" : "Enter password"
            }
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-stone-800/50 border border-stone-700 rounded-lg focus:outline-none focus:border-stone-500"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            className="w-full"
            disabled={loading}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
            ? "Save Changes"
            : "Create User"}
        </Button>
      </div>
    </form>
  );
}
