import { ExternalLink, MapPin, Navigation } from "lucide-react";
import type { Venue } from "@/types";

/** Live Google Map (embed, no API key) + one-tap links to open it in Google Maps.
 *  On md+ the block is exactly as tall as the main gallery image (md:h-[360px] in VenueGallery),
 *  so its bottom edge lines up with the bottom of that image and never runs past it. */
export default function VenueMap({ name, location, geo }: { name: string; location: string; geo?: Venue["geo"] }) {
  // Exact pin when coordinates are known, otherwise fall back to a text search.
  const text = encodeURIComponent(`${name.replace(/\|/g, ",")}, ${location}`);
  const ll = geo ? `${geo.lat},${geo.lng}` : "";
  const label = encodeURIComponent(geo?.placeName ?? name.split("|")[0].trim());
  const embed = geo ? `https://maps.google.com/maps?q=${ll}(${label})&z=16&output=embed` : `https://maps.google.com/maps?q=${text}&z=15&output=embed`;
  const open = geo?.mapUrl ?? (geo ? `https://www.google.com/maps/search/?api=1&query=${ll}` : `https://www.google.com/maps/search/?api=1&query=${text}`);
  const dir = `https://www.google.com/maps/dir/?api=1&destination=${geo ? ll : text}`;
  return (
    <section aria-label="Venue location" className="md:h-[360px]">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/[.06] backdrop-blur-sm md:h-full">
        <div className="relative bg-ink/60 max-md:h-[230px] md:min-h-0 md:flex-1">
          <iframe title={`Map showing ${name}`} src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="absolute inset-0 h-full w-full border-0" />
          <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-sm">
            <span className="relative grid h-2 w-2 place-items-center"><span className="vn-ping absolute inset-0 rounded-full bg-emerald-400" /><span className="h-2 w-2 rounded-full bg-emerald-400" /></span>Live map
          </span>
        </div>
        <div className="flex flex-col gap-3 p-3.5">
          <div className="flex items-start gap-2.5">
            <MapPin size={16} className="vn-pin mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            <p className="line-clamp-2 text-[13px] leading-snug text-white/80">{location}</p>
          </div>
          <div className="flex gap-2">
            <a href={open} target="_blank" rel="noopener noreferrer" className="btn flex-1 !px-3 !py-2.5">Open in Maps <ExternalLink size={14} aria-hidden="true" /></a>
            <a href={dir} target="_blank" rel="noopener noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-[3px] border border-white/40 px-3 py-2.5 text-[13px] font-extrabold uppercase transition hover:bg-white/10">Directions <Navigation size={14} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
