"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ExternalLink, X } from "lucide-react";
import { NAV } from "./nav";

export default function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  const close = useRef(onClose);
  close.current = onClose;
  // Off-canvas menu open: lock background scroll, close on Esc, and close if the viewport grows to the desktop layout.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close.current(); };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => { if (mq.matches) close.current(); };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); mq.removeEventListener("change", onMq); };
  }, [open]);
  return (
    <>
      {open && <div className="adm-fade fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} aria-hidden="true" />}
      <aside aria-label="Admin navigation" className={`fixed inset-y-0 left-0 z-50 flex w-[272px] max-w-[86vw] flex-col border-r border-white/10 bg-[#150a28] transition-[transform,visibility] duration-300 lg:visible lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "visible translate-x-0" : "invisible -translate-x-full"}`}>
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
          <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-2"><Image src="/images/logo.png" alt="PlayNora" width={130} height={36} className="h-7 w-auto" /><span className="rounded bg-brand/15 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-brand">Admin</span></Link>
          <button className="adm-icon-btn lg:hidden" onClick={onClose} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {NAV.map((g) => (
            <div key={g.title}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-white/35">{g.title}</p>
              <ul className="space-y-1">
                {g.items.map(({ href, label, icon: Icon }) => {
                  const on = path === href || path.startsWith(`${href}/`);
                  return <li key={href}><Link href={href} aria-current={on ? "page" : undefined} className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${on ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}>{on && <i className="absolute inset-y-2 left-0 w-[3px] rounded-r bg-brand" aria-hidden="true" />}<Icon size={18} className={on ? "text-brand" : "text-white/50 transition group-hover:text-white/80"} aria-hidden="true" />{label}</Link></li>;
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3"><Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/5 hover:text-white"><ExternalLink size={18} aria-hidden="true" />Back to website</Link></div>
      </aside>
    </>
  );
}
