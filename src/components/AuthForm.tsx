"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Mode = "login" | "signup" | "forgot";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function Field({ label, icon, error, children }: { label: string; icon: ReactNode; error?: string; children: ReactNode }) {
  return (
    <label className="block text-[13px] font-semibold text-white/80">
      {label}
      <span className={`mt-1.5 flex items-center gap-2.5 rounded-xl border bg-white/[.06] px-3.5 transition focus-within:border-violet focus-within:ring-2 focus-within:ring-violet/30 ${error ? "border-red-400/70" : "border-white/15"}`}>
        <span className="text-white/45" aria-hidden="true">{icon}</span>
        {children}
      </span>
      {error && <span role="alert" className="mt-1 block text-xs font-medium text-red-300">{error}</span>}
    </label>
  );
}
const INPUT = "w-full min-w-0 bg-transparent py-3 text-[15px] max-sm:text-base font-normal text-white outline-none placeholder:text-white/35";

export default function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>(params.get("mode") === "signup" ? "signup" : "login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const switchMode = (m: Mode) => { setMode(m); setErrors({}); setSent(false); setShow(false); };
  const done = (u: { name: string; email: string; phone?: string }) => {
    login(u);
    const next = params.get("next");
    router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : "/");
  };
  const fake = () => new Promise((r) => setTimeout(r, 700));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (mode === "signup" && name.trim().length < 2) er.name = "Please enter your full name";
    if (mode === "signup" && phone && !/^[6-9]\d{9}$/.test(phone)) er.phone = "Enter a valid 10-digit mobile number";
    if (!EMAIL_RE.test(email.trim())) er.email = "Enter a valid email address";
    if (mode !== "forgot") {
      if (!password) er.password = "Please enter your password";
      else if (mode === "signup" && password.length < 8) er.password = "Use at least 8 characters";
    }
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true); await fake(); setBusy(false);
    if (mode === "forgot") return setSent(true);
    const mail = email.trim().toLowerCase();
    if (mode === "signup") done({ name: name.trim(), email: mail, phone: phone ? `+91 ${phone}` : undefined });
    else done({ name: mail.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), email: mail });
  };
  const google = async () => { setBusy(true); await fake(); setBusy(false); done({ name: "Google User", email: "user@gmail.com" }); };

  const title = mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password";
  const sub = mode === "login" ? "Log in to book venues and join your community." : mode === "signup" ? "Join PlayNora and start booking in minutes." : "Enter your email and we’ll send you a reset link.";

  return (
    <div className="bg-page min-h-screen px-[5vw] pb-14 pt-24">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-[#160a2b]/70 shadow-[0_30px_80px_rgba(0,0,0,.5)] backdrop-blur md:grid-cols-[1fr_1.1fr]">
        {/* Brand panel */}
        <aside className="relative hidden flex-col justify-between overflow-hidden p-10 md:flex ct-head">
          <span className="ct-blob" aria-hidden="true" />
          <Image src="/images/logo.png" alt="PlayNora" width={150} height={42} className="relative h-10 w-auto" />
          <div className="relative">
            <h2 className="text-[34px] font-black italic leading-[1.05]">Your Game.<span className="block bg-gradient-to-r from-brand to-pink-500 bg-clip-text font-serif text-transparent">Your People.</span></h2>
            <ul className="mt-7 space-y-3.5 text-[15px] text-white/85">
              {["Book football, cricket, pickleball & padel", "Instant slot booking, no calls needed", "Join a community that plays together"].map((t) => (
                <li key={t} className="flex items-start gap-3"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-[#1a1200]"><Check size={13} strokeWidth={3} aria-hidden="true" /></span>{t}</li>
              ))}
            </ul>
          </div>
          <p className="relative text-xs text-white/55">© PlayNora. Play more, together.</p>
        </aside>

        {/* Form panel */}
        <section className="p-6 sm:p-10" aria-labelledby="auth-title">
          {mode === "forgot" && <button type="button" onClick={() => switchMode("login")} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white"><ArrowLeft size={16} aria-hidden="true" />Back to login</button>}
          <h1 id="auth-title" className="text-[30px] font-extrabold leading-tight tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-white/65">{sub}</p>

          {mode !== "forgot" && (
            <>
              <button type="button" onClick={google} disabled={busy} className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-[15px] font-semibold text-[#1f1f1f] shadow-sm transition hover:bg-[#f2f2f2] disabled:opacity-60">
                <GoogleLogo />{mode === "login" ? "Sign in with Google" : "Sign up with Google"}
              </button>
              <div className="my-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-white/40"><span className="h-px flex-1 bg-white/15" />or<span className="h-px flex-1 bg-white/15" /></div>
            </>
          )}

          {sent ? (
            <div role="status" className="mt-7 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-sm leading-relaxed text-emerald-100">
              If an account exists for <b>{email}</b>, a password reset link is on its way. Check your inbox and spam folder.
              <button type="button" onClick={() => switchMode("login")} className="btn mt-4 w-full">Back to login</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className={`space-y-4 ${mode === "forgot" ? "mt-7" : ""}`}>
              {mode === "signup" && (
                <Field label="Full name" icon={<User size={18} />} error={errors.name}>
                  <input className={INPUT} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
                </Field>
              )}
              {mode === "signup" && (
                <Field label="Mobile number (optional)" icon={<Phone size={18} />} error={errors.phone}>
                  <span className="border-r border-white/15 pr-2.5 text-[15px] font-semibold text-white/80">+91</span>
                  <input className={INPUT} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98765 43210" inputMode="numeric" autoComplete="tel-national" />
                </Field>
              )}
              <Field label="Email address" icon={<Mail size={18} />} error={errors.email}>
                <input className={INPUT} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
              </Field>
              {mode !== "forgot" && (
                <Field label="Password" icon={<Lock size={18} />} error={errors.password}>
                  <input className={INPUT} type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "signup" ? "At least 8 characters" : "Enter your password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} />
                  <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="text-white/50 hover:text-white">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </Field>
              )}
              {mode === "login" && (
                <div className="flex justify-end text-xs"><button type="button" onClick={() => switchMode("forgot")} className="font-medium text-white/60 underline-offset-2 hover:text-brand hover:underline">Forgot password?</button></div>
              )}
              <button type="submit" disabled={busy} className="btn w-full !rounded-xl !py-3.5 !text-sm">
                {busy ? "Please wait…" : mode === "login" ? "Log in" : mode === "signup" ? "Create account" : "Send reset link"}
              </button>
            </form>
          )}

          {mode !== "forgot" && !sent && (
            <p className="mt-6 text-center text-sm text-white/65">
              {mode === "login" ? "New to PlayNora?" : "Already have an account?"}{" "}
              <button type="button" onClick={() => switchMode(mode === "login" ? "signup" : "login")} className="font-bold text-brand hover:underline">{mode === "login" ? "Sign up" : "Log in"}</button>
            </p>
          )}
          {mode === "signup" && <p className="mt-4 text-center text-xs leading-relaxed text-white/45">By creating an account you agree to our <Link href="/faq" className="underline hover:text-white">Terms &amp; FAQ</Link>.</p>}
          <p className="mt-3 text-center text-[11px] text-white/35">Demo only – no real authentication yet.</p>
        </section>
      </div>
    </div>
  );
}
