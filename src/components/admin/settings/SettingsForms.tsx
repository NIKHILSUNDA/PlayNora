"use client";
import { useState, type FormEvent, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import Field, { Toggle } from "@/components/admin/ui/Field";
import { useToast } from "@/components/admin/ui/Toast";
import { settingsApi } from "@/services/admin";
import type { AdminSettings, NotificationPrefs, PlatformSettings, SessionUser } from "@/types/admin";

const Panel = ({ title, description, children }: { title: string; description: string; children: ReactNode }) => <section className="adm-card adm-fade p-6 max-sm:p-4"><h2 className="text-lg font-extrabold">{title}</h2><p className="mb-6 mt-1 text-sm text-white/55">{description}</p>{children}</section>;
const Save = ({ busy, label = "Save changes" }: { busy: boolean; label?: string }) => <button type="submit" className="adm-btn-primary" disabled={busy}>{busy && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}{label}</button>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProfileForm({ profile, onSaved }: { profile: SessionUser; onSaved: () => void }) {
  const toast = useToast();
  const [f, setF] = useState({ name: profile.name, email: profile.email, phone: profile.phone ?? "" }), [err, setErr] = useState<Record<string, string>>({}), [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Enter your name";
    if (!EMAIL.test(f.email)) x.email = "Enter a valid email";
    setErr(x); if (Object.keys(x).length) return;
    setBusy(true); const r = await settingsApi.updateProfile({ ...f, name: f.name.trim() }); setBusy(false);
    if (r.error) toast.error(r.error); else { toast.success("Profile updated"); onSaved(); }
  };
  return (
    <Panel title="Admin profile" description="Your name and contact details shown across the admin area.">
      <form onSubmit={submit} noValidate className="grid max-w-2xl gap-5 sm:grid-cols-2">
        <Field label="Full name" error={err.name}><input className="adm-input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="Email" error={err.email}><input type="email" className="adm-input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
        <Field label="Phone"><input className="adm-input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
        <Field label="Role"><input className="adm-input" value="Administrator" disabled readOnly /></Field>
        <div className="sm:col-span-2"><Save busy={busy} /></div>
      </form>
    </Panel>
  );
}

export function PasswordForm() {
  const toast = useToast();
  const [f, setF] = useState({ current: "", next: "", confirm: "" }), [err, setErr] = useState<Record<string, string>>({}), [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (!f.current) x.current = "Enter your current password";
    if (f.next.length < 10 || !/[a-z]/.test(f.next) || !/[A-Z]/.test(f.next) || !/\d/.test(f.next)) x.next = "At least 10 characters with upper-case, lower-case and a number";
    else if (f.next === f.current) x.next = "New password must differ from the current one";
    if (f.confirm !== f.next) x.confirm = "Passwords do not match";
    setErr(x); if (Object.keys(x).length) return;
    setBusy(true); const r = await settingsApi.changePassword(f.current, f.next); setBusy(false);
    if (r.error) return toast.error(r.error);
    setF({ current: "", next: "", confirm: "" }); toast.success("Password changed");
  };
  return (
    <Panel title="Change password" description="Passwords are sent securely to the server and are never stored in the browser.">
      <form onSubmit={submit} noValidate autoComplete="off" className="max-w-md space-y-5">
        <Field label="Current password" error={err.current}><input type="password" autoComplete="current-password" className="adm-input" value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} /></Field>
        <Field label="New password" error={err.next} hint="Min. 10 characters, mixed case, at least one number"><input type="password" autoComplete="new-password" className="adm-input" value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} /></Field>
        <Field label="Confirm new password" error={err.confirm}><input type="password" autoComplete="new-password" className="adm-input" value={f.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} /></Field>
        <Save busy={busy} label="Update password" />
      </form>
    </Panel>
  );
}

