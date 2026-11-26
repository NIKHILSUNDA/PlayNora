import { CalendarClock, Search, ShieldCheck, Trophy } from "lucide-react";
import Reveal from "@/components/Reveal";
import ArenaShowcase from "@/components/ArenaShowcase";

const STEPS = [
  { icon: Search, title: "Discover", text: "Pick your sport and explore venues that fit your game." },
  { icon: CalendarClock, title: "Choose a slot", text: "Select a date and an open time slot that works for your squad." },
  { icon: ShieldCheck, title: "Pay securely", text: "Confirm online and find your booking details in one place." },
  { icon: Trophy, title: "Play", text: "Show up, play hard and meet your people on the field." },
] as const;

export default function HomeExperience() {
  return (
    <>
      {/* How it works — light lavender */}
      <section className="overflow-x-clip bg-[#efe9fb] px-[6vw] pb-24 pt-24 text-ink max-md:pb-16 max-md:pt-16">
        <Reveal stagger className="mx-auto max-w-6xl">
          <div className="stg text-center">
            <p className="text-[11px] font-semibold tracking-[.3em] text-violet">— HOW IT WORKS</p>
            <h2 className="mt-3 text-[clamp(34px,5vw,56px)] font-black italic leading-none tracking-tight">From booking to <span className="bg-gradient-to-r from-violet to-pink-600 bg-clip-text font-serif text-transparent">full time.</span></h2>
            <p className="mx-auto mt-4 max-w-xl text-[#555]">Four simple steps between you and your next game.</p>
          </div>
          <div className="relative mt-14 max-md:mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-[2px] bg-ink/10 lg:block" aria-hidden="true"><div className="hx-line h-full w-full origin-left bg-gradient-to-r from-violet to-pink-600" /></div>
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className="stg relative text-center" style={{ transitionDelay: `${0.15 + i * 0.15}s` }}>
                <div className="hx-badge relative mx-auto grid h-16 w-16 place-items-center rounded-full border border-violet/25 bg-white text-violet shadow-[0_8px_24px_rgba(139,61,255,.18)]">
                  <Icon size={26} aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-brand text-[11px] font-black text-[#1a1200]">{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                <p className="mx-auto mt-2 max-w-[230px] text-sm leading-relaxed text-[#555]">{text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <div className="bg-page relative overflow-x-clip text-white">
        <ArenaShowcase />
      </div>
    </>
  );
}
