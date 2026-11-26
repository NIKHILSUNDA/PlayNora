"use client";
import { useState } from "react";
import { Pencil, Plus, Trophy } from "lucide-react";
import SportFormModal from "@/components/admin/sports/SportFormModal";
import { EmptyState, ErrorState, Skeleton } from "@/components/admin/ui/States";
import { Toggle } from "@/components/admin/ui/Field";
import PageHeader from "@/components/admin/ui/PageHeader";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import { useToast } from "@/components/admin/ui/Toast";
import { useAsync } from "@/hooks/useAdminData";
import { sportsApi } from "@/services/admin";
import type { SportRecord } from "@/types/admin";

export default function SportsPage() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(() => sportsApi.list());
  const [form, setForm] = useState<{ open: boolean; sport: SportRecord | null }>({ open: false, sport: null });
  const [busyId, setBusyId] = useState<string | null>(null);

  const flip = async (s: SportRecord) => {
    const next = s.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setBusyId(s.id);
    const r = await sportsApi.setStatus(s.id, next);
    setBusyId(null);
    if (r.error) return toast.error(r.error);
    toast.success(`${s.name} ${next === "ACTIVE" ? "activated" : "deactivated"}`);
    reload();
  };
  const add = <button className="adm-btn-primary" onClick={() => setForm({ open: true, sport: null })}><Plus size={16} aria-hidden="true" />Add sport</button>;

  return (
    <>
      <PageHeader title="Sports" accent="catalogue" description="Control which sports customers can browse and which venues can offer." actions={add} />
      {error ? <div className="adm-card"><ErrorState message={error} onRetry={reload} /></div> : loading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-64" />)}</div> : !data?.length ? <div className="adm-card"><EmptyState title="No sports yet" hint="Add your first sport to start listing venues." action={add} /></div> : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((s) => (
            <li key={s.id} className={`adm-card adm-fade overflow-hidden transition ${s.status === "INACTIVE" ? "opacity-75" : ""}`}>
              <div className="relative h-36 bg-white/5">
                {s.image ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={s.image} alt="" className={`h-full w-full object-cover ${s.status === "INACTIVE" ? "grayscale" : ""}`} /> : <div className="grid h-full place-items-center text-white/30"><Trophy size={36} /></div>}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e0e37] to-transparent" />
                <div className="absolute right-3 top-3"><StatusBadge status={s.status} /></div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-extrabold">{s.name}</h2><p className="font-mono text-xs text-white/40">/{s.slug}</p></div><button className="adm-icon-btn" aria-label={`Edit ${s.name}`} onClick={() => setForm({ open: true, sport: s })}><Pencil size={16} /></button></div>
                <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-white/60">{s.description || "No description."}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-sm text-white/60"><b className="text-white">{s.venuesCount}</b> venues</span><label className="flex items-center gap-2 text-xs font-semibold text-white/70">{s.status === "ACTIVE" ? "Active" : "Inactive"}<Toggle checked={s.status === "ACTIVE"} disabled={busyId === s.id} label={`${s.status === "ACTIVE" ? "Deactivate" : "Activate"} ${s.name}`} onChange={() => flip(s)} /></label></div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <SportFormModal open={form.open} sport={form.sport} onClose={() => setForm({ open: false, sport: null })} onSaved={reload} />
    </>
  );
}
