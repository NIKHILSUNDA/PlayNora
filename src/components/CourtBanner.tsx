import Image from "next/image";
import Reveal from "@/components/Reveal";

/** Full-bleed rackets banner with straight edges. */
export default function CourtBanner() {
  return (
    <section className="relative isolate w-full overflow-hidden" aria-label="Book the court">
      {/* Photo: spans the full width and slowly pushes in toward the rackets */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="cb-pan absolute inset-0">
          <Image src="/images/rackets.jpg" alt="" fill sizes="100vw" quality={80} className="object-cover [object-position:50%_38%]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#04122e]/60 via-[#04122e]/10 to-transparent" />
      </div>

      <Reveal stagger className="relative flex min-h-[640px] items-start px-[6vw] pb-24 pt-28 max-sm:min-h-[520px] max-sm:pb-16 max-sm:pt-24 lg:min-h-[880px] lg:pt-32">
        <h2 className="stg max-w-3xl text-[clamp(44px,7.5vw,104px)] max-md:text-[clamp(38px,12vw,64px)] font-black italic leading-[.95] tracking-tight">
          Book the court.<br />
          <span className="bg-gradient-to-r from-cyan-200 to-sky-400 bg-clip-text font-serif text-transparent">Bring the crew.</span>
        </h2>
      </Reveal>
    </section>
  );
}
