import { API_BASE, API_PREFIX, ENDPOINTS } from "@/config/api";
import type { ApiResponse } from "@/types";

type Query = Record<string, string | number | boolean | null | undefined>;
interface Opts { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: unknown; form?: FormData; query?: Query }

/** Called when the API answers 401/403 on an authenticated call, so the UI can drop the session. */
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: (() => void) | null) => { onUnauthorized = fn; };

const AUTH_PATHS: string[] = [ENDPOINTS.login, ENDPOINTS.me];

function qs(q?: Query) {
  const p = new URLSearchParams();
  Object.entries(q ?? {}).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== "" && v !== "all") p.set(k, String(v)); });
  const s = p.toString();
  return s ? `?${s}` : "";
}

/**
 * Thin fetch wrapper that always resolves to the project-wide `{ data, error }` contract.
 * Auth is a backend-issued httpOnly session cookie (credentials: "include"); no token is ever
 * read, stored or sent by this code. X-Requested-With is a CSRF defence-in-depth header.
 */
export async function http<T>(path: string, o: Opts = {}): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${API_PREFIX}${path}${qs(o.query)}`, {
      method: o.method ?? "GET",
      credentials: "include",
      headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest", ...(o.body !== undefined ? { "Content-Type": "application/json" } : {}) },
      body: o.form ?? (o.body !== undefined ? JSON.stringify(o.body) : undefined),
    });
    const json = (await res.json().catch(() => null)) as { data?: T; error?: string | null } | null;
    if (!res.ok) {
      if ((res.status === 401 || res.status === 403) && !AUTH_PATHS.includes(path)) onUnauthorized?.();
      return { data: null, error: json?.error ?? (res.status === 403 ? "You do not have permission to do that" : `Request failed (${res.status})`) };
    }
    if (json && "data" in json) return { data: (json.data ?? null) as T | null, error: json.error ?? null };
    return { data: (json as unknown as T) ?? null, error: null };
  } catch {
    return { data: null, error: "Could not reach the server. Check your connection and try again." };
  }
}
