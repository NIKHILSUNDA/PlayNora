"use client";
import { Ban } from "lucide-react";
import { DetailRow, DetailSection } from "@/components/admin/ui/DetailList";
import Modal from "@/components/admin/ui/Modal";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import { fmtDate, fmtDateTime, inr } from "@/lib/format";
import { cancelBlockReason } from "@/lib/rules";
import type { AdminBooking } from "@/types/admin";

export default function BookingDrawer({ booking, onClose, onCancel }: { booking: AdminBooking | null; onClose: () => void; onCancel: (b: AdminBooking) => void }) {
  const b = booking, blocked = b ? cancelBlockReason(b) : null;
  return (
    <Modal open={!!b} variant="drawer" title={b ? `Booking ${b.reference}` : ""} onClose={onClose} footer={b && <button className="adm-btn-danger" disabled={!!blocked} title={blocked ?? undefined} onClick={() => onCancel(b)}><Ban size={14} aria-hidden="true" />{blocked ?? "Cancel booking"}</button>}>
      {b && <>
        <div className="mb-6 flex flex-wrap gap-2"><StatusBadge status={b.status} /><StatusBadge status={b.paymentStatus} label={`Payment: ${b.paymentStatus.toLowerCase()}`} /></div>
        <DetailSection title="Booking"><DetailRow label="Reference">{b.reference}</DetailRow><DetailRow label="Created">{fmtDateTime(b.createdAt)}</DetailRow><DetailRow label="Sport">{b.sport}</DetailRow></DetailSection>
        <DetailSection title="Schedule"><DetailRow label="Venue">{b.venueName}</DetailRow><DetailRow label="Date">{fmtDate(b.date)}</DetailRow><DetailRow label="Time slot">{b.slot} (1 hour)</DetailRow></DetailSection>
        <DetailSection title="Customer"><DetailRow label="Name">{b.userName}</DetailRow><DetailRow label="Email">{b.userEmail}</DetailRow></DetailSection>
        <DetailSection title="Payment"><DetailRow label="Amount">{inr(b.amount)}</DetailRow><DetailRow label="Payment status"><StatusBadge status={b.paymentStatus} /></DetailRow></DetailSection>
        {b.cancelReason && <DetailSection title="Cancellation"><DetailRow label="Reason">{b.cancelReason}</DetailRow></DetailSection>}
      </>}
    </Modal>
  );
}
