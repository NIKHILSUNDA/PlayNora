import Image from "next/image";
import { notFound } from "next/navigation";
import VenueGallery from "@/components/VenueGallery";
import VenueAmenities from "@/components/VenueAmenities";
import VenueMap from "@/components/VenueMap";
import VenueSessions from "@/components/VenueSessions";
import { slugOf } from "@/data/sports";
import { venueService } from "@/services/api";

export default async function VenueDetail({ params }: { params: { id: string } }) {
  const { data: v } = await venueService.get(params.id);
  if (!v) notFound();
  const parts = v.location.split(",").map((p) => p.trim());
  const area = parts.slice(1, 3).join(", ") || v.location;
  return (
    <div className="relative min-h-screen px-[6vw] pb-16 pt-28">
      <Image src={`/images/bg/${slugOf(v.sports[0])}.jpg`} alt="" fill sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-ink/80" />
      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-start">
        <div>
          <VenueGallery images={v.images?.length ? v.images : [v.image]} name={v.name} />
          <h1 className="mb-2 mt-5 text-[46px] font-extrabold leading-none max-sm:text-[32px]">{v.name}</h1>
          <p className="text-white/70">📍 {v.location} · <span className="text-brand">★</span> {v.rating} ({v.reviews} reviews)</p>
          <div className="mt-5 flex flex-wrap gap-2">{v.sports.map((s) => <span key={s} className="rounded border border-white/40 px-3 py-1 text-xs">{s}</span>)}</div>
        </div>
        <div>
          <VenueMap name={v.name} location={v.location} geo={v.geo} />
          <p className="mt-4 max-w-md leading-relaxed text-white/75">
            Easy to find, easier to play. Tap Directions and your next game in {area} is just a drive away, so bring your squad and make it count.
          </p>
        </div>
      </div>
      <VenueAmenities />
      <VenueSessions venue={v} />
    </div>
  );
}
