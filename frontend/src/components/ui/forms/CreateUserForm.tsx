import { useState } from "react";
import Button from "../buttons/Button";

interface CreateUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateUserForm({
  onSuccess,
  onCancel,
}: CreateUserFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "MEMBER",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create user");
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

  return (
    <form onSubmit={handleSubmit} className="w-full p-6 space-y-4">
      <h3 className="text-lg font-semibold">Create New User</h3>

      {error && (
        <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-300 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
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

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-stone-800/50 border border-stone-700 rounded-lg focus:outline-none focus:border-stone-500"
            placeholder="Enter password"
          />
        </div>

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
          {loading ? "Creating..." : "Create User"}
        </Button>
      </div>
    </form>
  );
}
