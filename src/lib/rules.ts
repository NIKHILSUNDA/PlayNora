import type { AdminBooking } from "@/types/admin";

/**
 * UX-level rule for the Cancel button. The backend is the authority and must re-check
 * (state machine + refund eligibility) before cancelling.
 */
export function cancelBlockReason(b: AdminBooking): string | null {
  if (b.status === "CANCELLED") return "Already cancelled";
  if (b.status === "COMPLETED") return "Completed bookings cannot be cancelled";
  return null;
}
