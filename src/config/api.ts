/**
 * Single source of truth for backend configuration.
 * No component or service may hardcode a URL - everything is derived from here.
 */
const trim = (s: string) => s.replace(/\/+$/, "");

/** Empty string = same-origin (use the rewrite proxy in next.config.mjs). */
export const API_BASE = trim(process.env.NEXT_PUBLIC_API_URL ?? "");
export const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX ?? "/api/v1";

/** Cookie name used only for the middleware UX hint. "" disables the hint. */
export const SESSION_COOKIE = process.env.NEXT_PUBLIC_SESSION_COOKIE ?? "pn_session";

/** Dev-only sample data + mock login. Can never be true in a production build. */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true" && process.env.NODE_ENV !== "production";

/**
 * Every endpoint the admin dashboard needs, relative to API_BASE + API_PREFIX.
 * Full contract (params, bodies, responses) is documented in ADMIN_DASHBOARD.md.
 */
export const ENDPOINTS = {
  // --- Authentication (session cookie issued by Spring Boot) ---
  login: "/auth/login",
  logout: "/auth/logout",
  me: "/auth/me",
  changePassword: "/auth/change-password",
  // --- Admin (all require ROLE_ADMIN, enforced server-side) ---
  stats: "/admin/stats",
  reports: "/admin/reports",
  users: "/admin/users",
  venues: "/admin/venues",
  venueImages: "/admin/venues/images",
  bookings: "/admin/bookings",
  transactions: "/admin/transactions",
  transactionSummary: "/admin/transactions/summary",
  profile: "/admin/profile",
  settings: "/admin/settings",
  // --- Shared (reads public, writes ROLE_ADMIN) ---
  sports: "/sports",
} as const;
