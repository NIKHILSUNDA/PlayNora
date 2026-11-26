"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Mail, Phone, X, ArrowUpRight } from "lucide-react";

const PHONES = [
  { display: "+91 95558 82883", tel: "+919555882883" },
  { display: "+91 82875 99615", tel: "+918287599615" },
];
const EMAIL = "team@playnora.co.in";

const Ctx = createContext<{ open: () => void }>({ open: () => {} });
export const useContact = () => useContext(Ctx);

export function ContactProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = useCallback(() => setShow(true), []);
  const close = useCallback(() => setShow(false), []);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [show, close]);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {show && (
        <div className="ct-back fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[#0b0418]/70 p-4 max-md:p-5 max-md:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-md:pt-[max(1.25rem,env(safe-area-inset-top))] backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && close()}>
          <div role="dialog" aria-modal="true" aria-labelledby="ct-title" className="ct-pop relative w-full max-w-[440px] overflow-hidden rounded-3xl max-md:max-h-[calc(100dvh-2.5rem)] max-md:overflow-y-auto max-md:rounded-2xl bg-white text-ink shadow-[0_30px_80px_rgba(0,0,0,.5)]">
            <div className="ct-head relative overflow-hidden px-7 pb-7 pt-8 text-white max-md:px-5 max-md:pb-5 max-md:pt-6">
              <span className="ct-blob" aria-hidden="true" />
              <button ref={closeRef} onClick={close} aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/15 transition hover:rotate-90 hover:bg-white/30"><X size={18} /></button>
              <p className="text-[11px] font-semibold tracking-[.3em] text-brand">— GET IN TOUCH</p>
              <h2 id="ct-title" className="mt-2 text-[32px] max-md:text-[28px] font-black italic leading-none">Contact us</h2>
              <p className="mt-2 max-w-[320px] text-sm text-white/80">Questions about a game, a venue or the community? We’re a call or a mail away.</p>
            </div>
            <div className="grid gap-3 p-6 max-md:gap-2.5 max-md:p-4">
              {PHONES.map((p, i) => (
                <a key={p.tel} href={`tel:${p.tel}`} className="ct-item group flex items-center gap-4 rounded-2xl border border-ink/10 bg-cream p-4 max-md:gap-3 max-md:p-3 transition hover:-translate-y-0.5 hover:border-violet/40 hover:shadow-lg" style={{ animationDelay: `${0.15 + i * 0.1}s` }}>
                  <span className="ct-icon grid h-12 w-12 max-md:h-10 max-md:w-10 shrink-0 place-items-center rounded-full bg-violet text-white"><Phone size={20} aria-hidden="true" /></span>
                  <span className="flex-1"><span className="block text-[11px] font-bold uppercase tracking-widest text-ink/50">Call {i === 0 ? "· Primary" : "· Alternate"}</span><span className="block text-lg max-md:whitespace-nowrap max-md:text-[clamp(14px,4.4vw,16px)] font-extrabold">{p.display}</span></span>
                  <ArrowUpRight size={20} aria-hidden="true" className="text-ink/30 transition group-hover:text-violet" />
                </a>
              ))}
              <a href={`mailto:${EMAIL}`} className="ct-item group flex items-center gap-4 rounded-2xl border border-ink/10 bg-cream p-4 max-md:gap-3 max-md:p-3 transition hover:-translate-y-0.5 hover:border-violet/40 hover:shadow-lg" style={{ animationDelay: "0.35s" }}>
                <span className="ct-icon grid h-12 w-12 max-md:h-10 max-md:w-10 shrink-0 place-items-center rounded-full bg-brand text-[#1a1200]"><Mail size={20} aria-hidden="true" /></span>
                <span className="min-w-0 flex-1"><span className="block text-[11px] font-bold uppercase tracking-widest text-ink/50">Email</span><span className="block truncate text-lg max-md:text-[clamp(12px,3.8vw,15px)] font-extrabold">{EMAIL}</span></span>
                <ArrowUpRight size={20} aria-hidden="true" className="text-ink/30 transition group-hover:text-violet" />
              </a>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
