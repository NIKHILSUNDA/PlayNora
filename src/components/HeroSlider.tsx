"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SLIDES } from "@/data/sports";

export default function HeroSlider() {
  const [[cur, prev], set] = useState<[number, number | null]>([0, null]);
  useEffect(() => {
    const t = setInterval(() => set(([c]) => [(c + 1) % SLIDES.length, c]), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative h-[180px] w-full overflow-hidden border-[3px] border-white md:w-[220px] max-md:h-[200px] max-md:shadow-[0_16px_36px_-10px_rgba(0,0,0,.6)]">
      {SLIDES.map((s, i) => (
        <div key={s.label} className={`sl ${i === cur ? "on" : i === prev ? "out" : ""}`}>
          <Image src={s.src} alt={s.label} fill sizes="(max-width:768px) 45vw, 220px" priority={i === 0} className="object-cover" />
          <span className="absolute bottom-3 left-2 bg-ink/75 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest max-md:bottom-2 max-md:left-1.5 max-md:bg-ink/60 max-md:px-2 max-md:py-0.5 max-md:text-[10px] max-md:backdrop-blur-sm">{s.label}</span>
        </div>
      ))}
      <i key={cur} className="pg" />
    </div>
  );
}
