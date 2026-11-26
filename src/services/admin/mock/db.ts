/**
 * TEMPORARY DEVELOPMENT FALLBACK - sample data used only when NEXT_PUBLIC_USE_MOCK=true.
 * Deterministic (seeded) so screens are stable between reloads; dates are relative to "now".
 * Delete this folder once the Spring Boot APIs are live.
 */
import { SLOTS, VENUES } from "@/data/venues";
import { addDays, toDateStr } from "@/lib/format";
import type { AdminBooking, AdminSettings, AdminVenue, PaymentMethod, SessionUser, SportRecord, Transaction, UserAccount } from "@/types/admin";

let seed = 20260722;
const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const int = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));
const pick = <T>(a: readonly T[]): T => a[Math.floor(rnd() * a.length)]!;
const code = (n: number) => Array.from({ length: n }, () => "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[int(0, 61)]).join("");
const NOW = new Date();
const ago = (days: number) => addDays(NOW, -days);

const FIRST = ["Aarav", "Vivaan", "Aditya", "Rohan", "Arjun", "Karthik", "Ishaan", "Rahul", "Sanjay", "Vikram", "Ananya", "Diya", "Priya", "Meera", "Sneha", "Kavya", "Neha", "Pooja", "Riya", "Ishita"];
const LAST = ["Sharma", "Reddy", "Nair", "Iyer", "Gowda", "Patel", "Shetty", "Rao", "Menon", "Kulkarni", "Singh", "Das"];

export const profile: SessionUser = { id: "admin_1", name: "Platform Admin", email: "admin@playnora.co.in", phone: "+91 80000 00000", role: "ADMIN" };

export const sports: SportRecord[] = [
  { id: "s1", name: "Football", slug: "football", description: "5-a-side and 7-a-side turf football.", image: "/images/sports/football.jpg", status: "ACTIVE", venuesCount: 0 },
  { id: "s2", name: "Box Cricket", slug: "cricket", description: "Net-enclosed box cricket arenas.", image: "/images/sports/cricket.jpg", status: "ACTIVE", venuesCount: 0 },
  { id: "s3", name: "Pickleball", slug: "pickleball", description: "Indoor and outdoor pickleball courts.", image: "/images/sports/pickleball.jpg", status: "ACTIVE", venuesCount: 0 },
  { id: "s5", name: "Padel", slug: "padel", description: "Outdoor padel courts.", image: "/images/sports/padel.jpg", status: "ACTIVE", venuesCount: 0 },
  { id: "s4", name: "Badminton", slug: "badminton", description: "Synthetic and wooden badminton courts. Coming soon.", image: "/images/slider/s4.jpg", status: "INACTIVE", venuesCount: 0 },
];

export const users: UserAccount[] = Array.from({ length: 64 }, (_, i) => {
  const f = pick(FIRST), l = pick(LAST);
  return { id: `u_${i + 1}`, name: `${f} ${l}`, email: `${f}.${l}${i + 1}@example.com`.toLowerCase(), phone: `+91 ${int(70000, 99999)} ${int(10000, 99999)}`, role: "USER", status: i % 13 === 0 ? "BLOCKED" : "ACTIVE", joinedAt: ago(int(1, 270)).toISOString(), bookingsCount: 0, totalSpent: 0 };
});

const mkVenue = (i: number, v: { name: string; location: string; pricePerHour: number; sports: string[]; image: string; rating?: number; reviews?: number }, status: AdminVenue["status"], age: [number, number], extra: Partial<AdminVenue> = {}): AdminVenue => ({
  id: String(i), name: v.name, location: v.location, description: `${v.name} offers floodlit, well-maintained facilities in ${v.location.split(",")[0]}. Changing rooms, drinking water and parking available.`,
  pricePerHour: v.pricePerHour, sports: v.sports, images: [v.image], hours: { open: "06:00", close: "23:00" }, status, submittedBy: status === "PENDING" || status === "REJECTED" ? "Venue partner" : "Admin",
  rating: v.rating ?? 0, reviews: v.reviews ?? 0, createdAt: ago(int(...age)).toISOString(), bookingsCount: 0, revenue: 0, ...extra,
});
export const venues: AdminVenue[] = [
  ...VENUES.map((v, i) => mkVenue(i + 1, v, v.id === "10" ? "INACTIVE" : "ACTIVE", [120, 300])),
  mkVenue(11, { name: "Riverside Turf", location: "Electronic City, Bengaluru", pricePerHour: 1300, sports: ["Football"], image: "/images/venues/v2.jpg" }, "PENDING", [1, 3]),
  mkVenue(12, { name: "Smash Pickleball Arena", location: "Malleshwaram, Bengaluru", pricePerHour: 750, sports: ["Pickleball"], image: "/images/venues/v8.jpg" }, "PENDING", [2, 5]),
  mkVenue(13, { name: "Cage Cricket Co.", location: "Yelahanka, Bengaluru", pricePerHour: 950, sports: ["Box Cricket"], image: "/images/venues/v5.jpg" }, "PENDING", [3, 6]),
  mkVenue(14, { name: "Corner Court", location: "Banashankari, Bengaluru", pricePerHour: 600, sports: ["Pickleball"], image: "/images/venues/v9.jpg" }, "REJECTED", [20, 40], { rejectionReason: "Incomplete safety documentation." }),
];

const live = venues.filter((v) => v.status === "ACTIVE");
const METHODS: PaymentMethod[] = ["UPI", "Card", "Net Banking", "Wallet"];
const FAILS = ["Insufficient funds", "Bank declined the transaction", "Payment timed out", "UPI collect request expired"];

export const bookings: AdminBooking[] = Array.from({ length: 150 }, (_, i) => {
  const v = pick(live), u = pick(users), off = i < 7 ? 0 : int(-3, 120);
  const past = off > 0;
  const status: AdminBooking["status"] = past ? (rnd() < 0.86 ? "COMPLETED" : "CANCELLED") : rnd() < 0.15 ? "CANCELLED" : rnd() < 0.35 ? "PENDING" : "CONFIRMED";
  const paymentStatus: AdminBooking["paymentStatus"] = status === "COMPLETED" || status === "CONFIRMED" ? "PAID" : status === "PENDING" ? (rnd() < 0.7 ? "PENDING" : "FAILED") : rnd() < 0.7 ? "REFUNDED" : "FAILED";
  return { id: `b_${i + 1}`, reference: `PN-${100200 + i}`, userId: u.id, userName: u.name, userEmail: u.email, venueId: v.id, venueName: v.name, sport: pick(v.sports), date: toDateStr(ago(off)), slot: pick(SLOTS), amount: v.pricePerHour + 50, status, paymentStatus, createdAt: ago(off + int(1, 5)).toISOString(), ...(status === "CANCELLED" ? { cancelReason: "Cancelled at customer request" } : {}) };
});

export const transactions: Transaction[] = bookings.map((b, i) => {
  const status: Transaction["status"] = b.paymentStatus === "PAID" ? "SUCCESS" : b.paymentStatus;
  return { id: `txn_${i + 1}`, bookingId: b.id, bookingRef: b.reference, userName: b.userName, userEmail: b.userEmail, amount: b.amount, currency: "INR", method: pick(METHODS), status, razorpayOrderId: `order_${code(14)}`, razorpayPaymentId: status === "PENDING" ? null : `pay_${code(14)}`, refundId: status === "REFUNDED" ? `rfnd_${code(14)}` : null, refundAmount: status === "REFUNDED" ? b.amount : null, failureReason: status === "FAILED" ? pick(FAILS) : null, createdAt: b.createdAt };
});

// Derived counters so list screens agree with each other.
bookings.forEach((b) => {
  const u = users.find((x) => x.id === b.userId), v = venues.find((x) => x.id === b.venueId);
  if (u) { u.bookingsCount++; if (b.paymentStatus === "PAID") u.totalSpent += b.amount; }
  if (v) { v.bookingsCount++; if (b.paymentStatus === "PAID") v.revenue += b.amount; }
});
venues.filter((v) => v.status === "ACTIVE" || v.status === "INACTIVE").forEach((v) => { v.rating = VENUES.find((x) => x.id === v.id)?.rating ?? 0; v.reviews = VENUES.find((x) => x.id === v.id)?.reviews ?? 0; });

export const settings: AdminSettings = {
  platform: { platformName: "PlayNora", supportEmail: "team@playnora.co.in", platformFee: 50, cancellationWindowHours: 24, maxAdvanceBookingDays: 30, maintenanceMode: false },
  notifications: { newBooking: true, cancellation: true, paymentFailure: true, venueSubmission: true, dailySummary: false },
};
