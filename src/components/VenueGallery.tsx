"use client";
import Image from "next/image";
import { useState } from "react";

export default function VenueGallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <div className="relative h-[300px] overflow-hidden rounded-xl md:h-[360px]">
        <Image src={images[i]} alt={`${name} photo ${i + 1}`} fill priority sizes="(max-width:768px) 100vw, 60vw" className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, k) => (
            <button key={src} onClick={() => setI(k)} aria-label={`Show photo ${k + 1}`} aria-pressed={k === i} className={`relative h-14 overflow-hidden rounded border-2 sm:h-16 ${k === i ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"}`}>
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
