import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../lib/api/auth";
import type { User } from "../types/user";

interface AuthContextType {
  auth: User | null;
  login: (username: string, password: string) => Promise<void>;
  getAuth: () => Promise<void>;
  logout: () => void;
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
