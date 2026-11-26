import type { Metadata } from "next";
import { Users, Trophy, CalendarDays, MessageCircle } from "lucide-react";
import CommunityOrbit from "@/components/CommunityOrbit";

export const metadata: Metadata = {
  title: "Community – PlayNora",
  description: "Join PlayNora's sports community in South Delhi.",
};

const WHATSAPP_URL = "https://chat.whatsapp.com/CBL8fMPQkMm5lHvK3iFFom?s=sw&p=i&iam=2";

const PERKS = [
  { icon: Users, label: "Meet players" },
  { icon: CalendarDays, label: "Organised matches" },
  { icon: Trophy, label: "Tournaments & leagues" },
] as const;

export default function CommunityPage() {
  return (
    <section className="bg-page relative min-h-screen overflow-hidden px-[6vw] pb-24 pt-32 max-md:pb-16 max-md:pt-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="cm-rise">
          <p className="text-[11px] font-semibold tracking-[.3em] text-brand">— THE COMMUNITY</p>
          <h1 className="my-4 text-[clamp(40px,6vw,72px)] max-md:text-[clamp(36px,11vw,56px)] font-black italic leading-none tracking-tight">
            Let the games<br />
            <span className="bg-gradient-to-r from-brand to-pink-500 bg-clip-text font-serif text-transparent">begin.</span>
          </h1>
          <p className="max-w-[480px] text-lg leading-relaxed text-white/85 max-sm:text-base">
            PlayNora is building a sports community in South Delhi, where people can discover games, meet other players and participate in organised matches, tournaments and leagues.
          </p>
          <p className="mt-4 max-w-[480px] text-lg font-semibold leading-relaxed max-sm:text-base">
            Join our community and register for the next session. Let the games begin.
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {PERKS.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[13px] font-semibold">
                <Icon size={16} aria-hidden="true" className="text-brand" />{label}
              </li>
            ))}
          </ul>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn cm-pulse mt-9 !px-8 !py-4 text-sm max-sm:w-full">
            <MessageCircle size={18} aria-hidden="true" />Join the Community
          </a>
          <p className="mt-3 text-xs text-white/55">Opens our WhatsApp community.</p>
        </div>
        <CommunityOrbit />
      </div>
    </section>
  );
}
