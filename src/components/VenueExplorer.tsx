"use client";
import { useMemo, useState } from "react";
import VenueCard from "./VenueCard";
import ComingSoonVenueCard from "./ComingSoonVenueCard";
import type { Sport, Venue } from "@/types";

const ALL: Sport[] = ["Football", "Box Cricket", "Pickleball", "Padel"];
export default function VenueExplorer({ venues, initialSport }: { venues: Venue[]; initialSport?: Sport }) {
  const [sports, setSports] = useState<Sport[]>(initialSport ? [initialSport] : []);
  const [q, setQ] = useState("");
  const list = useMemo(() => venues.filter((v) => (!sports.length || sports.some((s) => v.sports.includes(s))) && `${v.name} ${v.location}`.toLowerCase().includes(q.toLowerCase())), [venues, sports, q]);
  const toggle = (s: Sport) => setSports((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));
  return (
    <div className="grid gap-6 md:grid-cols-[260px_1fr]">
      <aside className="glass h-fit text-sm max-md:!p-4">
        <h4 className="mb-2 text-xs font-bold">Sport</h4>
        <div className="max-md:flex max-md:flex-wrap max-md:gap-2">
          {ALL.map((s) => <label key={s} className="my-2 flex gap-2 max-md:m-0 max-md:gap-0"><input type="checkbox" className="peer max-md:sr-only" checked={sports.includes(s)} onChange={() => toggle(s)} /><span className="max-md:rounded-full max-md:border max-md:border-white/25 max-md:px-4 max-md:py-2 max-md:text-[13px] max-md:font-semibold max-md:transition max-md:peer-checked:border-violet max-md:peer-checked:bg-violet max-md:peer-focus-visible:ring-2 max-md:peer-focus-visible:ring-brand">{s}</span></label>)}
        </div>
        <h4 className="mb-2 mt-4 text-xs font-bold">Location</h4>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search location" aria-label="Search venues" className="w-full rounded border border-white/20 bg-white/5 p-2.5 max-md:text-base" />
      </aside>
      <div>
        {list.length ? list.map((v) => <VenueCard key={v.id} venue={v} />) : <div className="glass py-8 text-center text-white/70">No venues match your filters.</div>}
        {!q && !sports.length && <><ComingSoonVenueCard /><ComingSoonVenueCard /></>}
      </div>
    </div>
  );
}
