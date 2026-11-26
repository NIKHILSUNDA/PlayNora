"use client";
import { Instagram, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useContact } from "@/context/ContactContext";

const btn = "grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition hover:-translate-y-1.5 hover:-rotate-6 hover:scale-110 hover:bg-violet";
const link = "text-[13px] font-medium text-ink/80 transition hover:text-violet";

const RATING = 4.8;
const GREEN = "#00b67a";

function Star() {
  return <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="#fff" aria-hidden="true"><path d="M12 2.5l2.94 6.1 6.56.9-4.8 4.62 1.2 6.58L12 17.5l-5.9 3.2 1.2-6.58L2.5 9.5l6.56-.9L12 2.5z" /></svg>;
}

function Rating() {
  return (
    <div className="flex flex-col items-start gap-2 sm:items-center" role="img" aria-label={`Rated ${RATING} out of 5 stars by PlayNora users`}>
      <div className="flex gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, RATING - i)) * 100;
          return <span key={i} className="rt-star grid h-[30px] w-[30px] place-items-center" style={{ ["--i" as string]: i, background: `linear-gradient(90deg,${GREEN} ${fill}%,#dcdce6 ${fill}%)` }}><Star /></span>;
        })}
      </div>
      <p className="text-[13px] leading-none text-ink/80"><b className="text-[15px] font-extrabold text-ink">{RATING}</b> out of 5 <span className="mx-1 text-ink/30">|</span> User rating</p>
    </div>
  );
}

export default function Footer() {
  const { open } = useContact();
  return (
    <footer className="bg-cream px-[6vw] pt-10 text-ink">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex gap-3">
          <a className={btn} href="https://www.instagram.com/playnora_?evlk=eXJscDJic2x4OTRm" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
          <a className={btn} href="mailto:team@playnora.co.in" aria-label="Email"><Mail size={20} /></a>
        </div>
        <div>
          <h3 className="text-[11px] font-extrabold uppercase tracking-[.18em]">Need Guidance?</h3>
          <ul className="mt-2.5 flex flex-col items-start gap-2">
            <li><Link href="/faq" className={link}>FAQs</Link></li>
            <li><button type="button" onClick={open} className={link}>Contact us</button></li>
          </ul>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 max-sm:flex-col max-sm:items-start max-sm:gap-5 border-t border-ink/15 pb-6 pt-6">
        <div>
          <p className="text-lg font-black italic">PLAY<b className="text-[#e0a000]">NORA</b></p>
          <p className="mt-1 text-xs text-[#6b6478]">© 2026 PlayNora. All rights reserved.</p>
        </div>
        <Rating />
        <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-xs text-[#6b6478] max-sm:py-1 opacity-70 transition hover:text-violet hover:opacity-100"><Lock size={12} aria-hidden="true" />Admin Login</Link>
      </div>
    </footer>
  );
}
