import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext(null);

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");
const TOKEN_KEY = "fieldnotes-auth-token";

async function readResponse(response) {
  const text = await response.text();
  let payload = {};
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }
  if (!response.ok) {
    const details = Array.isArray(payload.errors)
      ? payload.errors.map((item) => item.message).filter(Boolean).join(" ")
      : "";
    throw new Error(payload.message ?? details ?? `Request failed (${response.status})`);
  }
  return payload;
}

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
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      credentials: "include",
      headers,
    });
    const payload = await readResponse(response);
    const profile = getUser(payload);
    if (!profile) throw new Error("The profile response did not include a user.");
    setUser(profile);
    setStatus("authenticated");
    return profile;
  }, []);

  useEffect(() => {
    let active = true;
    const token = window.sessionStorage.getItem(TOKEN_KEY);
    fetch(`${API_BASE_URL}/users/profile`, {
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(readResponse)
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
    const response = await fetch(`${API_BASE_URL}/auth/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const payload = await readResponse(response);
    const token = payload.token ?? payload.accessToken ?? payload.data?.token ?? payload.data?.accessToken;
    if (token) window.sessionStorage.setItem(TOKEN_KEY, token);

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

  const value = useMemo(
    () => ({ user, status, isAuthenticated: status === "authenticated", login, register }),
    [user, status, login, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider.");
  return context;
}
