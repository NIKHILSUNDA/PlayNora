"use client";
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import Field from "@/components/admin/ui/Field";
import Modal from "@/components/admin/ui/Modal";
import { useToast } from "@/components/admin/ui/Toast";
import { venuesApi } from "@/services/admin";
import type { AdminVenue, VenueInput } from "@/types/admin";

const EMPTY: VenueInput = { name: "", location: "", description: "", pricePerHour: 0, sports: [], images: [], hours: { open: "06:00", close: "23:00" }, status: "ACTIVE" };
type Errors = Partial<Record<"name" | "location" | "pricePerHour" | "sports" | "hours" | "image", string>>;

function validate(f: VenueInput): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 3) e.name = "Enter the venue name (min 3 characters)";
  if (!f.location.trim()) e.location = "Enter the area and city";
  if (!(f.pricePerHour > 0)) e.pricePerHour = "Price must be greater than ₹0";
  if (!f.sports.length) e.sports = "Select at least one sport";
  if (f.hours.close <= f.hours.open) e.hours = "Closing time must be after opening time";
  return e;
}

export default function VenueFormModal({ open, venue, sportOptions, onClose, onSaved }: { open: boolean; venue: AdminVenue | null; sportOptions: string[]; onClose: () => void; onSaved: () => void }) {
  const toast = useToast();
  const [f, setF] = useState<VenueInput>(EMPTY), [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false), [uploading, setUploading] = useState(false), [url, setUrl] = useState("");
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) return;
    setErrors({}); setUrl(""); setBusy(false);
    setF(venue ? { name: venue.name, location: venue.location, description: venue.description, pricePerHour: venue.pricePerHour, sports: venue.sports, images: venue.images, hours: venue.hours, status: venue.status } : EMPTY);
  }, [open, venue]);

  const set = <K extends keyof VenueInput>(k: K, v: VenueInput[K]) => setF((p) => ({ ...p, [k]: v }));
  const toggleSport = (s: string) => set("sports", f.sports.includes(s) ? f.sports.filter((x) => x !== s) : [...f.sports, s]);
  const addUrl = () => {
    const u = url.trim();
    if (!/^(https:\/\/|\/images\/)/.test(u)) return setErrors((p) => ({ ...p, image: "Use an https:// URL or an uploaded image" }));
    setErrors((p) => ({ ...p, image: undefined })); set("images", [...f.images, u]); setUrl("");
  };
  const upload = async (files: FileList | null) => {
    const picked = files?.[0];
    if (!picked) return;
    if (!/^image\/(jpeg|png|webp)$/.test(picked.type) || picked.size > 5 * 1024 * 1024) return setErrors((p) => ({ ...p, image: "Use a JPG, PNG or WebP image under 5 MB" }));
    setUploading(true);
    const r = await venuesApi.uploadImage(picked);
    setUploading(false);
    if (r.error || !r.data) return setErrors((p) => ({ ...p, image: r.error ?? "Upload failed" }));
    setErrors((p) => ({ ...p, image: undefined })); set("images", [...f.images, r.data.url]);
    if (file.current) file.current.value = "";
  };
  const save = async () => {
    const e = validate(f); setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    const body: VenueInput = { ...f, name: f.name.trim(), location: f.location.trim(), description: f.description.trim() };
    const r = venue ? await venuesApi.update(venue.id, body) : await venuesApi.create(body);
    setBusy(false);
    if (r.error) return toast.error(r.error);
    toast.success(venue ? "Venue updated" : "Venue created");
    onSaved(); onClose();
  };
  const options = Array.from(new Set([...sportOptions, ...f.sports]));

  return (
    <Modal open={open} onClose={busy ? () => undefined : onClose} title={venue ? "Edit venue" : "Add venue"} size="lg" footer={<>
      <button className="adm-btn" onClick={onClose} disabled={busy}>Cancel</button>
      <button className="adm-btn-primary" onClick={save} disabled={busy || uploading}>{busy && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}{venue ? "Save changes" : "Create venue"}</button>
    </>}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Venue name" error={errors.name}><input className="adm-input" value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. PlayZone Sports Arena" /></Field>
        <Field label="Location" error={errors.location}><input className="adm-input" value={f.location} onChange={(e) => set("location", e.target.value)} placeholder="Area, City" /></Field>
        <div className="sm:col-span-2"><Field label="Description"><textarea rows={3} className="adm-input" value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="Facilities, surface, amenities…" /></Field></div>

        <Field label="Price per hour (₹)" error={errors.pricePerHour}><input type="number" min={0} step={50} className="adm-input" value={f.pricePerHour || ""} onChange={(e) => set("pricePerHour", Number(e.target.value))} /></Field>
        <Field label="Status"><select className="adm-input" value={f.status} onChange={(e) => set("status", e.target.value as VenueInput["status"])}><option value="ACTIVE">Active (bookable)</option><option value="INACTIVE">Inactive (hidden)</option>{venue && (venue.status === "PENDING" || venue.status === "REJECTED") && <option value={venue.status}>{venue.status === "PENDING" ? "Pending review" : "Rejected"}</option>}</select></Field>

        <div className="sm:col-span-2">
          <p className="mb-1.5 text-xs font-bold text-white/80">Operating hours</p>
          <div className="flex items-center gap-3"><input type="time" aria-label="Opening time" className="adm-input" value={f.hours.open} onChange={(e) => set("hours", { ...f.hours, open: e.target.value })} /><span className="text-white/40">to</span><input type="time" aria-label="Closing time" className="adm-input" value={f.hours.close} onChange={(e) => set("hours", { ...f.hours, close: e.target.value })} /></div>
          {errors.hours && <p role="alert" className="mt-1 text-xs text-red-300">{errors.hours}</p>}
        </div>

        <div className="sm:col-span-2">
          <p className="mb-1.5 text-xs font-bold text-white/80">Supported sports</p>
          <div className="flex flex-wrap gap-2">{options.map((s) => { const on = f.sports.includes(s); return <button key={s} type="button" aria-pressed={on} onClick={() => toggleSport(s)} className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition ${on ? "border-violet bg-violet text-white" : "border-white/15 text-white/70 hover:bg-white/10"}`}>{s}</button>; })}</div>
          {errors.sports && <p role="alert" className="mt-1 text-xs text-red-300">{errors.sports}</p>}
        </div>

        <div className="sm:col-span-2">
          <p className="mb-1.5 text-xs font-bold text-white/80">Images <span className="font-normal text-white/45">· first image is the cover</span></p>
          {f.images.length > 0 && <ul className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{f.images.map((src, i) => (
            <li key={src + i} className="group relative overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`Venue image ${i + 1}`} className="h-24 w-full object-cover" />
              {i === 0 && <span className="absolute left-1.5 top-1.5 rounded bg-brand px-1.5 py-0.5 text-[10px] font-extrabold text-[#1a1200]">COVER</span>}
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/80 p-1.5">
                {i !== 0 && <button type="button" className="adm-icon-btn !h-7 !w-7 bg-black/40" aria-label="Make cover image" onClick={() => set("images", [src, ...f.images.filter((_, j) => j !== i)])}><Star size={14} /></button>}
                <button type="button" className="adm-icon-btn !h-7 !w-7 bg-black/40 text-red-300" aria-label="Remove image" onClick={() => set("images", f.images.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
              </div>
            </li>))}</ul>}
          <div className="flex flex-wrap gap-2">
            <input className="adm-input min-w-[200px] flex-1" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl(); } }} placeholder="Paste image URL (https://…)" aria-label="Image URL" />
            <button type="button" className="adm-btn" onClick={addUrl} disabled={!url.trim()}>Add URL</button>
            <button type="button" className="adm-btn" onClick={() => file.current?.click()} disabled={uploading}>{uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} aria-hidden="true" />}Upload</button>
            <input ref={file} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => upload(e.target.files)} />
          </div>
          {errors.image && <p role="alert" className="mt-1 text-xs text-red-300">{errors.image}</p>}
        </div>
      </div>
    </Modal>
  );
}
