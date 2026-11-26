"use client";
import { useState } from "react";
import { Ban, Eye } from "lucide-react";
import BookingDrawer from "@/components/admin/bookings/BookingDrawer";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import DataTable, { RowActions, type Column } from "@/components/admin/ui/DataTable";
import { DateRange, FilterBar, FilterSelect } from "@/components/admin/ui/FilterBar";
import PageHeader from "@/components/admin/ui/PageHeader";
import SearchInput from "@/components/admin/ui/SearchInput";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import { useToast } from "@/components/admin/ui/Toast";
import { useList } from "@/hooks/useAdminData";
import { fmtDate, inr } from "@/lib/format";
import { cancelBlockReason } from "@/lib/rules";
import { bookingsApi } from "@/services/admin";
import type { AdminBooking } from "@/types/admin";

const opt = (all: string, vals: string[]) => [{ value: "all", label: all }, ...vals.map((v) => ({ value: v, label: v.charAt(0) + v.slice(1).toLowerCase() }))];

export default function BookingsPage() {
  const toast = useToast();
  const list = useList(bookingsApi.list, { sort: "date", dir: "desc" });
  const [view, setView] = useState<AdminBooking | null>(null);
  const [cancel, setCancel] = useState<AdminBooking | null>(null);

  const doCancel = async (reason: string) => {
    if (!cancel) return;
    const r = await bookingsApi.cancel(cancel.id, reason);
    if (r.error) return toast.error(r.error);
    toast.success(`Booking ${cancel.reference} cancelled`);
    setCancel(null); setView(null); list.reload();
  };
  const cols: Column<AdminBooking>[] = [
    { key: "ref", header: "Reference", sortKey: "reference", render: (b) => <span className="font-semibold">{b.reference}</span> },
    { key: "customer", header: "Customer", render: (b) => <div className="md:min-w-[140px]"><p className="font-medium">{b.userName}</p><p className="text-xs text-white/50">{b.userEmail}</p></div> },
    { key: "venue", header: "Venue", hide: "lg", render: (b) => <div className="md:min-w-[140px]"><p>{b.venueName}</p><p className="text-xs text-white/50">{b.sport}</p></div> },
    { key: "date", header: "Date & slot", sortKey: "date", hide: "md", render: (b) => <div className="whitespace-nowrap"><p>{fmtDate(b.date)}</p><p className="text-xs text-white/50">{b.slot}</p></div> },
    { key: "amount", header: "Amount", sortKey: "amount", hide: "md", render: (b) => <span className="font-semibold">{inr(b.amount)}</span> },
    { key: "status", header: "Status", render: (b) => <StatusBadge status={b.status} /> },
    { key: "payment", header: "Payment", hide: "md", render: (b) => <StatusBadge status={b.paymentStatus} /> },
    { key: "actions", header: "", align: "right", render: (b) => { const why = cancelBlockReason(b); return <RowActions><button className="adm-icon-btn" aria-label={`View ${b.reference}`} title="View details" onClick={() => setView(b)}><Eye size={16} /></button><button className="adm-icon-btn hover:!text-red-300" aria-label={`Cancel ${b.reference}`} title={why ?? "Cancel booking"} disabled={!!why} onClick={() => setCancel(b)}><Ban size={16} /></button></RowActions>; } },
  ];

  return (
    <>
      <PageHeader title="Booking" accent="management" description="Track every reservation, its payment, and cancel where policy allows." />
      <FilterBar>
        <SearchInput value={list.query.search ?? ""} onChange={(v) => list.patch({ search: v })} placeholder="Search reference, customer, venue" />
        <FilterSelect label="Booking status" value={String(list.query.status ?? "all")} onChange={(v) => list.patch({ status: v })} options={opt("All statuses", ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"])} />
        <FilterSelect label="Payment status" value={String(list.query.payment ?? "all")} onChange={(v) => list.patch({ payment: v })} options={[{ value: "all", label: "All payments" }, ...["PAID", "PENDING", "FAILED", "REFUNDED"].map((v) => ({ value: v, label: v.charAt(0) + v.slice(1).toLowerCase() }))]} />
        <FilterSelect label="Sport" value={String(list.query.sport ?? "all")} onChange={(v) => list.patch({ sport: v })} options={[{ value: "all", label: "All sports" }, ...["Football", "Box Cricket", "Pickleball", "Padel"].map((s) => ({ value: s, label: s }))]} />
        <DateRange from={String(list.query.from ?? "")} to={String(list.query.to ?? "")} onChange={(r) => list.patch({ from: r.from, to: r.to })} />
      </FilterBar>
      <DataTable columns={cols} rows={list.items} rowKey={(b) => b.id} loading={list.loading} error={list.error} onRetry={list.reload} page={list.query.page} pageSize={list.query.pageSize} total={list.total} onPage={list.setPage} onPageSize={(n) => list.patch({ pageSize: n })} sort={list.query.sort} dir={list.query.dir} onSort={list.toggleSort} onRowClick={setView} empty={{ title: "No bookings match", hint: "Try a different search, status or date range." }} />
      <BookingDrawer booking={view} onClose={() => setView(null)} onCancel={setCancel} />
      <ConfirmDialog open={!!cancel} title={`Cancel booking ${cancel?.reference ?? ""}`} message="The customer's slot will be released. If the booking was paid, the backend decides whether and how a refund is issued via Razorpay." confirmLabel="Cancel booking" danger reason={{ label: "Reason (visible to the customer)", required: true }} onConfirm={doCancel} onClose={() => setCancel(null)} />
    </>
  );
}
