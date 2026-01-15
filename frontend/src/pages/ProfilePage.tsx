import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MdModeEditOutline } from "react-icons/md";
import { usersApi } from "../lib/api/users";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { logout, auth, setAuth } = useAuth();
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //const [oldPassword, setOldPassword] = useState("");

  const handleUsernameChange = () => {
    if (auth === null) return;
    usersApi
      .updateUser({ id: auth.id, username: newUsername })
      .then(setAuth)
      .finally(() => {
        setEditingUsername(false);
      });
  };

  const handlePasswordChange = () => {
    if (auth === null) return;
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    usersApi
      .updateUser({ id: auth.id, password: newPassword })
      .then(setAuth)
      .finally(() => {
        setNewPassword("");
        setConfirmPassword("");
      });
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex gap-4 items-center">
        <div className="rounded-full overflow-hidden">
          {auth?.user_image ? (
            <img
              src={"/images/" + auth.user_image}
              alt=""
              className="w-24 h-24 object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-stone-500 text-black font-semibold flex justify-center items-center text-6xl">
              {auth?.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{auth?.username}</h1>
          <span
            className={`items-center px-3 py-1 rounded-full text-xs font-medium ${
              auth?.role === "ADMIN"
                ? "bg-rose-500/20 text-rose-600"
                : "bg-stone-500/20 text-stone-300"
            }`}
          >
            {auth?.role}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Username</h2>
        {editingUsername ? (
          <div className="space-y-3">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="New username"
              className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg focus:outline-none focus:border-stone-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handleUsernameChange}
                disabled={!newUsername}
                className="px-4 py-2 disabled:cursor-not-allowed cursor-grab disabled:bg-stone-800/50 bg-stone-800 border border-stone-700 rounded-lg hover:bg-stone-800 transition-colors"
              >
                Change
              </button>
              <button
                onClick={() => setEditingUsername(false)}
                className="px-4 py-2 bg-stone-800 border border-stone-700 rounded-lg hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-stone-300">{auth?.username}</span>
            <button
              onClick={() => setEditingUsername(true)}
              className="p-1 hover:text-stone-300 transition-colors"
            >
              <MdModeEditOutline size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <div className="space-y-3">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg focus:outline-none focus:border-stone-500"
          />
          {newPassword.length > 0 && (
            <>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg focus:outline-none focus:border-stone-500"
              />
              {/*<input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Old password"
                className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg focus:outline-none focus:border-stone-500"
              />*/}
              <button
                onClick={handlePasswordChange}
                disabled={
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword
                }
                className="px-4 disabled:cursor-not-allowed py-2 cursor-grab disabled:bg-stone-800/50 bg-stone-800 border border-stone-700 rounded-lg hover:bg-stone-800 transition-colors"
              >
                Change Password
              </button>
            </>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold">Logout</h2>
        <button
          onClick={logout}
          className="border-stone-600 border hover:scale-105 bg-stone-800 px-2 py-1 rounded text-stone-300 cursor-pointer transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
