"use client";
import { useMemo, useState } from "react";
import { CalendarCheck, ChevronDown, CreditCard, FileText, Headset, Search, SearchX, UserRound, X } from "lucide-react";
import { FAQ_CATEGORIES } from "@/data/faqs";
import { useContact } from "@/context/ContactContext";

const ICONS = { booking: CalendarCheck, payments: CreditCard, cancellation: FileText, account: UserRound } as const;

export default function FaqExplorer() {
  const [cat, setCat] = useState<string>(FAQ_CATEGORIES[0].id);
  const [query, setQuery] = useState("");
  const [openKey, setOpenKey] = useState<string | null>(null);
  const { open: openContact } = useContact();
  const q = query.trim().toLowerCase();

  const rows = useMemo(() => {
    const list = q ? FAQ_CATEGORIES : FAQ_CATEGORIES.filter((c) => c.id === cat);
    return list.flatMap((c) => c.items.filter((i) => !q || i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q)).map((i) => ({ ...i, cat: c })));
  }, [q, cat]);

  return (
    <div>
      <div className="faq-rise relative mx-auto max-w-2xl">
        <Search size={20} aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/50" />
        <input
          type="search" value={query} onChange={(e) => { setQuery(e.target.value); setOpenKey(null); }}
          placeholder="Search questions, e.g. refund, cancel, payment…" aria-label="Search FAQs"
          className="w-full rounded-full border border-white/20 bg-white/10 py-4 pl-14 pr-12 text-base text-white outline-none backdrop-blur transition placeholder:text-white/45 focus:border-brand focus:bg-white/15 focus:ring-2 focus:ring-brand/30 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/15 transition hover:bg-white/30"><X size={16} /></button>}
      </div>

      <div className="mt-10 grid gap-4 max-sm:grid-cols-2 max-sm:gap-3 sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="FAQ categories">
        {FAQ_CATEGORIES.map((c, i) => {
          const Icon = ICONS[c.id as keyof typeof ICONS];
          const active = !q && c.id === cat;
          return (
            <button key={c.id} role="tab" aria-selected={active} onClick={() => { setCat(c.id); setQuery(""); setOpenKey(null); }}
              style={{ animationDelay: `${0.08 * i}s` }}
              className={`faq-rise group relative overflow-hidden rounded-2xl border p-5 max-sm:p-3.5 text-left transition duration-300 hover:-translate-y-1 ${active ? "border-brand bg-gradient-to-br from-brand/20 to-pink-500/10 shadow-[0_10px_40px_rgba(251,191,18,.15)]" : "border-white/15 bg-white/5 hover:border-white/35 hover:bg-white/10"} ${q ? "opacity-60" : ""}`}>
              <span className={`grid h-11 w-11 place-items-center rounded-xl transition duration-300 group-hover:rotate-6 group-hover:scale-110 ${active ? "bg-brand text-[#1a1200]" : "bg-white/10 text-brand"}`}><Icon size={22} aria-hidden="true" /></span>
              <span className="mt-4 block text-[17px] font-extrabold leading-tight max-sm:mt-3 max-sm:text-[14px]">{c.title}</span>
              <span className="mt-1 block text-[13px] text-white/60 max-sm:hidden">{c.blurb}</span>
              <span className="mt-3 max-sm:mt-2 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold">{c.items.length} questions</span>
              <span className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-brand transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          );
        })}
      </div>

      <div className="mx-auto mt-10 max-w-3xl" aria-live="polite">
        <p className="mb-4 text-sm text-white/60">
          {q ? <>{rows.length} result{rows.length === 1 ? "" : "s"} for “{query.trim()}”</> : <>Showing <b className="text-white">{FAQ_CATEGORIES.find((c) => c.id === cat)?.title}</b></>}
        </p>
        {rows.length === 0 ? (
          <div className="faq-rise glass grid place-items-center gap-2 py-12 text-center">
            <SearchX size={36} aria-hidden="true" className="text-brand" />
            <p className="text-lg font-bold">No matching questions</p>
            <p className="text-sm text-white/60">Try different words, or reach out to our team directly.</p>
          </div>
        ) : (
          <ul key={q ? `s-${q}` : cat} className="grid gap-3">
            {rows.map((r, i) => {
              const key = `${r.cat.id}-${r.q}`;
              const isOpen = openKey === key;
              return (
                <li key={key} style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }} className={`faq-rise overflow-hidden rounded-2xl border transition-colors duration-300 ${isOpen ? "border-brand/60 bg-white/10" : "border-white/15 bg-white/5 hover:border-white/30"}`}>
                  <button onClick={() => setOpenKey(isOpen ? null : key)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                    <span>
                      {q && <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-brand">{r.cat.title}</span>}
                      <span className="text-[16px] font-bold leading-snug">{r.q}</span>
                    </span>
                    <ChevronDown size={20} aria-hidden="true" className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand" : "text-white/60"}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden"><p className="px-5 pb-5 leading-relaxed text-white/80">{r.a}</p></div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="faq-rise mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/15 bg-gradient-to-r from-violet/30 to-pink-500/20 p-6">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-[#1a1200]"><Headset size={22} aria-hidden="true" /></span>
            <div><p className="font-extrabold">Still need help?</p><p className="text-sm text-white/70">Our team is happy to assist you.</p></div>
          </div>
          <button type="button" onClick={openContact} className="btn max-sm:w-full">Contact us</button>
        </div>
      </div>
    </div>
  );
}
