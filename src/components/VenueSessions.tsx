"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Clock, Trophy, Users, Wallet } from "lucide-react";
import JoinGameModal from "@/components/JoinGameModal";
import SportLogo, { SPORT_TONE } from "@/components/SportLogo";
import { SPORTS } from "@/data/sports";
import { LIVE_SESSIONS, UPCOMING_SESSIONS, type GameSession } from "@/data/sessions";
import { inr } from "@/lib/format";
import type { Venue } from "@/types";

type Tab = "live" | "upcoming";
const PLAYERS = ["AK", "RS", "MJ", "SP", "NV", "DT"];

const range = (a: string, b: string) => (a.slice(-2) === b.slice(-2) ? `${a.slice(0, -3)} – ${b}` : `${a} – ${b}`);
const dayLabel = (off: number, now: Date | null) => {
  const base = off === 0 ? "Today" : off === 1 ? "Tomorrow" : "";
  if (!now) return base || "Upcoming";
  const d = new Date(now.getTime() + off * 864e5).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return base ? `${base}, ${d}` : new Date(now.getTime() + off * 864e5).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
};

function SessionCard({ s, tab, now, i, onJoin }: { s: GameSession; tab: Tab; now: Date | null; i: number; onJoin: (s: GameSession, trigger: HTMLElement) => void }) {
  const live = tab === "live";
  const [accent] = SPORT_TONE[s.sport];
  const img = SPORTS.find((x) => x.name === s.sport)?.image ?? "";
  const pct = s.joined / s.total;
  const left = s.total - s.joined;
  return (
    <article className={`vn-card relative ${live ? "vn-live-card" : ""}`} style={{ animationDelay: `${i * 90}ms` }} aria-label={`${s.title} – ${live ? "live now" : "upcoming"}`}>
      <div className={`overflow-hidden rounded-2xl border bg-[#1e0e37]/80 backdrop-blur-sm ${live ? "border-white/25" : "border-white/15"}`}>
        <div className="relative h-[92px]">
          <Image src={img} alt="" fill sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 25vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e0e37] via-[#1e0e37]/55 to-[#1e0e37]/10" />
          <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest ${live ? "bg-red-500 text-white" : "bg-white/15 text-white backdrop-blur-sm"}`}>
            {live ? <span className="relative grid h-2 w-2 place-items-center"><span className="vn-ping absolute inset-0 rounded-full bg-white" /><span className="h-1.5 w-1.5 rounded-full bg-white" /></span> : <Clock size={11} aria-hidden="true" />}
            {live ? "Live now" : "Upcoming"}
          </span>
          {live && <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">In progress</span>}
        </div>
        <div className="relative px-4 pb-4">
          <div className="-mt-8 flex items-end justify-between gap-3">
            <SportLogo sport={s.sport} size={60} className="vn-logo" />
            <span className="mb-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80">{s.level}</span>
          </div>
          <h3 className="mt-3 text-lg font-extrabold leading-tight">{s.title}</h3>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#fbbf12" }}>{s.sport}</p>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 font-semibold text-white/80"><Users size={14} aria-hidden="true" /> Players</span>
              <span className="font-extrabold"><span className="text-base">{s.joined}</span><span className="text-white/55"> / {s.total}</span></span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={s.total} aria-valuenow={s.joined} aria-label="Players joined">
              <div className="vn-fill h-full w-full rounded-full bg-gradient-to-r from-violet to-brand" style={{ ["--p" as string]: pct, animationDelay: `${300 + i * 90}ms` }} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex -space-x-2" aria-hidden="true">
                {PLAYERS.slice(0, Math.min(4, s.joined)).map((p, k) => <span key={p} className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#1e0e37] text-[8px] font-extrabold text-white" style={{ background: `hsl(${(k * 70 + accent.length * 40) % 360} 55% 42%)` }}>{p}</span>)}
                {s.joined > 4 && <span className="grid h-6 min-w-6 place-items-center rounded-full border-2 border-[#1e0e37] bg-white/15 px-1 text-[8px] font-extrabold">+{s.joined - 4}</span>}
              </div>
              <span className={`text-[11px] font-bold ${left <= 3 ? "text-red-300" : "text-emerald-300"}`}>{left} spot{left === 1 ? "" : "s"} left</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/[.06] p-2.5">
              <p className="inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-white/55"><Wallet size={12} aria-hidden="true" /> Entry fee</p>
              <p className="mt-0.5 text-base font-extrabold">{inr(s.fee)}<span className="text-[11px] font-semibold text-white/55"> /player</span></p>
            </div>
            <div className="rounded-xl border border-brand/30 bg-brand/10 p-2.5">
              <p className="inline-flex items-center gap-1.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-brand"><Trophy size={12} className={live ? "vn-trophy" : ""} aria-hidden="true" /> Winning prize</p>
              <p className="mt-0.5 text-base font-extrabold text-brand">{inr(s.prize)}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-t border-white/10 pt-3 text-xs font-semibold text-white/80">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><CalendarDays size={14} aria-hidden="true" /> {dayLabel(s.dayOffset, now)}</span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Clock size={14} aria-hidden="true" /> {range(s.start, s.end)}</span>
          </div>
          <button type="button" disabled={left === 0} onClick={(e) => onJoin(s, e.currentTarget)} aria-label={`${left === 0 ? "Game full" : live ? "Join" : "Reserve a spot in"} ${s.title}`} className="btn mt-4 w-full">{left === 0 ? "Game full" : live ? "Join game" : "Reserve spot"}</button>
        </div>
      </div>
    </article>
  );
}

const TABS: { id: Tab; label: string }[] = [{ id: "live", label: "Live now" }, { id: "upcoming", label: "Upcoming" }];

export default function VenueSessions({ venue }: { venue: Venue }) {
  const sports = venue.sports;
  const [tab, setTab] = useState<Tab>("live");
  const [now, setNow] = useState<Date | null>(null);
  const [joining, setJoining] = useState<GameSession | null>(null);
  useEffect(() => setNow(new Date()), []);
  const src = tab === "live" ? LIVE_SESSIONS : UPCOMING_SESSIONS;
  const list = sports.map((s) => src[s]).filter(Boolean);
  const closeJoin = useCallback(() => setJoining(null), []);

  const onTabKey = (e: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const next: Tab = e.key === "Home" ? "live" : e.key === "End" ? "upcoming" : tab === "live" ? "upcoming" : "live";
    setTab(next);
    document.getElementById(`sessions-tab-${next}`)?.focus();
  };

  return (
    <section id="sessions" className="mt-14 scroll-mt-24 max-md:mt-10" aria-labelledby="sessions-title">
      <div>
        <p className="text-[11px] font-semibold tracking-[.3em] text-brand">— SESSIONS</p>
        <h2 id="sessions-title" className="mt-1 text-[34px] font-extrabold leading-none tracking-tight max-sm:text-[26px]">Games at this venue</h2>
        <p className="mt-2 max-w-xl text-sm text-white/65">Jump into a live game or reserve a spot in what&apos;s coming up next. Players, entry fee and prize pool, all in one place.</p>
      </div>

      <div role="tablist" aria-label="Session type" onKeyDown={onTabKey} className="mt-7 flex gap-8 border-b border-white/15 max-sm:gap-6">
        {TABS.map((t) => {
          const on = tab === t.id;
          return (
            <button key={t.id} id={`sessions-tab-${t.id}`} type="button" role="tab" aria-selected={on} aria-controls="sessions-panel" tabIndex={on ? 0 : -1} onClick={() => setTab(t.id)}
              className={`group relative -mb-px inline-flex items-center gap-2.5 pb-3.5 text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-transparent max-sm:text-[15px] ${on ? "text-white" : "text-white/50 hover:text-white/80"}`}>
              {t.id === "live"
                ? <span className="relative grid h-2.5 w-2.5 place-items-center" aria-hidden="true"><span className={`absolute inset-0 rounded-full bg-red-500 ${on ? "vn-ping" : "hidden"}`} /><span className={`h-2.5 w-2.5 rounded-full ${on ? "bg-red-500" : "bg-white/40"}`} /></span>
                : <Clock size={16} aria-hidden="true" />}
              {t.label}
              <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-extrabold leading-none transition-colors ${on ? "bg-brand text-[#1a1200]" : "bg-white/10 text-white/60"}`}>{sports.length}</span>
              <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-[3px] origin-left rounded-full bg-brand transition-transform duration-300 ease-out ${on ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          );
        })}
      </div>

      <div key={tab} id="sessions-panel" role="tabpanel" aria-labelledby={`sessions-tab-${tab}`} className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((s, i) => <SessionCard key={`${tab}-${s.sport}`} s={s} tab={tab} now={now} i={i} onJoin={(x) => setJoining(x)} />)}
      </div>

      {joining && (
        <JoinGameModal venue={venue} session={joining} live={tab === "live"} dayText={dayLabel(joining.dayOffset, now)} timeText={range(joining.start, joining.end)} onClose={closeJoin} />
      )}
    </section>
  );
}