export function PlatformForm({ value, onSaved }: { value: PlatformSettings; onSaved: () => void }) {
  const toast = useToast();
  const [f, setF] = useState(value), [err, setErr] = useState<Record<string, string>>({}), [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (!f.platformName.trim()) x.platformName = "Required";
    if (!EMAIL.test(f.supportEmail)) x.supportEmail = "Enter a valid email";
    if (!(f.platformFee >= 0)) x.platformFee = "Cannot be negative";
    if (!(f.cancellationWindowHours >= 0)) x.cancellationWindowHours = "Cannot be negative";
    if (!(f.maxAdvanceBookingDays >= 1)) x.maxAdvanceBookingDays = "Must be at least 1 day";
    setErr(x); if (Object.keys(x).length) return;
    setBusy(true); const r = await settingsApi.update({ platform: f }); setBusy(false);
    if (r.error) toast.error(r.error); else { toast.success("Platform settings saved"); onSaved(); }
  };
  const num = (k: keyof PlatformSettings) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: Number(e.target.value) });
  return (
    <Panel title="Platform configuration" description="Global rules applied to bookings and customer communication.">
      <form onSubmit={submit} noValidate className="grid max-w-2xl gap-5 sm:grid-cols-2">
        <Field label="Platform name" error={err.platformName}><input className="adm-input" value={f.platformName} onChange={(e) => setF({ ...f, platformName: e.target.value })} /></Field>
        <Field label="Support email" error={err.supportEmail}><input type="email" className="adm-input" value={f.supportEmail} onChange={(e) => setF({ ...f, supportEmail: e.target.value })} /></Field>
        <Field label="Platform fee per booking (₹)" error={err.platformFee}><input type="number" min={0} className="adm-input" value={f.platformFee} onChange={num("platformFee")} /></Field>
        <Field label="Free-cancellation window (hours)" hint="Before the slot starts" error={err.cancellationWindowHours}><input type="number" min={0} className="adm-input" value={f.cancellationWindowHours} onChange={num("cancellationWindowHours")} /></Field>
        <Field label="Max advance booking (days)" error={err.maxAdvanceBookingDays}><input type="number" min={1} className="adm-input" value={f.maxAdvanceBookingDays} onChange={num("maxAdvanceBookingDays")} /></Field>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:col-span-2"><div><p className="text-sm font-bold">Maintenance mode</p><p className="text-xs text-white/50">Pauses new customer bookings while you make changes.</p></div><Toggle checked={f.maintenanceMode} onChange={(v) => setF({ ...f, maintenanceMode: v })} label="Maintenance mode" /></div>
        <div className="sm:col-span-2"><Save busy={busy} /></div>
      </form>
    </Panel>
  );
}

const NOTES: { key: keyof NotificationPrefs; title: string; hint: string }[] = [
  { key: "newBooking", title: "New bookings", hint: "Email when a booking is confirmed" }, { key: "cancellation", title: "Cancellations", hint: "Email when a booking is cancelled" },
  { key: "paymentFailure", title: "Payment failures", hint: "Alert when a Razorpay payment fails" }, { key: "venueSubmission", title: "Venue submissions", hint: "Alert when a venue awaits approval" },
  { key: "dailySummary", title: "Daily summary", hint: "A digest of yesterday's activity at 8:00 AM" },
];
export function NotificationForm({ value, onSaved }: { value: AdminSettings["notifications"]; onSaved: () => void }) {
  const toast = useToast();
  const [f, setF] = useState(value), [busy, setBusy] = useState(false);
  const save = async () => { setBusy(true); const r = await settingsApi.update({ notifications: f }); setBusy(false); if (r.error) toast.error(r.error); else { toast.success("Notification preferences saved"); onSaved(); } };
  return (
    <Panel title="Notification preferences" description="Choose which events notify you by email.">
      <ul className="max-w-2xl divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">{NOTES.map((n) => <li key={n.key} className="flex items-center justify-between gap-4 px-4 py-3"><div><p className="text-sm font-bold">{n.title}</p><p className="text-xs text-white/50">{n.hint}</p></div><Toggle checked={f[n.key]} onChange={(v) => setF({ ...f, [n.key]: v })} label={n.title} /></li>)}</ul>
      <div className="mt-5"><button className="adm-btn-primary" onClick={save} disabled={busy}>{busy && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}Save preferences</button></div>
    </Panel>
  );
}
