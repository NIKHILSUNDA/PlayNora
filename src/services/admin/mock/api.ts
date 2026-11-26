/** TEMPORARY mock handlers mirroring the real endpoints. Only reachable when USE_MOCK is true. */
import { addDays, toDateStr } from "@/lib/format";
import type { ApiResponse } from "@/types";
import type { AdminBooking, AdminReport, AdminSettings, AdminStats, AdminVenue, ListQuery, Page, ReportQuery, SeriesPoint, SportInput, SportRecord, Transaction, TransactionSummary, UserAccount, VenueInput } from "@/types/admin";
import * as db from "./db";

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const ok = <T>(data: T, ms = 280): Promise<ApiResponse<T>> => new Promise((r) => setTimeout(() => r({ data: clone(data), error: null }), ms));
const fail = <T>(error: string): Promise<ApiResponse<T>> => new Promise((r) => setTimeout(() => r({ data: null, error }), 200));

interface Cfg<T> { search?: (t: T) => string; filters?: Record<string, (t: T, v: string) => boolean>; sorters?: Record<string, (t: T) => string | number>; defaultSort?: string }
function paginate<T>(all: T[], q: ListQuery, cfg: Cfg<T>): Page<T> {
  let rows = all;
  const s = q.search?.trim().toLowerCase();
  if (s) rows = rows.filter((t) => (cfg.search?.(t) ?? "").toLowerCase().includes(s));
  for (const [k, fn] of Object.entries(cfg.filters ?? {})) { const v = q[k]; if (v !== undefined && v !== "" && v !== "all") rows = rows.filter((t) => fn(t, String(v))); }
  const get = cfg.sorters?.[q.sort ?? cfg.defaultSort ?? ""];
  if (get) { const d = q.dir === "asc" ? 1 : -1; rows = [...rows].sort((a, b) => { const x = get(a), y = get(b); return (x < y ? -1 : x > y ? 1 : 0) * d; }); }
  const start = (q.page - 1) * q.pageSize;
  return { items: rows.slice(start, start + q.pageSize), total: rows.length, page: q.page, pageSize: q.pageSize };
}
const inRange = (d: string, from?: string, to?: string) => (!from || d >= from) && (!to || d <= to);
const day = (iso: string) => toDateStr(new Date(iso));
const monthLabel = (d: Date) => d.toLocaleString("en-IN", { month: "short" });
const dayLabel = (d: Date) => `${d.getDate()} ${monthLabel(d)}`;

export const mockUsers = {
  list: (q: ListQuery) => ok(paginate(db.users, q, { search: (u) => `${u.name} ${u.email} ${u.phone}`, filters: { status: (u, v) => u.status === v }, sorters: { name: (u) => u.name, joinedAt: (u) => u.joinedAt, bookingsCount: (u) => u.bookingsCount, totalSpent: (u) => u.totalSpent }, defaultSort: "joinedAt" })),
  get: (id: string) => { const u = db.users.find((x) => x.id === id); return u ? ok(u) : fail<UserAccount>("User not found"); },
  setStatus: (id: string, status: UserAccount["status"]) => { const u = db.users.find((x) => x.id === id); if (!u) return fail<UserAccount>("User not found"); u.status = status; return ok(u); },
  bookings: (id: string) => ok(db.bookings.filter((b) => b.userId === id).sort((a, b) => b.date.localeCompare(a.date))),
};

export const mockVenues = {
  list: (q: ListQuery) => ok(paginate(db.venues, q, { search: (v) => `${v.name} ${v.location}`, filters: { status: (v, s) => v.status === s, sport: (v, s) => v.sports.includes(s) }, sorters: { name: (v) => v.name, pricePerHour: (v) => v.pricePerHour, createdAt: (v) => v.createdAt, bookingsCount: (v) => v.bookingsCount, revenue: (v) => v.revenue }, defaultSort: "createdAt" })),
  create: (i: VenueInput) => { const v: AdminVenue = { ...i, id: `v_${Date.now()}`, submittedBy: "Admin", rating: 0, reviews: 0, createdAt: new Date().toISOString(), bookingsCount: 0, revenue: 0 }; db.venues.unshift(v); return ok(v); },
  update: (id: string, i: VenueInput) => { const v = db.venues.find((x) => x.id === id); if (!v) return fail<AdminVenue>("Venue not found"); Object.assign(v, i); return ok(v); },
  setStatus: (id: string, status: AdminVenue["status"], reason?: string) => { const v = db.venues.find((x) => x.id === id); if (!v) return fail<AdminVenue>("Venue not found"); v.status = status; v.rejectionReason = status === "REJECTED" ? reason : undefined; return ok(v); },
  remove: (id: string) => { const n = db.venues.findIndex((x) => x.id === id); if (n < 0) return fail<null>("Venue not found"); db.venues.splice(n, 1); return ok(null); },
  uploadImage: (file: File) => ok({ url: URL.createObjectURL(file) }, 400), // real API returns a CDN/storage URL
};

