"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useContact } from "@/context/ContactContext";
import { LogOut, Menu, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LINKS = [["/", "Home"], ["/play", "Play"], ["/venues", "Venues"], ["/community", "Community"]] as const;

export default function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { open: openContact } = useContact();
  const { user, ready, logout } = useAuth();

  // Close the mobile menu after navigating.
  useEffect(() => setOpen(false), [path]);

  // Mobile only: tint the (fixed) bar once the page scrolls under it.
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // While the mobile menu is open: lock background scroll, close on Esc or when the viewport grows to desktop.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => { if (mq.matches) setOpen(false); };
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); mq.removeEventListener("change", onMq); };
  }, [open]);

  const item = (i: number) => ({ ["--i" as string]: i }) as React.CSSProperties;

  return (
    <nav className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-[6vw] py-3 text-white max-md:fixed" aria-label="Main">
      <span aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 bg-[#1a0b2e]/85 shadow-[0_8px_30px_rgba(0,0,0,.35)] backdrop-blur-md transition-opacity duration-300 md:hidden ${scrolled && !open ? "opacity-100" : "opacity-0"}`} />
      <Link href="/" className="max-md:relative max-md:z-20"><Image src="/images/logo.png" alt="PlayNora" width={160} height={44} priority className="h-11 w-auto" /></Link>
      <button type="button" className="relative z-20 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/5 md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}</button>
      <div id="mobile-menu" className={`${open ? "nv-open max-md:visible max-md:opacity-100" : "max-md:pointer-events-none max-md:invisible max-md:opacity-0"} nv-panel flex max-md:fixed max-md:inset-0 max-md:z-10 max-md:overflow-hidden max-md:transition-[opacity,visibility] max-md:duration-300 flex-col items-start gap-4 rounded-xl max-md:rounded-none text-[13px] font-medium uppercase md:static md:flex md:flex-row md:items-center md:gap-[clamp(1.25rem,calc(9.5vw_-_56px),9rem)] md:bg-transparent md:p-0`}>
        {/* Mobile: the scrolling happens in this wrapper; links fade out under the logo bar instead of overlapping it. md:contents = no effect on desktop. */}
        <div className="max-md:flex max-md:h-full max-md:w-full max-md:flex-col max-md:items-start max-md:gap-4 max-md:overflow-y-auto max-md:overscroll-contain max-md:px-[6vw] max-md:pb-10 max-md:pt-28 max-md:[-webkit-mask-image:linear-gradient(to_bottom,transparent_0,transparent_64px,#000_96px)] max-md:[mask-image:linear-gradient(to_bottom,transparent_0,transparent_64px,#000_96px)] md:contents">
        {LINKS.map(([href, label], i) => (
          <Link key={href} href={href} onClick={() => setOpen(false)} style={item(i)} className={`nv-item border-b-2 py-1 max-md:py-2 max-md:text-[28px] max-md:font-extrabold max-md:leading-tight ${path === href ? "border-brand" : "border-transparent opacity-85 hover:opacity-100"}`}>{label}</Link>
        ))}
        <button type="button" onClick={() => { setOpen(false); openContact(); }} style={item(LINKS.length)} className="nv-item border-b-2 border-transparent py-1 uppercase opacity-85 hover:opacity-100 max-md:py-2 max-md:text-[28px] max-md:font-extrabold max-md:leading-tight">Contact Us</button>
        {ready && (user ? (
          <div style={item(LINKS.length + 1)} className="nv-item flex items-center gap-3 max-md:mt-6 max-md:w-full max-md:justify-between max-md:border-t max-md:border-white/15 max-md:pt-6">
            <span className="inline-flex min-w-0 items-center gap-2 rounded-full border border-white/25 py-1.5 pl-1.5 pr-4 text-[13px] font-semibold normal-case"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-extrabold uppercase text-[#1a1200]">{user.name.charAt(0)}</span><span className="truncate">{user.name.split(" ")[0]}</span></span>
            <button type="button" onClick={() => { setOpen(false); logout(); }} aria-label="Log out" title="Log out" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/25 transition hover:bg-white/10"><LogOut size={16} aria-hidden="true" /></button>
          </div>
        ) : (
          <Link href="/login" onClick={() => setOpen(false)} style={item(LINKS.length + 1)} className={`nv-item inline-flex items-center gap-2 px-5 py-3 font-bold uppercase text-[#111] transition hover:bg-brand max-md:mt-6 max-md:w-full max-md:justify-center max-md:py-4 ${path === "/login" ? "bg-brand" : "bg-white"}`}><User size={16} aria-hidden="true" />Login</Link>
        ))}
        </div>
      </div>
    </nav>
  );
}
