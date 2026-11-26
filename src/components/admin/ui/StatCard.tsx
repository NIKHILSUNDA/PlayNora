import type { LucideIcon } from "lucide-react";
import { Skeleton } from "./States";

const ACCENT = { brand: "bg-brand/15 text-brand", violet: "bg-violet/20 text-[#c9a3ff]", green: "bg-emerald-400/15 text-emerald-300", amber: "bg-amber-400/15 text-amber-300", red: "bg-red-400/15 text-red-300", blue: "bg-sky-400/15 text-sky-300" } as const;

export default function StatCard({ label, value, hint, icon: Icon, accent = "violet", loading }: { label: string; value: string; hint?: string; icon: LucideIcon; accent?: keyof typeof ACCENT; loading?: boolean }) {
  return (
    <div className="adm-card adm-fade min-w-0 p-4 transition sm:p-5 hover:border-white/25">
      <div className="flex items-start justify-between gap-3 max-sm:flex-col-reverse max-sm:gap-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/55 sm:text-[12px]">{label}</p>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${ACCENT[accent]}`}><Icon size={18} aria-hidden="true" /></span>
      </div>
      {loading ? <><Skeleton className="mt-3 h-8 w-28" /><Skeleton className="mt-2 h-3 w-20" /></> : <><p className="mt-2 text-2xl font-extrabold max-[400px]:text-[19px] sm:text-[28px] leading-none tracking-tight [overflow-wrap:anywhere]">{value}</p>{hint && <p className="mt-2 text-xs text-white/50">{hint}</p>}</>}
    </div>
  );
}
