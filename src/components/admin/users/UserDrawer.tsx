"use client";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { DetailRow, DetailSection } from "@/components/admin/ui/DetailList";
import Modal from "@/components/admin/ui/Modal";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import { EmptyState, ErrorState, Skeleton } from "@/components/admin/ui/States";
import { useAsync } from "@/hooks/useAdminData";
import { fmtDate, initials, inr } from "@/lib/format";
import { usersApi } from "@/services/admin";
import type { UserAccount } from "@/types/admin";

function History({ userId }: { userId: string }) {
  const h = useAsync(() => usersApi.bookings(userId), [userId]);
  if (h.loading) return <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12" />)}</div>;
  if (h.error) return <ErrorState message={h.error} onRetry={h.reload} />;
  if (!h.data?.length) return <EmptyState title="No bookings yet" hint="This user has not made any bookings." />;
  return <ul className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">{h.data.map((b) => <li key={b.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"><div className="min-w-0"><p className="truncate font-semibold">{b.venueName}</p><p className="text-xs text-white/50">{b.reference} · {fmtDate(b.date)} · {b.slot}</p></div><div className="flex shrink-0 flex-col items-end gap-1"><span className="font-semibold">{inr(b.amount)}</span><StatusBadge status={b.status} /></div></li>)}</ul>;
}

export default function UserDrawer({ user, onClose, onToggle }: { user: UserAccount | null; onClose: () => void; onToggle: (u: UserAccount) => void }) {
  const blocked = user?.status === "BLOCKED";
  return (
    <Modal open={!!user} variant="drawer" title="User profile" onClose={onClose} footer={user && <button className={blocked ? "adm-btn-primary" : "adm-btn-danger"} onClick={() => onToggle(user)}>{blocked ? <><ShieldCheck size={14} aria-hidden="true" />Unblock account</> : <><ShieldOff size={14} aria-hidden="true" />Block account</>}</button>}>
      {user && <>
        <div className="mb-6 flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet to-pink-500 text-lg font-extrabold">{initials(user.name)}</span><div><p className="text-lg font-extrabold">{user.name}</p><div className="mt-1"><StatusBadge status={user.status} /></div></div></div>
        <DetailSection title="Contact"><DetailRow label="Email">{user.email}</DetailRow><DetailRow label="Phone">{user.phone}</DetailRow></DetailSection>
        <DetailSection title="Account"><DetailRow label="Joined">{fmtDate(user.joinedAt)}</DetailRow><DetailRow label="Total bookings">{user.bookingsCount}</DetailRow><DetailRow label="Total spent">{inr(user.totalSpent)}</DetailRow></DetailSection>
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-white/45">Booking history</h3>
        <History userId={user.id} />
      </>}
    </Modal>
  );
}
