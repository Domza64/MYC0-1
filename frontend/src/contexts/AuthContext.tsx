import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../lib/api/auth";
import type { User } from "../types/user";

interface AuthContextType {
  auth: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setAuth: (user: User | null) => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const clearError = () => setError(null);

  useEffect(() => {
    getAuth().finally(() => {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    });
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);

    authApi
      .login(username, password)
      .then((data) => {
        setAuth(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setAuth(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getAuth = async (): Promise<void> => {
    authApi
      .getUserData()
      .then((data) => {
        setAuth(data);
      })
      .catch(() => {
        setAuth(null);
      });
  };

  const logout = (): void => {
    authApi.logout().then(() => {
      setAuth(null);
    });
  };

  return (
    <AuthContext.Provider
      value={{ auth, login, logout, loading, error, clearError, setAuth }}
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
