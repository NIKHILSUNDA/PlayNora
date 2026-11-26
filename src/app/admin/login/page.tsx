import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";

/** Only same-site /admin/* paths are accepted as a post-login target (prevents open redirects). */
const safeNext = (n?: string) => (n && /^\/admin\/[a-zA-Z0-9/_-]*$/.test(n) && n !== "/admin/login" ? n : "/admin/dashboard");

export default function AdminLogin({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <div className="grid min-h-screen bg-[#120824] text-white lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <Image src="/images/hero.jpg" alt="" fill priority sizes="55vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#120824]/90 via-[#1c0d33]/80 to-[#a63a9c]/50" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Image src="/images/logo.png" alt="PlayNora" width={170} height={46} className="h-8 w-auto" />
          <div>
            <h2 className="text-5xl font-black italic leading-none tracking-tight">Run the game.</h2>
            <p className="mt-2 font-serif text-5xl font-bold italic leading-none text-brand">Run the platform.</p>
            <p className="mt-6 max-w-md leading-relaxed text-white/75">Venues, bookings, players and payments - one control room for everything PlayNora.</p>
          </div>
          <p className="text-xs text-white/50">© 2026 PlayNora · Restricted area</p>
        </div>
      </section>
      <section className="flex flex-col justify-center px-6 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Image src="/images/logo.png" alt="PlayNora" width={150} height={42} className="mb-8 h-7 w-auto lg:hidden" />
          <p className="text-[11px] font-semibold tracking-[.3em] text-brand">— ADMIN ACCESS</p>
          <h1 className="mb-2 mt-2 text-4xl font-extrabold leading-none tracking-tight">Sign <span className="font-serif italic text-brand">in</span></h1>
          <p className="mb-8 text-sm text-white/60">Restricted to authorised PlayNora administrators.</p>
          <LoginForm next={safeNext(searchParams.next)} />
          <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"><ArrowLeft size={14} aria-hidden="true" />Back to website</Link>
        </div>
      </section>
    </div>
  );
}