export const mockBookings = {
  list: (q: ListQuery) => ok(paginate(db.bookings, q, { search: (b) => `${b.reference} ${b.userName} ${b.userEmail} ${b.venueName}`, filters: { status: (b, v) => b.status === v, payment: (b, v) => b.paymentStatus === v, sport: (b, v) => b.sport === v, from: (b, v) => b.date >= v, to: (b, v) => b.date <= v }, sorters: { date: (b) => b.date, amount: (b) => b.amount, createdAt: (b) => b.createdAt, reference: (b) => b.reference }, defaultSort: "date" })),
  get: (id: string) => { const b = db.bookings.find((x) => x.id === id); return b ? ok(b) : fail<AdminBooking>("Booking not found"); },
  cancel: (id: string, reason: string) => {
    const b = db.bookings.find((x) => x.id === id);
    if (!b) return fail<AdminBooking>("Booking not found");
    if (b.status === "CANCELLED" || b.status === "COMPLETED") return fail<AdminBooking>(`A ${b.status.toLowerCase()} booking cannot be cancelled`);
    const t = db.transactions.find((x) => x.bookingId === id);
    if (b.paymentStatus === "PAID") { b.paymentStatus = "REFUNDED"; if (t) { t.status = "REFUNDED"; t.refundAmount = t.amount; t.refundId = `rfnd_${Math.random().toString(36).slice(2, 16)}`; } }
    b.status = "CANCELLED"; b.cancelReason = reason; return ok(b);
  },
};

export const mockTransactions = {
  list: (q: ListQuery) => ok(paginate(db.transactions, q, { search: (t) => `${t.id} ${t.razorpayOrderId} ${t.razorpayPaymentId ?? ""} ${t.bookingRef} ${t.userName} ${t.userEmail}`, filters: { status: (t, v) => t.status === v, method: (t, v) => t.method === v, from: (t, v) => day(t.createdAt) >= v, to: (t, v) => day(t.createdAt) <= v }, sorters: { createdAt: (t) => t.createdAt, amount: (t) => t.amount }, defaultSort: "createdAt" })),
  get: (id: string) => { const t = db.transactions.find((x) => x.id === id); return t ? ok(t) : fail<Transaction>("Transaction not found"); },
  summary: () => {
    const s: TransactionSummary = { success: { count: 0, amount: 0 }, pending: { count: 0, amount: 0 }, failed: { count: 0, amount: 0 }, refunded: { count: 0, amount: 0 } };
    db.transactions.forEach((t) => { const k = t.status.toLowerCase() as keyof TransactionSummary; s[k].count++; s[k].amount += t.amount; });
    return ok(s);
  },
};

export const mockSports = {
  list: () => { db.sports.forEach((s) => { s.venuesCount = db.venues.filter((v) => v.sports.includes(s.name) && (v.status === "ACTIVE" || v.status === "INACTIVE")).length; }); return ok(db.sports); },
  create: (i: SportInput) => { if (db.sports.some((s) => s.slug === i.slug)) return fail<SportRecord>("A sport with this slug already exists"); const s: SportRecord = { ...i, id: `s_${Date.now()}`, venuesCount: 0 }; db.sports.push(s); return ok(s); },
  update: (id: string, i: SportInput) => { const s = db.sports.find((x) => x.id === id); if (!s) return fail<SportRecord>("Sport not found"); if (db.sports.some((x) => x.id !== id && x.slug === i.slug)) return fail<SportRecord>("A sport with this slug already exists"); Object.assign(s, i); return ok(s); },
  setStatus: (id: string, status: SportRecord["status"]) => { const s = db.sports.find((x) => x.id === id); if (!s) return fail<SportRecord>("Sport not found"); s.status = status; return ok(s); },
};

const countBy = (rows: AdminBooking[]): SeriesPoint[] => {
  const m = new Map<string, number>(); rows.forEach((b) => m.set(b.sport, (m.get(b.sport) ?? 0) + 1));
  return [...m].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
};

