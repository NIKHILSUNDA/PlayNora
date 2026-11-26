"use client";
import CopyButton from "@/components/admin/ui/CopyButton";
import { DetailRow, DetailSection } from "@/components/admin/ui/DetailList";
import Modal from "@/components/admin/ui/Modal";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import { fmtDateTime, inr } from "@/lib/format";
import type { Transaction } from "@/types/admin";

const Ref = ({ v }: { v: string | null }) => v ? <span className="inline-flex items-center gap-1 font-mono text-xs">{v}<CopyButton value={v} /></span> : <span className="text-white/40">Not issued</span>;

export default function TransactionDrawer({ txn, onClose }: { txn: Transaction | null; onClose: () => void }) {
  return (
    <Modal open={!!txn} variant="drawer" title={txn ? `Transaction ${txn.id}` : ""} onClose={onClose}>
      {txn && <>
        <div className="mb-6"><p className="text-3xl font-extrabold">{inr(txn.amount)}</p><div className="mt-2"><StatusBadge status={txn.status} /></div></div>
        <DetailSection title="Razorpay references"><DetailRow label="Order ID"><Ref v={txn.razorpayOrderId} /></DetailRow><DetailRow label="Payment ID"><Ref v={txn.razorpayPaymentId} /></DetailRow></DetailSection>
        <DetailSection title="Transaction"><DetailRow label="Date">{fmtDateTime(txn.createdAt)}</DetailRow><DetailRow label="Method">{txn.method}</DetailRow><DetailRow label="Currency">{txn.currency}</DetailRow></DetailSection>
        <DetailSection title="Booking & customer"><DetailRow label="Booking">{txn.bookingRef}</DetailRow><DetailRow label="Customer">{txn.userName}</DetailRow><DetailRow label="Email">{txn.userEmail}</DetailRow></DetailSection>
        {txn.status === "REFUNDED" && <DetailSection title="Refund"><DetailRow label="Refund ID"><Ref v={txn.refundId} /></DetailRow><DetailRow label="Refunded">{inr(txn.refundAmount ?? 0)}</DetailRow></DetailSection>}
        {txn.failureReason && <DetailSection title="Failure"><DetailRow label="Reason">{txn.failureReason}</DetailRow></DetailSection>}
      </>}
    </Modal>
  );
}
