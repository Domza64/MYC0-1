import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthState {
  username: string | null;
}

interface AuthContextType {
  auth: AuthState;
  login: (username: string, password: string) => Promise<void>;
  getAuth: () => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const initialState: AuthState = {
  username: null,
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Call getAuth on component mount
  useEffect(() => {
    getAuth().finally(() => {
      setLoading(false);
      // Timeout will be used so that app logo displays for at least 1 second when app isloading
      /*setTimeout(() => {
        setLoading(false);
      }, 1000);*/
    });
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuth({ username: data.username });
        setError(null);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Login failed" }));
        throw new Error(errorData.message || "Failed to create session");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAuth = async (): Promise<void> => {
    try {
      const response = await fetch("/api/auth/whoami");
      if (response.ok) {
        const data = await response.json();
        setAuth({ username: data.username });
      } else {
        setAuth({ username: null });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setAuth({ username: null });
    }
  };

  const logout = (): void => {
    setAuth({ username: null });
    try {
      fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ auth, login, getAuth, logout, loading, error, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
