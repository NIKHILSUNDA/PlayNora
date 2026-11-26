"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { setUnauthorizedHandler } from "@/services/admin/http";
import { authApi } from "@/services/admin";
import type { SessionUser } from "@/types/admin";

type Status = "loading" | "authenticated" | "unauthenticated" | "forbidden";
interface Ctx { user: SessionUser | null; status: Status; login: (email: string, password: string) => Promise<string | null>; logout: () => Promise<void> }
const AuthCtx = createContext<Ctx | null>(null);

/**
 * Holds the admin session state for the UI ONLY. The source of truth is the backend: the session
 * cookie is httpOnly and is validated by Spring Boot on every call. A user who edits this state
 * in devtools gains nothing, because every /api/v1/admin/** request is authorised server-side.
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const apply = useCallback((u: SessionUser | null) => {
    setUser(u);
    setStatus(!u ? "unauthenticated" : u.role === "ADMIN" ? "authenticated" : "forbidden");
  }, []);

  useEffect(() => {
    let live = true;
    authApi.me().then((r) => { if (live) apply(r.data); });
    setUnauthorizedHandler(() => apply(null));
    return () => { live = false; setUnauthorizedHandler(null); };
  }, [apply]);

  const login = useCallback(async (email: string, password: string) => {
    const r = await authApi.login(email, password);
    if (r.error || !r.data) return r.error ?? "Sign in failed";
    if (r.data.role !== "ADMIN") { await authApi.logout(); apply(null); return "This account does not have administrator access."; }
    apply(r.data);
    return null;
  }, [apply]);

  const logout = useCallback(async () => { await authApi.logout(); apply(null); }, [apply]);
  const value = useMemo(() => ({ user, status, login, logout }), [user, status, login, logout]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAdminAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return c;
}
