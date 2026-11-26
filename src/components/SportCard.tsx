import Image from "next/image";
import Link from "next/link";
import type { Sport } from "@/types";

export default function SportCard({ name, image, variant }: { name: Sport; image: string; variant: "slant" | "tall" }) {
  const slant = variant === "slant";
  return (
    <Link href={`/venues?sport=${encodeURIComponent(name)}`} className={`group relative flex items-end overflow-hidden p-5 text-white ${slant ? "h-[200px] rounded md:h-[270px] md:-skew-x-[8deg]" : "h-[310px] rounded-xl max-sm:h-[210px] max-sm:p-4"}`}>
      <Image src={image} alt="" fill sizes="(max-width:768px) 100vw, 33vw" className={`object-cover transition-transform duration-500 group-hover:scale-105 ${slant ? "md:skew-x-[8deg] md:scale-125" : ""}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
      <span className={`relative flex w-full items-center justify-between text-2xl font-extrabold ${slant ? "md:skew-x-[8deg]" : "max-sm:text-lg"}`}>{name}<span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm text-black">→</span></span>
    </Link>
  );
}
