import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";

export const AuthContext = createContext(null);

function getUser(payload) {
  const user = payload.user ?? payload.data?.user;
  if (user) return user;
  const data = payload.data;
  if (data && (data.id || data._id || data.email)) return data;
  return payload.id || payload._id || payload.email ? payload : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const loadProfile = useCallback(async () => {
    const payload = await api.get("/users/profile");
    const profile = getUser(payload);
    if (!profile) throw new Error("The profile response did not include a user.");
    setUser(profile);
    setStatus("authenticated");
    return profile;
  }, []);

  useEffect(() => {
    let active = true;
    api.get("/users/profile")
      .then((payload) => {
        if (!active) return;
        const profile = getUser(payload);
        setUser(profile);
        setStatus(profile ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setStatus("unauthenticated");
      });
    return () => {
      active = false;
    };
  }, []);

  const authenticate = useCallback(async (endpoint, credentials) => {
    const payload = await api.post(`/auth/${endpoint}`, credentials);
    let authenticatedUser = getUser(payload);
    if (!authenticatedUser) authenticatedUser = await loadProfile();
    else {
      setUser(authenticatedUser);
      setStatus("authenticated");
    }
    return authenticatedUser;
  }, [loadProfile]);

  const login = useCallback((credentials) => authenticate("login", credentials), [authenticate]);
  const register = useCallback((credentials) => authenticate("register", credentials), [authenticate]);
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", {});
    } finally {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = useMemo(
    () => ({ user, status, isAuthenticated: status === "authenticated", login, register, logout }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider.");
  return context;
}
