import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import SportCard from "@/components/SportCard";
import { SPORTS } from "@/data/sports";
import HomeExperience from "@/components/HomeExperience";

export default function Home() {
  return (
    <>
      {/* cream backdrop so the slanted cut-out never reveals the dark body colour */}
      <div className="bg-cream">
      <section className="relative min-h-[640px] overflow-hidden px-[6vw] pb-36 pt-28 max-md:pb-28 [clip-path:polygon(0_0,100%_0,100%_88%,0_100%)]">
        <Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 [mask-image:linear-gradient(90deg,#000_20%,#000_55%,transparent_88%)]"><Image src="/images/hero-blur.jpg" alt="" fill sizes="100vw" className="object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f28]/80 to-transparent" />
        <div className="relative">
          <h1 className="ml-[5vw] text-[clamp(54px,10vw,128px)] max-md:text-[clamp(34px,12vw,64px)] font-black italic leading-none tracking-tight">Your Game.</h1>
          <span className="ml-[8vw] block bg-gradient-to-r from-brand to-pink-500 bg-clip-text font-serif text-[clamp(54px,10vw,128px)] max-md:text-[clamp(34px,12vw,64px)] font-bold italic leading-none text-transparent">Your People.</span>
          <div className="mt-8 flex flex-wrap items-center gap-7 max-md:mt-7 max-md:grid max-md:grid-cols-[42%_1fr] max-md:items-center max-md:gap-x-4 max-md:gap-y-6">
            <HeroSlider />
            <div className="max-w-[430px] leading-relaxed max-md:contents">
              <p className="max-md:text-[13px] max-md:leading-relaxed">Discover venues, find games, and connect with a community that plays together. More than just a game — it’s a lifestyle.</p>
              <div className="mt-5 flex items-center gap-5 max-md:col-span-2 max-md:mt-0 max-md:gap-3"><Link href="/play" className="btn max-md:flex-1">Find a game →</Link><Link href="/venues" className="border-b border-white text-xs font-semibold uppercase max-md:flex-1 max-md:border max-md:border-white/60 max-md:py-3.5 max-md:text-center max-md:tracking-widest max-md:backdrop-blur-sm">Explore venues</Link></div>
            </div>
          </div>
        </div>
      </section>
      </div>
      <section className="-mt-20 grid items-center gap-12 bg-cream px-[6vw] pb-20 pt-36 text-ink max-md:gap-8 max-md:pb-16 max-md:pt-32 md:grid-cols-[1fr_2fr]">
        <div><p className="text-[11px] font-semibold tracking-[.3em]">— EXPLORE SPORTS</p><h2 className="my-3 text-[44px] font-extrabold leading-none tracking-tight max-sm:text-[34px]">Play Your<br />Favourite Sport</h2><p className="leading-relaxed text-[#555]">From football to pickleball, we bring your favourite sports closer — with great venues, exciting games and an active community.</p><Link href="/play" className="mt-6 inline-block border-b border-current text-[11px] font-semibold tracking-[.3em] text-[#e0502a]">VIEW ALL SPORTS →</Link></div>
        <div className="grid gap-5 md:grid-cols-3">{SPORTS.filter((s) => s.name !== "Padel").map((s) => <SportCard key={s.slug} name={s.name} image={s.image} variant="slant" />)}</div>
      </section>
      <HomeExperience />
    </>
  );
}
