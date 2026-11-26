import { ENDPOINTS, USE_MOCK } from "@/config/api";
import type { AdminBooking, AdminReport, AdminSettings, AdminStats, AdminVenue, ListQuery, Page, ReportQuery, SessionUser, SportInput, SportRecord, Transaction, TransactionSummary, UserAccount, VenueInput, AccountStatus, SportStatus, VenueStatus } from "@/types/admin";
import { http } from "./http";
import * as m from "./mock/api";

/**
 * Admin API service layer. UI code calls ONLY these functions.
 * Every function resolves to `{ data, error }` and never throws.
 * Mock vs real is decided here, once, by USE_MOCK (dev only).
 */
const id = encodeURIComponent;
const U = ENDPOINTS;

export { authApi } from "./auth";

export const statsApi = {
  get: () => (USE_MOCK ? m.mockStats() : http<AdminStats>(U.stats)),
};

export const reportsApi = {
  get: (q: ReportQuery) => (USE_MOCK ? m.mockReport(q) : http<AdminReport>(U.reports, { query: { ...q } })),
};

export const usersApi = {
  list: (q: ListQuery) => (USE_MOCK ? m.mockUsers.list(q) : http<Page<UserAccount>>(U.users, { query: q })),
  get: (uid: string) => (USE_MOCK ? m.mockUsers.get(uid) : http<UserAccount>(`${U.users}/${id(uid)}`)),
  setStatus: (uid: string, status: AccountStatus) => (USE_MOCK ? m.mockUsers.setStatus(uid, status) : http<UserAccount>(`${U.users}/${id(uid)}/status`, { method: "PATCH", body: { status } })),
  bookings: (uid: string) => (USE_MOCK ? m.mockUsers.bookings(uid) : http<AdminBooking[]>(`${U.users}/${id(uid)}/bookings`)),
};

export const venuesApi = {
  list: (q: ListQuery) => (USE_MOCK ? m.mockVenues.list(q) : http<Page<AdminVenue>>(U.venues, { query: q })),
  create: (v: VenueInput) => (USE_MOCK ? m.mockVenues.create(v) : http<AdminVenue>(U.venues, { method: "POST", body: v })),
  update: (vid: string, v: VenueInput) => (USE_MOCK ? m.mockVenues.update(vid, v) : http<AdminVenue>(`${U.venues}/${id(vid)}`, { method: "PUT", body: v })),
  /** Approve = ACTIVE, reject = REJECTED (+reason), (de)activate = ACTIVE/INACTIVE. */
  setStatus: (vid: string, status: VenueStatus, reason?: string) => (USE_MOCK ? m.mockVenues.setStatus(vid, status, reason) : http<AdminVenue>(`${U.venues}/${id(vid)}/status`, { method: "PATCH", body: { status, reason } })),
  remove: (vid: string) => (USE_MOCK ? m.mockVenues.remove(vid) : http<null>(`${U.venues}/${id(vid)}`, { method: "DELETE" })),
  uploadImage: (file: File) => {
    if (USE_MOCK) return m.mockVenues.uploadImage(file);
    const form = new FormData(); form.append("file", file);
    return http<{ url: string }>(U.venueImages, { method: "POST", form });
  },
};

export const bookingsApi = {
  list: (q: ListQuery) => (USE_MOCK ? m.mockBookings.list(q) : http<Page<AdminBooking>>(U.bookings, { query: q })),
  get: (bid: string) => (USE_MOCK ? m.mockBookings.get(bid) : http<AdminBooking>(`${U.bookings}/${id(bid)}`)),
  cancel: (bid: string, reason: string) => (USE_MOCK ? m.mockBookings.cancel(bid, reason) : http<AdminBooking>(`${U.bookings}/${id(bid)}/cancel`, { method: "POST", body: { reason } })),
};

export const transactionsApi = {
  list: (q: ListQuery) => (USE_MOCK ? m.mockTransactions.list(q) : http<Page<Transaction>>(U.transactions, { query: q })),
  get: (tid: string) => (USE_MOCK ? m.mockTransactions.get(tid) : http<Transaction>(`${U.transactions}/${id(tid)}`)),
  summary: () => (USE_MOCK ? m.mockTransactions.summary() : http<TransactionSummary>(U.transactionSummary)),
};

export const sportsApi = {
  /** Admin needs inactive sports too; the backend must only honour includeInactive for ADMIN. */
  list: () => (USE_MOCK ? m.mockSports.list() : http<SportRecord[]>(U.sports, { query: { includeInactive: true } })),
  create: (s: SportInput) => (USE_MOCK ? m.mockSports.create(s) : http<SportRecord>(U.sports, { method: "POST", body: s })),
  update: (sid: string, s: SportInput) => (USE_MOCK ? m.mockSports.update(sid, s) : http<SportRecord>(`${U.sports}/${id(sid)}`, { method: "PUT", body: s })),
  setStatus: (sid: string, status: SportStatus) => (USE_MOCK ? m.mockSports.setStatus(sid, status) : http<SportRecord>(`${U.sports}/${id(sid)}/status`, { method: "PATCH", body: { status } })),
};

export const settingsApi = {
  get: () => (USE_MOCK ? m.mockSettings.get() : http<AdminSettings>(U.settings)),
  update: (patch: Partial<AdminSettings>) => (USE_MOCK ? m.mockSettings.update(patch) : http<AdminSettings>(U.settings, { method: "PATCH", body: patch })),
  profile: () => (USE_MOCK ? m.mockSettings.profile() : http<SessionUser>(U.profile)),
  updateProfile: (p: { name: string; email: string; phone: string }) => (USE_MOCK ? m.mockSettings.updateProfile(p) : http<SessionUser>(U.profile, { method: "PUT", body: p })),
  /** Password is sent over TLS to the backend and never stored client-side. */
  changePassword: (currentPassword: string, newPassword: string) => (USE_MOCK ? m.mockSettings.changePassword(currentPassword, newPassword) : http<null>(U.changePassword, { method: "POST", body: { currentPassword, newPassword } })),
};
