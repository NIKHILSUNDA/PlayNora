"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";
import { USE_MOCK } from "@/config/api";
import { useAdminAuth } from "@/context/AdminAuthContext";
import Field from "./ui/Field";

export default function LoginForm({ next }: { next: string }) {
  const { login, status } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState(""), [password, setPassword] = useState("");
  const [show, setShow] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState("");
  useEffect(() => { if (status === "authenticated") router.replace(next); }, [status, next, router]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return setError("Enter your email and password.");
    setBusy(true); setError("");
    const err = await login(email.trim(), password);
    setBusy(false);
    if (err) setError(err); else router.replace(next);
  };
  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {error && <div role="alert" className="adm-fade flex items-start gap-2.5 rounded-lg border border-red-400/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200"><ShieldAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />{error}</div>}
      <Field label="Email address"><input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@playnora.co.in" className="adm-input !py-3" /></Field>
      <Field label="Password">
        <div className="relative">
          <input type={show ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••" className="adm-input !py-3 !pr-11" />
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="adm-icon-btn absolute right-1.5 top-1/2 -translate-y-1/2">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
        </div>
      </Field>
      <button type="submit" disabled={busy} className="btn w-full">{busy ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" />Signing in…</> : "Sign in →"}</button>
      {USE_MOCK && <p className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs text-amber-200"><b>Dev mock mode:</b> sign in with the admin credentials set in .env.local. This is disabled in production builds.</p>}
    </form>
  );
}
