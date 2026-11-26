"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface AuthUser { name: string; email: string; phone?: string }
interface Ctx { user: AuthUser | null; ready: boolean; login: (u: AuthUser) => void; logout: () => void }
const KEY = "playnora_user";
const AuthCtx = createContext<Ctx | null>(null);

// DEMO AUTH. TODO(auth): replace with FastAPI/Spring JWT + Google OAuth. Passwords are never stored here.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setUser(JSON.parse(raw)); } catch { /* storage unavailable */ }
    setReady(true);
  }, []);
  const login = useCallback((u: AuthUser) => { setUser(u); try { localStorage.setItem(KEY, JSON.stringify(u)); } catch { /* ignore */ } }, []);
  const logout = useCallback(() => { setUser(null); try { localStorage.removeItem(KEY); } catch { /* ignore */ } }, []);
  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready, login, logout]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}