export const mockStats = () => {
  const today = toDateStr(new Date()), now = new Date();
  const b = db.bookings, paid = b.filter((x) => x.paymentStatus === "PAID");
  const months = Array.from({ length: 6 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - (5 - i), 1));
  const key = (d: Date) => toDateStr(d).slice(0, 7);
  const s: AdminStats = {
    totals: { users: db.users.length, venues: db.venues.filter((v) => v.status === "ACTIVE" || v.status === "INACTIVE").length, bookings: b.length, todayBookings: b.filter((x) => x.date === today).length, revenue: paid.filter((x) => x.date <= today).reduce((a, x) => a + x.amount, 0), pending: b.filter((x) => x.status === "PENDING").length, completed: b.filter((x) => x.status === "COMPLETED").length, cancelled: b.filter((x) => x.status === "CANCELLED").length },
    revenueSeries: months.map((m) => ({ label: monthLabel(m), value: paid.filter((x) => x.date.slice(0, 7) === key(m) && x.date <= today).reduce((a, x) => a + x.amount, 0) })),
    bookingTrend: Array.from({ length: 14 }, (_, i) => { const d = addDays(now, i - 13); return { label: dayLabel(d), value: b.filter((x) => x.date === toDateStr(d) && x.status !== "CANCELLED").length }; }),
    popularSports: countBy(b.filter((x) => x.status !== "CANCELLED")),
    growth: months.map((m) => ({ label: monthLabel(m), users: db.users.filter((u) => day(u.joinedAt).slice(0, 7) === key(m)).length, venues: db.venues.filter((v) => day(v.createdAt).slice(0, 7) === key(m) && v.status !== "REJECTED").length })),
  };
  return ok(s, 450);
};

export const mockReport = ({ from, to }: ReportQuery) => {
  const start = new Date(`${from}T00:00:00`), end = new Date(`${to}T00:00:00`);
  if (isNaN(+start) || isNaN(+end) || start > end) return fail<AdminReport>("Choose a valid date range");
  const spanDays = Math.round((+end - +start) / 86_400_000) + 1, byDay = spanDays <= 62;
  const bk = (d: string) => (byDay ? d : d.slice(0, 7));
  const buckets = new Map<string, { label: string; revenue: number; bookings: number; newUsers: number }>();
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) { const k = bk(toDateStr(d)); if (!buckets.has(k)) buckets.set(k, { label: byDay ? dayLabel(d) : `${monthLabel(d)} ${String(d.getFullYear()).slice(2)}`, revenue: 0, bookings: 0, newUsers: 0 }); }
  const rows = db.bookings.filter((b) => inRange(b.date, from, to));
  rows.forEach((b) => { const x = buckets.get(bk(b.date)); if (x) { x.bookings++; if (b.paymentStatus === "PAID") x.revenue += b.amount; } });
  const newUsers = db.users.filter((u) => inRange(day(u.joinedAt), from, to));
  newUsers.forEach((u) => { const x = buckets.get(bk(day(u.joinedAt))); if (x) x.newUsers++; });
  const paid = rows.filter((b) => b.paymentStatus === "PAID");
  const revenue = paid.reduce((a, b) => a + b.amount, 0);
  const r: AdminReport = {
    totals: { revenue, bookings: rows.length, newUsers: newUsers.length, avgBookingValue: paid.length ? Math.round(revenue / paid.length) : 0, cancellationRate: rows.length ? Math.round((rows.filter((b) => b.status === "CANCELLED").length / rows.length) * 1000) / 10 : 0 },
    timeline: [...buckets.values()],
    popularSports: countBy(rows.filter((b) => b.status !== "CANCELLED")),
    venuePerformance: db.venues.filter((v) => v.status === "ACTIVE" || v.status === "INACTIVE").map((v) => { const vb = rows.filter((b) => b.venueId === v.id); return { venueId: v.id, name: v.name, bookings: vb.length, revenue: vb.filter((b) => b.paymentStatus === "PAID").reduce((a, b) => a + b.amount, 0), occupancy: Math.min(100, Math.round((vb.filter((b) => b.status !== "CANCELLED").length / (spanDays * 4)) * 1000) / 10) }; }).sort((a, b) => b.revenue - a.revenue),
  };
  return ok(r, 450);
};

export const mockSettings = {
  get: () => ok(db.settings),
  update: (patch: Partial<AdminSettings>) => { Object.assign(db.settings.platform, patch.platform); Object.assign(db.settings.notifications, patch.notifications); return ok(db.settings); },
  profile: () => ok(db.profile),
  updateProfile: (p: { name: string; email: string; phone: string }) => { Object.assign(db.profile, p); return ok(db.profile); },
  changePassword: (current: string, next: string) => (!current ? fail<null>("Current password is required") : next.length < 10 ? fail<null>("New password must be at least 10 characters") : ok(null, 500)),
};
