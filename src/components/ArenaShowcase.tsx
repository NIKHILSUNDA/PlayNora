"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const ARENAS = [
  { name: "Football", tag: "Turf & Squads", title: "Own the turf.", text: "Turf football with your squad. Pick a slot, bring your people and play 5-a-side or 7-a-side.", image: "/images/arena/football.jpg", glow: "#f97316" },
  { name: "Box Cricket", tag: "Night games", title: "Play after dark.", text: "Bright lights, fast overs and a box built for quick, high-energy matches with your friends.", image: "/images/arena/cricket.jpg", glow: "#a3e635" },
  { name: "Pickleball", tag: "Easy to start", title: "Easy to learn. Hard to quit.", text: "Grab a paddle, find a partner and rally. A game for every age and every level.", image: "/images/arena/pickleball.jpg", glow: "#38bdf8" },
] as const;

const DURATION = 6000;
const n = ARENAS.length;

export default function ArenaShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % n), DURATION);
    return () => clearTimeout(t);
  }, [active]);

  const cur = ARENAS[active];

  return (
    <section className="relative isolate overflow-hidden py-24 max-md:py-16" aria-label="Pick your arena">
      {/* Ambient background: each sport's own colours, blurred */}
      <div className="absolute inset-0 [mask-image:linear-gradient(transparent,#000_18%,#000_82%,transparent)]" aria-hidden="true">
        {ARENAS.map((a, i) => (
          <div key={a.name} className={`absolute inset-0 transition-opacity duration-1000 ${i === active ? "opacity-100" : "opacity-0"}`}>
            <Image src={a.image} alt="" fill sizes="100vw" className="ar-zoom scale-125 object-cover blur-2xl" />
          </div>
        ))}
        <div className="absolute inset-0 bg-[#12062a]/45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#12062a]/95 via-[#12062a]/55 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-[6vw] max-md:gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <p className="text-[11px] font-semibold tracking-[.3em] text-brand">— PICK YOUR ARENA</p>
          <h2 className="mt-3 text-[clamp(34px,5vw,56px)] font-black italic leading-none tracking-tight">Many games. <span className="bg-gradient-to-r from-brand to-pink-500 bg-clip-text font-serif text-transparent">One community.</span></h2>
          <p className="mt-4 max-w-md text-white/75">PlayNora is building a sports community in South Delhi, so every game comes with people to play it with.</p>

          <ul className="mt-9 border-t border-white/15" role="tablist" aria-label="Sports">
            {ARENAS.map((a, i) => {
              const on = i === active;
              return (
                <li key={a.name} className="border-b border-white/15">
                  <button role="tab" aria-selected={on} onClick={() => setActive(i)} className="group relative flex w-full items-center gap-5 py-5 text-left max-sm:gap-4 max-sm:py-4">
                    <span className={`text-sm font-black tabular-nums transition ${on ? "text-brand" : "text-white/35"}`}>0{i + 1}</span>
                    <span className={`flex-1 text-[clamp(24px,3.4vw,36px)] font-black italic leading-none transition duration-300 ${on ? "translate-x-2 text-white" : "text-white/40 group-hover:text-white/75"}`}>{a.name}</span>
                    <span className={`hidden rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest transition sm:inline-block ${on ? "border-brand text-brand" : "border-white/20 text-white/40"}`}>{a.tag}</span>
                    {on && <span key={active} className="ar-prog absolute bottom-[-1px] left-0 h-[2px] w-full origin-left bg-gradient-to-r from-brand to-pink-500" style={{ animationDuration: `${DURATION}ms` }} />}
                  </button>
                </li>
              );
            })}
          </ul>

          <div key={active} className="ar-in mt-8 min-h-[150px]" aria-live="polite">
            <h3 className="text-2xl font-black italic">{cur.title}</h3>
            <p className="mt-2 max-w-md leading-relaxed text-white/80">{cur.text}</p>
            <Link href="/venues" className="btn mt-6 !px-7">Explore Venues <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>

        {/* Card deck */}
        <div className="relative mx-auto h-[460px] w-full max-w-[420px] max-sm:h-[400px] sm:h-[540px]" role="group" aria-label="Sport gallery">
          <span className="ar-glow absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-colors duration-1000" style={{ background: cur.glow, opacity: 0.45 }} aria-hidden="true" />
          {ARENAS.map((a, i) => {
            const pos = (i - active + n) % n; // 0 = front
            const style = [
              { transform: "translateX(0) rotate(0deg) scale(1)", zIndex: 30, opacity: 1 },
              { transform: "translateX(18%) rotate(7deg) scale(.9)", zIndex: 20, opacity: 0.85 },
              { transform: "translateX(34%) rotate(13deg) scale(.8)", zIndex: 10, opacity: 0.6 },
            ][pos];
            return (
              <button key={a.name} onClick={() => setActive(i)} aria-label={`Show ${a.name}`} tabIndex={pos === 0 ? -1 : 0}
                className="absolute inset-0 mx-auto h-full w-[78%] max-sm:w-[72%] overflow-hidden rounded-[28px] border-[3px] border-white/90 shadow-[0_30px_70px_rgba(0,0,0,.55)] transition-all duration-700 ease-[cubic-bezier(.22,.8,.3,1)]"
                style={style}>
                <Image src={a.image} alt={`${a.name} at PlayNora`} fill sizes="(max-width:1024px) 70vw, 340px" className="object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full bg-brand px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-[#1a1200]">{a.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
