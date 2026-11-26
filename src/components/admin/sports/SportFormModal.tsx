"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Field from "@/components/admin/ui/Field";
import Modal from "@/components/admin/ui/Modal";
import { useToast } from "@/components/admin/ui/Toast";
import { slugify } from "@/lib/format";
import { sportsApi } from "@/services/admin";
import type { SportInput, SportRecord } from "@/types/admin";

const EMPTY: SportInput = { name: "", slug: "", description: "", image: "", status: "ACTIVE" };

export default function SportFormModal({ open, sport, onClose, onSaved }: { open: boolean; sport: SportRecord | null; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const [f, setF] = useState<SportInput>(EMPTY), [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; slug?: string; image?: string }>({}), [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!open) return;
    setErrors({}); setBusy(false); setSlugTouched(!!sport);
    setF(sport ? { name: sport.name, slug: sport.slug, description: sport.description, image: sport.image, status: sport.status } : EMPTY);
  }, [open, sport]);

  const save = async () => {
    const e: typeof errors = {};
    if (f.name.trim().length < 2) e.name = "Enter the sport name";
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.slug)) e.slug = "Lowercase letters, numbers and hyphens only";
    if (f.image && !/^(https:\/\/|\/images\/)/.test(f.image)) e.image = "Use an https:// URL or a /images/ path";
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    const body = { ...f, name: f.name.trim(), description: f.description.trim() };
    const r = sport ? await sportsApi.update(sport.id, body) : await sportsApi.create(body);
    setBusy(false);
    if (r.error) return toast.error(r.error);
    toast.success(sport ? "Sport updated" : "Sport added");
    onSaved(); onClose();
  };
  return (
    <Modal open={open} onClose={busy ? () => undefined : onClose} title={sport ? "Edit sport" : "Add sport"} footer={<><button className="adm-btn" onClick={onClose} disabled={busy}>Cancel</button><button className="adm-btn-primary" onClick={save} disabled={busy}>{busy && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}{sport ? "Save changes" : "Add sport"}</button></>}>
      <div className="space-y-5">
        <Field label="Name" error={errors.name}><input className="adm-input" value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value, slug: slugTouched ? p.slug : slugify(e.target.value) }))} placeholder="e.g. Badminton" /></Field>
        <Field label="Slug" hint="Used in URLs and the API" error={errors.slug}><input className="adm-input font-mono" value={f.slug} onChange={(e) => { setSlugTouched(true); setF((p) => ({ ...p, slug: e.target.value })); }} /></Field>
        <Field label="Description"><textarea rows={3} className="adm-input" value={f.description} onChange={(e) => setF((p) => ({ ...p, description: e.target.value }))} /></Field>
        <Field label="Image URL" hint="Shown on the customer site's sport cards" error={errors.image}><input className="adm-input" value={f.image} onChange={(e) => setF((p) => ({ ...p, image: e.target.value }))} placeholder="/images/sports/football.jpg" /></Field>
        <Field label="Status"><select className="adm-input" value={f.status} onChange={(e) => setF((p) => ({ ...p, status: e.target.value as SportInput["status"] }))}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></Field>
      </div>
    </Modal>
  );
}
