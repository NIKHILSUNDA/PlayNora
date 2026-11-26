"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, Settings } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { initials } from "@/lib/format";
import { titleFor } from "./nav";

export default function AdminTopbar({ onMenu }: { onMenu: () => void }) {
  const { user, logout } = useAdminAuth();
  const router = useRouter();
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setMenu(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setMenu(false); };
    document.addEventListener("mousedown", close); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, []);
  const out = async () => { await logout(); router.replace("/admin/login"); };
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/10 bg-[#150a28]/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button className="adm-icon-btn shrink-0 lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu size={20} /></button>
        <p className="min-w-0 truncate text-sm font-semibold text-white/60"><span className="max-sm:hidden">Admin <span className="mx-1 text-white/25">/</span> </span><span className="text-white">{titleFor(path)}</span></p>
      </div>
      <div ref={box} className="relative shrink-0">
        <button onClick={() => setMenu(!menu)} aria-haspopup="menu" aria-expanded={menu} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 transition hover:bg-white/10">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand to-pink-500 text-xs font-extrabold text-[#1a1200]">{initials(user?.name ?? "A")}</span>
          <span className="hidden text-left leading-tight sm:block"><span className="block text-[13px] font-bold">{user?.name}</span><span className="block text-[11px] text-white/50">Administrator</span></span>
          <ChevronDown size={14} className="text-white/50" aria-hidden="true" />
        </button>
        {menu && (
          <div role="menu" className="adm-fade absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#1e0e37] p-1.5 shadow-2xl">
            <p className="truncate px-3 py-2 text-xs text-white/50">{user?.email}</p>
            <Link role="menuitem" href="/admin/settings" onClick={() => setMenu(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-white/10"><Settings size={15} aria-hidden="true" />Settings</Link>
            <button role="menuitem" onClick={out} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"><LogOut size={15} aria-hidden="true" />Sign out</button>
          </div>
        )}
      </div>
    </header>
  );
}
