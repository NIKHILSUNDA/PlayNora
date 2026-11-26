import { ENDPOINTS, SESSION_COOKIE, USE_MOCK } from "@/config/api";
import type { ApiResponse } from "@/types";
import type { SessionUser } from "@/types/admin";
import { http } from "./http";
import { profile } from "./mock/db";

/**
 * Production: Spring Boot validates credentials and sets an httpOnly, Secure, SameSite cookie.
 * This code never sees, stores or sends a token. localStorage/sessionStorage are never used.
 *
 * Mock (dev only): if NEXT_PUBLIC_MOCK_ADMIN_EMAIL/PASSWORD are set in .env.local only that login works; otherwise any email with a password of 8+ chars and sets a non-sensitive
 * placeholder cookie so the middleware hint and route guard can be exercised. NO credential
 * is hardcoded and the mock cannot run in a production build (see config/api.ts).
 */
const mockCookie = (on: boolean) => { if (SESSION_COOKIE) document.cookie = `${SESSION_COOKIE}=${on ? "dev-mock" : ""}; path=/; SameSite=Lax${on ? "" : "; Max-Age=0"}`; };
const mockActive = () => SESSION_COOKIE ? document.cookie.split("; ").some((c) => c.startsWith(`${SESSION_COOKIE}=dev-mock`)) : false;
const later = <T>(r: ApiResponse<T>, ms = 450) => new Promise<ApiResponse<T>>((res) => setTimeout(() => res(r), ms));

export const authApi = {
  login: (email: string, password: string): Promise<ApiResponse<SessionUser>> => {
    if (!USE_MOCK) return http<SessionUser>(ENDPOINTS.login, { method: "POST", body: { email, password } });
    const devEmail = process.env.NEXT_PUBLIC_MOCK_ADMIN_EMAIL, devPass = process.env.NEXT_PUBLIC_MOCK_ADMIN_PASSWORD;
    const valid = devEmail && devPass ? email.toLowerCase() === devEmail.toLowerCase() && password === devPass : email.includes("@") && password.length >= 8;
    if (!valid) return later<SessionUser>({ data: null, error: "Invalid email or password" });
    mockCookie(true);
    return later({ data: { ...profile, email }, error: null });
  },
  me: (): Promise<ApiResponse<SessionUser>> => {
    if (!USE_MOCK) return http<SessionUser>(ENDPOINTS.me);
    return later<SessionUser>(mockActive() ? { data: profile, error: null } : { data: null, error: "Not authenticated" }, 150);
  },
  logout: async (): Promise<void> => {
    if (USE_MOCK) { mockCookie(false); return; }
    await http<null>(ENDPOINTS.logout, { method: "POST" });
  },
};
