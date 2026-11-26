import SportCard from "@/components/SportCard";
import { SPORTS } from "@/data/sports";

export default function Play() {
  return (
    <div className="bg-page min-h-screen px-[6vw] pb-16 pt-28">
      <h1 className="text-[clamp(40px,6vw,68px)] font-extrabold leading-none tracking-tight">Choose Your <span className="block font-serif italic text-brand">Sport</span></h1>
      <div className="mt-10 grid gap-5 max-sm:grid-cols-2 max-sm:gap-3 sm:grid-cols-2 lg:grid-cols-4">{SPORTS.map((s) => <SportCard key={s.slug} name={s.name} image={s.image} variant="tall" />)}</div>
    </div>
  );
}
