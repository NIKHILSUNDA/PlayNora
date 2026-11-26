import type { ReactNode } from "react";

export const FilterBar = ({ children }: { children: ReactNode }) => <div className="mb-4 flex flex-wrap items-center gap-3 max-sm:gap-2.5">{children}</div>;

export function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className="adm-input min-w-[140px] max-sm:min-w-0 max-sm:flex-1 sm:!w-auto">{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>;
}

export function DateRange({ from, to, onChange }: { from: string; to: string; onChange: (r: { from: string; to: string }) => void }) {
  return (
    <div className="flex items-center gap-2 max-sm:w-full">
      <input type="date" aria-label="From date" value={from} max={to || undefined} onChange={(e) => onChange({ from: e.target.value, to })} className="adm-input max-sm:min-w-0 max-sm:flex-1 sm:!w-auto" />
      <span className="text-xs text-white/40">to</span>
      <input type="date" aria-label="To date" value={to} min={from || undefined} onChange={(e) => onChange({ from, to: e.target.value })} className="adm-input max-sm:min-w-0 max-sm:flex-1 sm:!w-auto" />
    </div>
  );
}

/** Pill tabs used as a quick status filter. */
export function Tabs({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div role="tablist" className="mb-4 flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {options.map((o) => <button key={o.value} role="tab" aria-selected={value === o.value} onClick={() => onChange(o.value)} className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition ${value === o.value ? "bg-violet text-white shadow" : "text-white/60 hover:text-white"}`}>{o.label}</button>)}
    </div>
  );
}
