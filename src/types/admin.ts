/** Admin domain types. Mirrors the contract the Spring Boot DTOs must follow. */

export type Role = "ADMIN" | "USER" | "VENUE_OWNER";
export interface SessionUser { id: string; name: string; email: string; phone?: string; role: Role }

export type AccountStatus = "ACTIVE" | "BLOCKED";
export interface UserAccount {
  id: string; name: string; email: string; phone: string; role: Role; status: AccountStatus;
  joinedAt: string; bookingsCount: number; totalSpent: number;
}

export type VenueStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "REJECTED";
export interface OperatingHours { open: string; close: string } // "HH:mm", 24h
export interface AdminVenue {
  id: string; name: string; location: string; description: string; pricePerHour: number;
  sports: string[]; images: string[]; hours: OperatingHours; status: VenueStatus;
  submittedBy: string; rating: number; reviews: number; createdAt: string;
  bookingsCount: number; revenue: number; rejectionReason?: string;
}
export type VenueInput = Pick<AdminVenue, "name" | "location" | "description" | "pricePerHour" | "sports" | "images" | "hours" | "status">;

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "REFUNDED";
export interface AdminBooking {
  id: string; reference: string; userId: string; userName: string; userEmail: string;
  venueId: string; venueName: string; sport: string; date: string; slot: string; amount: number;
  status: BookingStatus; paymentStatus: PaymentStatus; createdAt: string; cancelReason?: string;
}

export type TransactionStatus = "SUCCESS" | "PENDING" | "FAILED" | "REFUNDED";
export type PaymentMethod = "UPI" | "Card" | "Net Banking" | "Wallet";
export interface Transaction {
  id: string; bookingId: string; bookingRef: string; userName: string; userEmail: string;
  amount: number; currency: "INR"; method: PaymentMethod; status: TransactionStatus;
  razorpayOrderId: string; razorpayPaymentId: string | null;
  refundId: string | null; refundAmount: number | null; failureReason: string | null; createdAt: string;
}
interface Tally { count: number; amount: number }
export interface TransactionSummary { success: Tally; pending: Tally; failed: Tally; refunded: Tally }

export type SportStatus = "ACTIVE" | "INACTIVE";
export interface SportRecord { id: string; name: string; slug: string; description: string; image: string; status: SportStatus; venuesCount: number }
export type SportInput = Pick<SportRecord, "name" | "slug" | "description" | "image" | "status">;

export interface SeriesPoint { label: string; value: number }
export interface AdminStats {
  totals: { users: number; venues: number; bookings: number; todayBookings: number; revenue: number; pending: number; completed: number; cancelled: number };
  revenueSeries: SeriesPoint[];
  bookingTrend: SeriesPoint[];
  popularSports: SeriesPoint[];
  growth: { label: string; users: number; venues: number }[];
}

export interface ReportQuery { from: string; to: string } // YYYY-MM-DD, inclusive
export interface VenuePerformance { venueId: string; name: string; bookings: number; revenue: number; occupancy: number }
export interface AdminReport {
  totals: { revenue: number; bookings: number; newUsers: number; avgBookingValue: number; cancellationRate: number };
  timeline: { label: string; revenue: number; bookings: number; newUsers: number }[];
  popularSports: SeriesPoint[];
  venuePerformance: VenuePerformance[];
}

export interface PlatformSettings { platformName: string; supportEmail: string; platformFee: number; cancellationWindowHours: number; maxAdvanceBookingDays: number; maintenanceMode: boolean }
export interface NotificationPrefs { newBooking: boolean; cancellation: boolean; paymentFailure: boolean; venueSubmission: boolean; dailySummary: boolean }
export interface AdminSettings { platform: PlatformSettings; notifications: NotificationPrefs }

/** Paged list contract. `page` is 1-based. */
export interface Page<T> { items: T[]; total: number; page: number; pageSize: number }
export interface ListQuery {
  page: number; pageSize: number; search?: string; sort?: string; dir?: "asc" | "desc";
  [filter: string]: string | number | undefined;
}
