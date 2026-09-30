import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, getToken, setToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());

  // Restore session on page load
  useEffect(() => {
    if (!getToken()) return;
    api
      .get("/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password, role) => {
    const d = await api.post("/auth/login", { email, password, role });
    setToken(d.token);
    setUser(d.user);
    return d.user;
  }, []);

  const signup = useCallback(async (payload) => {
    const d = await api.post("/auth/register", payload);
    setToken(d.token);
    setUser(d.user);
    return d.user;
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const d = await api.put("/auth/profile", payload);
    setUser(d.user);
    return d.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAdmin: user?.role === "admin",
    login,
    signup,
    logout,
    updateProfile,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const homePathFor = () => "/dashboard";
