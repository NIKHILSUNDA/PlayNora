import { MapPin } from "lucide-react";

/** Placeholder for upcoming Delhi venues. No real names — only the city is shown. */
export default function ComingSoonVenueCard() {
  return (
    <div className="glass cs-card relative mb-4 flex flex-wrap items-center gap-4 overflow-hidden !p-3" aria-label="New Delhi venue coming soon">
      <div aria-hidden="true" className="flex flex-1 flex-wrap items-center gap-4 select-none blur-[7px]">
        <div className="h-[84px] w-full rounded bg-gradient-to-br from-violet/60 to-pink-500/50 sm:w-[140px]" />
        <div className="flex-1 space-y-2.5"><div className="h-4 w-48 max-w-full rounded bg-white/70" /><div className="h-3 w-64 max-w-full rounded bg-white/40" /><div className="h-3 w-24 rounded bg-white/40" /></div>
        <div className="h-5 w-24 rounded bg-white/60" />
      </div>
      <div className="cs-shine pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 grid place-items-center bg-[#1e0e37]/35">
        <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white"><MapPin size={15} className="text-brand" aria-hidden="true" />Delhi</span>
          <span className="cs-pulse rounded-full bg-brand px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[.2em] text-[#1a1200]">Coming soon</span>
        </div>
      </div>
    </div>
  );
}
