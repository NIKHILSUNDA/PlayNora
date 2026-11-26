"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronDown, Clock, X } from "lucide-react";
import SportLogo from "@/components/SportLogo";
import { useBooking } from "@/context/BookingContext";
import { PLATFORM_FEE, type GameSession } from "@/data/sessions";
import { addDays, inr, toDateStr } from "@/lib/format";
import type { Venue } from "@/types";

const MAX_PER_BOOKING = 10;
const PHONE_RE = /^[6-9]\d{9}$/;
const field = "w-full rounded-lg border bg-white/5 px-3.5 py-2.5 text-base text-white outline-none placeholder:text-white/35 focus:border-violet focus:ring-2 focus:ring-violet/30 [color-scheme:dark]";
const ring = (bad: boolean) => (bad ? "border-red-400/70" : "border-white/20");

interface Props { venue: Venue; session: GameSession; live: boolean; dayText: string; timeText: string; onClose: () => void }

export default function JoinGameModal({ venue, session: s, live, dayText, timeText, onClose }: Props) {
  const router = useRouter();
  const { setBooking } = useBooking();
  const left = s.total - s.joined;
  const maxPlayers = Math.max(1, Math.min(left, MAX_PER_BOOKING));
  const [count, setCount] = useState(1);
  const [names, setNames] = useState<string[]>(() => Array(MAX_PER_BOOKING).fill(""));
  const [phone, setPhone] = useState("");
  const [tried, setTried] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLInputElement>(null);

  const subtotal = s.fee * count;
  const total = subtotal + PLATFORM_FEE;
  const nameBad = (i: number) => tried && names[i].trim().length < 2;
  const phoneBad = tried && !PHONE_RE.test(phone);

  // Focus, Esc, Tab trap. While open, page animations are paused (keeps the sheet at 60fps) and
  // focus returns to the trigger on close. Body is only locked on touch devices: locking on desktop
  // removes the scrollbar and makes the page jump sideways.
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const overflow = document.body.style.overflow;
    if (!fine) document.body.style.overflow = "hidden";
    document.documentElement.classList.add("jg-open");
    if (fine) first.current?.focus({ preventScroll: true }); // on phones, don't pop the keyboard before the sheet settles
    else box.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !box.current) return;
      const els = Array.from(box.current.querySelectorAll<HTMLElement>("button:not([disabled]),input,select,a[href]"));
      if (!els.length) return;
      const a = els[0], z = els[els.length - 1];
      if (e.shiftKey && (document.activeElement === a || document.activeElement === box.current)) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; document.documentElement.classList.remove("jg-open"); prev?.focus?.({ preventScroll: true }); };
  }, [onClose]);

  const setName = (i: number, v: string) => setNames((n) => n.map((x, k) => (k === i ? v : x)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    const players = names.slice(0, count).map((n) => n.trim());
    if (players.some((n) => n.length < 2) || !PHONE_RE.test(phone)) {
      const bad = box.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      // Wait a frame so aria-invalid is rendered before we look for it.
      requestAnimationFrame(() => (box.current?.querySelector<HTMLElement>("[aria-invalid='true']") ?? bad)?.focus());
      return;
    }
    setBooking({
      venue, date: toDateStr(addDays(new Date(), s.dayOffset)), slot: timeText, sport: s.sport, price: subtotal, total,
      session: { title: s.title, level: s.level, fee: s.fee, start: s.start, end: s.end },
      players, contact: { name: players[0], phone: `+91 ${phone}` },
    });
    router.push(`/book/${venue.id}`);
  };

  return createPortal(
    <div className="jg-layer jg-fade fixed inset-0 z-[100] flex items-end justify-center overscroll-contain bg-black/75 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={box} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="join-title" className="jg-pop flex max-h-[92dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-t-2xl bg-[#1a0b2e] outline-none ring-1 ring-white/10 sm:max-h-[88dvh] sm:rounded-2xl">
        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <header className="relative flex items-center gap-3 border-b border-white/10 px-5 py-4 pr-14">
            <SportLogo sport={s.sport} size={44} />
            <div className="min-w-0">
              <h2 id="join-title" className="text-lg font-extrabold leading-tight">{s.title}</h2>
              <p className="mt-0.5 text-sm text-white/65">{s.sport} at {venue.name.split("|")[0].trim()}</p>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-white/80">
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} aria-hidden="true" />{dayText}</span>
                <span className="inline-flex items-center gap-1.5"><Clock size={14} aria-hidden="true" />{timeText}</span>
              </p>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"><X size={20} aria-hidden="true" /></button>
          </header>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-4 [-webkit-overflow-scrolling:touch]">
            <label className="block text-sm font-bold">Number of players
              <span className="relative mt-1.5 block">
                <select value={count} onChange={(e) => setCount(Number(e.target.value))} className={`${field} ${ring(false)} appearance-none pr-10 font-normal`}>
                  {Array.from({ length: maxPlayers }, (_, k) => k + 1).map((n) => <option key={n} value={n} className="bg-[#1e0e37] text-white">{n} {n === 1 ? "player" : "players"} · {inr(s.fee * n)}</option>)}
                </select>
                <ChevronDown size={18} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60" />
              </span>
              <span className="mt-1.5 block text-xs font-normal text-white/55">{left} {left === 1 ? "spot" : "spots"} left in this game</span>
            </label>

            <label className="block text-sm font-bold">Your name
              <input ref={first} value={names[0]} onChange={(e) => setName(0, e.target.value)} autoComplete="name" placeholder="Full name" aria-invalid={nameBad(0)} aria-describedby={nameBad(0) ? "err-n0" : undefined} className={`${field} ${ring(nameBad(0))} mt-1.5 font-normal`} />
              {nameBad(0) && <span id="err-n0" role="alert" className="mt-1.5 block text-xs font-normal text-red-300">Please enter your name</span>}
            </label>

            <label className="block text-sm font-bold">Mobile number
              <span className={`mt-1.5 flex items-stretch overflow-hidden rounded-lg border bg-white/5 transition focus-within:border-violet focus-within:ring-2 focus-within:ring-violet/30 ${ring(phoneBad)}`}>
                <span className="grid place-items-center border-r border-white/15 bg-white/5 px-3.5 text-base font-semibold text-white/80">+91</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" autoComplete="tel-national" placeholder="10-digit number" aria-invalid={phoneBad} aria-describedby={phoneBad ? "err-ph" : undefined} className="w-full min-w-0 bg-transparent px-3.5 py-3 text-base font-normal text-white outline-none placeholder:text-white/35" />
              </span>
              {phoneBad && <span id="err-ph" role="alert" className="mt-1.5 block text-xs font-normal text-red-300">Enter a valid 10-digit mobile number</span>}
            </label>

            {count > 1 && (
              <fieldset className="space-y-3 border-t border-white/10 pt-4">
                <legend className="sr-only">Other players</legend>
                <p className="text-sm font-bold">Who else is playing?</p>
                {Array.from({ length: count - 1 }, (_, k) => k + 1).map((i) => (
                  <label key={i} className="block text-xs font-semibold text-white/70">Player {i + 1}
                    <input value={names[i]} onChange={(e) => setName(i, e.target.value)} autoComplete="off" placeholder="Name" aria-invalid={nameBad(i)} aria-describedby={nameBad(i) ? `err-n${i}` : undefined} className={`${field} ${ring(nameBad(i))} mt-1 font-normal`} />
                    {nameBad(i) && <span id={`err-n${i}`} role="alert" className="mt-1 block text-xs font-normal text-red-300">Please enter a name</span>}
                  </label>
                ))}
              </fieldset>
            )}

            <div className="rounded-xl bg-white/[.05] p-3.5 text-sm">
              <div className="flex justify-between"><span className="text-white/70">{inr(s.fee)} × {count} {count === 1 ? "player" : "players"}</span><span>{inr(subtotal)}</span></div>
              <div className="mt-1.5 flex justify-between"><span className="text-white/70">Platform fee</span><span>{inr(PLATFORM_FEE)}</span></div>
              <div className="mt-3 flex justify-between border-t border-white/15 pt-3 text-base font-extrabold"><span>Total</span><span>{inr(total)}</span></div>
            </div>
          </div>

          <footer className="border-t border-white/10 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
            <button type="submit" className="btn w-full">{live ? "Join game" : "Reserve spot"} · {inr(total)}</button>
          </footer>
        </form>
      </div>
    </div>,
    document.body,
  );
}
