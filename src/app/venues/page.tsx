import VenueExplorer from "@/components/VenueExplorer";
import { venueService } from "@/services/api";
import type { Sport } from "@/types";

export default async function Venues({ searchParams }: { searchParams: { sport?: string } }) {
  const { data } = await venueService.list();
  const sport = (["Football", "Box Cricket", "Pickleball", "Padel"] as Sport[]).find((s) => s === searchParams.sport);
  return (
    <div className="bg-page min-h-screen px-[6vw] pb-16 pt-28">
      <h1 className="pb-8 text-[clamp(40px,6vw,68px)] font-extrabold leading-none tracking-tight">Find &amp; Book <span className="block font-serif italic text-brand">Venues</span></h1>
      <VenueExplorer venues={data ?? []} initialSport={sport} />
    </div>
  );
}
