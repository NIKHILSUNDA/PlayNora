import type { SeriesPoint } from "@/types/admin";
import { PALETTE } from "./useWidth";

export default function DonutChart({ items, centerLabel = "Total", ariaLabel }: { items: SeriesPoint[]; centerLabel?: string; ariaLabel: string }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  let acc = 0;
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90" role="img" aria-label={ariaLabel}>
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="4" />
          {total > 0 && items.map((it, i) => { const pct = (it.value / total) * 100; const el = <circle key={it.label} cx="18" cy="18" r="15.9155" fill="none" stroke={PALETTE[i % PALETTE.length]} strokeWidth="4" strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={-acc} />; acc += pct; return el; })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center"><div><p className="text-2xl font-extrabold leading-none">{total}</p><p className="mt-1 text-[11px] text-white/50">{centerLabel}</p></div></div>
      </div>
      <ul className="w-full space-y-2.5 text-sm">
        {items.map((it, i) => <li key={it.label} className="flex items-center justify-between gap-3"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />{it.label}</span><span className="whitespace-nowrap text-white/60"><b className="text-white">{it.value}</b> · {total ? Math.round((it.value / total) * 100) : 0}%</span></li>)}
        {items.length === 0 && <li className="text-white/50">No data for this period.</li>}
      </ul>
    </div>
  );
}
