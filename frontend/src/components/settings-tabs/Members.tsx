import { useEffect, useState } from "react";
import Button from "../ui/buttons/Button";
import { TiPlus } from "react-icons/ti";
import type { User } from "../../types/user";
import UserModal from "../ui/modals/UserModal";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useModal } from "../../contexts/ModalContext";
import DeleteUserModal from "../ui/modals/DeleteUserModal";
import { useNavigate } from "react-router-dom";
import { usersApi } from "../../lib/api/users";

export default function Members() {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { auth } = useAuth();
  const { addModal, closeModal } = useModal();

  useEffect(() => {
    setLoading(true);
    usersApi
      .getUsers()
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center max-w-400 space-y-4 mb-4">
        <h2>Member List</h2>
        <Button
          className="flex items-center space-x-1"
          onClick={() =>
            addModal(
              <UserModal
                onCancel={closeModal}
                onSuccess={(user: User) => {
                  closeModal();
                  setMembers([...members, user]);
                }}
              />,
            )
          }
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
                      {auth?.role === "ADMIN" && (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() =>
                              auth.username === member.username
                                ? navigate("/profile")
                                : addModal(
                                    <UserModal
                                      user={member}
                                      onCancel={closeModal}
                                      onSuccess={(user: User) => {
                                        closeModal();
                                        setMembers((prev) =>
                                          prev.map((m) =>
                                            m.id === user.id ? user : m,
                                          ),
                                        );
                                        toast("User updated!");
                                      }}
                                    />,
                                  )
                            }
                            className="p-2 text-stone-400 hover:text-rose-500 transition-colors"
                          >
                            <FiEdit2 className="text-lg" />
                          </button>
                          {auth.username !== member.username && (
                            <button
                              onClick={() =>
                                addModal(
                                  <DeleteUserModal
                                    user={member}
                                    onCancel={closeModal}
                                    onSuccess={() => {
                                      closeModal();
                                      toast("User deleted successfully");
                                      setMembers((prev) =>
                                        prev.filter(
                                          (m) => m.username !== member.username,
                                        ),
                                      );
                                    }}
                                  />,
                                )
                              }
                              className="p-2 text-stone-400 hover:text-rose-500 transition-colors"
                            >
                              <FiTrash2 className="text-lg" />
                            </button>
                          )}
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
