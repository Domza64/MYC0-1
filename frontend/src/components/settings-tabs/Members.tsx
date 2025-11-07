import { useEffect, useState } from "react";
import Button from "../ui/buttons/Button";
import { TiPlus } from "react-icons/ti";
import type { User } from "../../types/user";
import Modal from "../layout/Modal";
import CreateUserForm from "../ui/forms/CreateUserForm";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

export default function Members() {
  const { auth } = useAuth();
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [addUserModal, setAddUserModal] = useState(false);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch members");
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (username: string) => {
    if (!confirm(`Are you sure you want to delete user ${username}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${username}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete user");
      }

      toast.success("User deleted successfully");
      fetchMembers();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  // @ts-ignore
  const handleEdit = (user: User) => {
    // TODO: Implement edit functionality
    toast("Soon!");
  };

  return (
    <div>
      {addUserModal && (
        <Modal onClose={() => setAddUserModal(false)}>
          <CreateUserForm
            onCancel={() => setAddUserModal(false)}
            onSuccess={() => {
              setAddUserModal(false);
              toast("User created successfully");
              fetchMembers();
            }}
          />
        </Modal>
      )}
      <div className="flex justify-between items-center max-w-400 space-y-4 mb-4">
        <h2>Member List</h2>
        <Button
          className="flex items-center space-x-1"
          onClick={() => setAddUserModal(true)}
        >
          <TiPlus />
          <span>Create</span>
        </Button>
      </div>
      <div className="bg-stone-900/50 border border-stone-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <span className="text-stone-300">Loading members...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-900/30">
                  <th className="text-left p-4 text-stone-300 font-medium">
                    Username
                  </th>
                  <th className="text-left p-4 text-stone-300 font-medium">
                    Role
                  </th>
                  <th className="text-right p-4 text-stone-300 font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr
                    key={member.username}
                    className={
                      index % 2 === 0 ? "bg-stone-800/30" : "bg-stone-900/10"
                    }
                  >
                    <td className="p-4 text-stone-300 font-medium">
                      {member.username}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          member.role === "ADMIN"
                            ? "bg-rose-500/20 text-rose-600"
                            : "bg-stone-500/20 text-stone-300"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {auth.username !== member.username &&
                        auth.role === "ADMIN" && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(member)}
                              className="p-2 text-stone-400 hover:text-rose-500 transition-colors"
                            >
                              <FiEdit2 className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDelete(member.username)}
                              className="p-2 text-stone-400 hover:text-rose-500 transition-colors"
                            >
                              <FiTrash2 className="text-lg" />
                            </button>
                          </div>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
