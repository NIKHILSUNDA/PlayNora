"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Check, Pencil, Plus, Power, Trash2, X } from "lucide-react";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import DataTable, { RowActions, type Column } from "@/components/admin/ui/DataTable";
import { FilterBar, FilterSelect, Tabs } from "@/components/admin/ui/FilterBar";
import PageHeader from "@/components/admin/ui/PageHeader";
import SearchInput from "@/components/admin/ui/SearchInput";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import { useToast } from "@/components/admin/ui/Toast";
import VenueFormModal from "@/components/admin/venues/VenueFormModal";
import { useAsync, useList } from "@/hooks/useAdminData";
import { inr } from "@/lib/format";
import { sportsApi, venuesApi } from "@/services/admin";
import type { AdminVenue } from "@/types/admin";

type Pending = { kind: "reject" | "deactivate" | "delete"; venue: AdminVenue } | null;
const TABS = [{ value: "all", label: "All" }, { value: "ACTIVE", label: "Active" }, { value: "PENDING", label: "Pending approval" }, { value: "INACTIVE", label: "Inactive" }, { value: "REJECTED", label: "Rejected" }];

export default function VenuesPage() {
  const toast = useToast();
  const list = useList(venuesApi.list, { sort: "createdAt", dir: "desc" });
  const sports = useAsync(() => sportsApi.list());
  const [form, setForm] = useState<{ open: boolean; venue: AdminVenue | null }>({ open: false, venue: null });
  const [pending, setPending] = useState<Pending>(null);
  const sportNames = useMemo(() => (sports.data ?? []).filter((s) => s.status === "ACTIVE").map((s) => s.name), [sports.data]);

  const run = async (p: Promise<{ error: string | null }>, ok: string) => { const r = await p; if (r.error) toast.error(r.error); else { toast.success(ok); list.reload(); } return !r.error; };
  const confirm = async (reason: string) => {
    if (!pending) return;
    const { kind, venue } = pending;
    const done = kind === "reject" ? await run(venuesApi.setStatus(venue.id, "REJECTED", reason), `${venue.name} rejected`) : kind === "deactivate" ? await run(venuesApi.setStatus(venue.id, "INACTIVE"), `${venue.name} deactivated`) : await run(venuesApi.remove(venue.id), `${venue.name} deleted`);
    if (done) setPending(null);
  };
  const dlg = pending && ({
    reject: { title: "Reject venue submission", message: `Reject “${pending.venue.name}”? The submitter will see your reason.`, label: "Reject venue", danger: true, reason: { label: "Reason for rejection", required: true } },
    deactivate: { title: "Deactivate venue", message: `“${pending.venue.name}” will be hidden and can no longer be booked. Existing bookings are not affected.`, label: "Deactivate", danger: true, reason: undefined },
    delete: { title: "Delete venue permanently", message: `This permanently deletes “${pending.venue.name}”. Venues with booking history should be deactivated instead.`, label: "Delete permanently", danger: true, reason: undefined },
  })[pending.kind];

  const cols: Column<AdminVenue>[] = [
    { key: "venue", header: "Venue", sortKey: "name", render: (v) => <div className="flex items-center gap-3 md:min-w-[200px]"><Image src={v.images[0] ?? "/images/venues/v1.jpg"} alt="" width={56} height={40} unoptimized={!v.images[0]?.startsWith("/")} className="h-10 w-14 shrink-0 rounded-md object-cover" /><div className="min-w-0"><p className="truncate font-semibold">{v.name}</p><p className="truncate text-xs text-white/50">{v.location}</p></div></div> },
    { key: "sports", header: "Sports", hide: "lg", render: (v) => <div className="flex flex-wrap gap-1">{v.sports.map((s) => <span key={s} className="rounded bg-white/10 px-1.5 py-0.5 text-[11px]">{s}</span>)}</div> },
    { key: "price", header: "Price / hr", sortKey: "pricePerHour", hide: "md", render: (v) => <span className="font-semibold">{inr(v.pricePerHour)}</span> },
    { key: "hours", header: "Hours", hide: "lg", render: (v) => <span className="whitespace-nowrap text-white/70">{v.hours.open} – {v.hours.close}</span> },
    { key: "bookings", header: "Bookings", sortKey: "bookingsCount", hide: "md", render: (v) => v.bookingsCount },
    { key: "status", header: "Status", render: (v) => <StatusBadge status={v.status} label={v.status === "PENDING" ? "Pending review" : undefined} /> },
    { key: "actions", header: "", align: "right", render: (v) => (
      <RowActions>
        {(v.status === "PENDING" || v.status === "REJECTED") && <button className="adm-icon-btn text-emerald-300" title="Approve" aria-label={`Approve ${v.name}`} onClick={() => run(venuesApi.setStatus(v.id, "ACTIVE"), `${v.name} approved`)}><Check size={16} /></button>}
        {v.status === "PENDING" && <button className="adm-icon-btn text-red-300" title="Reject" aria-label={`Reject ${v.name}`} onClick={() => setPending({ kind: "reject", venue: v })}><X size={16} /></button>}
        {v.status === "ACTIVE" && <button className="adm-icon-btn" title="Deactivate" aria-label={`Deactivate ${v.name}`} onClick={() => setPending({ kind: "deactivate", venue: v })}><Power size={16} /></button>}
        {v.status === "INACTIVE" && <button className="adm-icon-btn text-emerald-300" title="Activate" aria-label={`Activate ${v.name}`} onClick={() => run(venuesApi.setStatus(v.id, "ACTIVE"), `${v.name} activated`)}><Power size={16} /></button>}
        <button className="adm-icon-btn" title="Edit" aria-label={`Edit ${v.name}`} onClick={() => setForm({ open: true, venue: v })}><Pencil size={16} /></button>
        <button className="adm-icon-btn hover:!text-red-300" title="Delete" aria-label={`Delete ${v.name}`} onClick={() => setPending({ kind: "delete", venue: v })}><Trash2 size={16} /></button>
      </RowActions>) },
  ];

  return (
    <>
      <PageHeader title="Venue" accent="management" description="Approve submissions, edit listings, and control what customers can book." actions={<button className="adm-btn-primary" onClick={() => setForm({ open: true, venue: null })}><Plus size={16} aria-hidden="true" />Add venue</button>} />
      <Tabs value={String(list.query.status ?? "all")} options={TABS} onChange={(v) => list.patch({ status: v })} />
      <FilterBar>
        <SearchInput value={list.query.search ?? ""} onChange={(v) => list.patch({ search: v })} placeholder="Search venue or location" />
        <FilterSelect label="Sport" value={String(list.query.sport ?? "all")} onChange={(v) => list.patch({ sport: v })} options={[{ value: "all", label: "All sports" }, ...sportNames.map((s) => ({ value: s, label: s }))]} />
      </FilterBar>
      <DataTable columns={cols} rows={list.items} rowKey={(v) => v.id} loading={list.loading} error={list.error} onRetry={list.reload} page={list.query.page} pageSize={list.query.pageSize} total={list.total} onPage={list.setPage} onPageSize={(n) => list.patch({ pageSize: n })} sort={list.query.sort} dir={list.query.dir} onSort={list.toggleSort} empty={{ title: "No venues found", hint: "Adjust the filters or add a new venue.", action: <button className="adm-btn-primary" onClick={() => setForm({ open: true, venue: null })}><Plus size={16} />Add venue</button> }} />
      <VenueFormModal open={form.open} venue={form.venue} sportOptions={sportNames} onClose={() => setForm({ open: false, venue: null })} onSaved={list.reload} />
      <ConfirmDialog open={!!pending} title={dlg?.title ?? ""} message={dlg?.message ?? ""} confirmLabel={dlg?.label ?? ""} danger={dlg?.danger} reason={dlg?.reason} onConfirm={confirm} onClose={() => setPending(null)} />
    </>
  );
}
