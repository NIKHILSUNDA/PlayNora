"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Info, Loader2, ShieldAlert } from "lucide-react";
import { USE_MOCK } from "@/config/api";
import { useAdminAuth } from "@/context/AdminAuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const Screen = ({ children }: { children: ReactNode }) => <div className="grid min-h-screen place-items-center bg-[#120824] px-6 text-center text-white">{children}</div>;

/**
 * Layout + route guard for every /admin page except login.
 * The guard is a usability layer (no flash of protected UI, friendly redirects).
 * It is NOT the security boundary: the backend authorises every API call by ADMIN role.
 */
export default function AdminShell({ children }: { children: ReactNode }) {
  const { status, user, logout } = useAdminAuth();
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => { if (status === "unauthenticated") router.replace(`/admin/login?next=${encodeURIComponent(path)}`); }, [status, path, router]);

  if (status === "forbidden") return <Screen><div className="adm-card max-w-md p-8"><ShieldAlert className="mx-auto mb-3 text-red-300" size={36} aria-hidden="true" /><h1 className="text-xl font-extrabold">Access denied</h1><p className="mt-2 text-sm text-white/60">Your account does not have administrator privileges.</p><div className="mt-5 flex justify-center gap-2"><Link href="/" className="adm-btn">Back to website</Link><button className="adm-btn-primary" onClick={() => logout()}>Sign out</button></div></div></Screen>;
  if (status !== "authenticated" || !user) return <Screen><div role="status" className="flex items-center gap-3 text-white/70"><Loader2 className="animate-spin" size={20} aria-hidden="true" />Checking your session…</div></Screen>;

  return (
    <div className="min-h-screen bg-[#120824] text-white lg:flex">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onMenu={() => setOpen(true)} />
        {USE_MOCK && <div role="note" className="flex items-center gap-2 border-b border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs text-amber-200 sm:px-6 lg:px-8"><Info size={14} aria-hidden="true" /><span><b>Sample data.</b> Running in development mock mode (<code>NEXT_PUBLIC_USE_MOCK=true</code>). Nothing here is real or saved to a server.</span></div>}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
