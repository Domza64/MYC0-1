import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { logout } = useAuth();
  return (
    <div>
      <h1 className="text-2xl">My Profile</h1>
      <button onClick={logout} className="mt-4 py-2 w-32 bg-rose-500 rounded">
        Logout
      </button>
    </div>
  );
}
