import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login, loading, error, clearError } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setLocalError("Please enter both username and password");
      return;
    }

    await login(username, password);
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      clearError();
      setLocalError(null);
      setter(e.target.value);
    };

  return (
    <div className="min-h-screen bg-stone-950 flex justify-center items-center">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-rose-500/10 blur-3xl rounded-full animate-pulse"
          style={{
            animation: "float 6s ease-in-out infinite",
          }}
        ></div>
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-rose-900/20 blur-3xl rounded-full animate-pulse"
          style={{
            animation: "float 8s ease-in-out infinite",
          }}
        ></div>
      </div>

      {/* Login form */}
      <div className="relative bg-stone-900/10 border border-stone-700/50 rounded-xl mx-4 px-4 py-8 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src="MYC0-1_logo.svg" alt="MYC0-1 Logo" />
        </div>

        {/* Error Message */}
        {(error || localError) && (
          <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-300 text-sm text-center">
            {error || localError}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={handleInputChange(setUsername)}
            placeholder="Enter your username"
            className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-xl placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-white"
            required
          />
          <input
            type="password"
            value={password}
            onChange={handleInputChange(setPassword)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 bg-stone-800/50 border border-stone-700 rounded-xl placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-white"
            required
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full hover:cursor-grab bg-rose-500 hover:bg-rose-600 disabled:bg-stone-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-stone-900"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(10px); }
        }
      `}</style>
    </div>
  );
}
