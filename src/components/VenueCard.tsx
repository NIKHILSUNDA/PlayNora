import Image from "next/image";
import Link from "next/link";
import type { Venue } from "@/types";

export default function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Link href={`/venues/${venue.id}`} className="glass mb-4 flex flex-wrap items-center gap-4 !p-3 transition hover:border-white/40">
      <Image src={venue.image} alt={venue.name} width={140} height={84} sizes="(max-width:640px) 100vw, 140px" className="h-[84px] w-full rounded object-cover max-sm:h-[160px] sm:w-[140px]" />
      <div className="flex-1"><b>{venue.name}</b><p className="text-sm text-white/70">{venue.location}</p><p className="text-sm">★ <b>{venue.rating}</b> <span className="text-white/70">({venue.reviews})</span></p></div>
      <div className="text-right font-bold max-sm:w-full max-sm:border-t max-sm:border-white/10 max-sm:pt-3 max-sm:text-left">{venue.prices && <small className="font-normal">from </small>}₹{venue.pricePerHour.toLocaleString()} <small className="font-normal">/ hour</small></div>
    </Link>
  );
}
