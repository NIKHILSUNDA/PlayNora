"use client";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

/** Debounced search box. Emits onChange 300ms after the user stops typing. */
export default function SearchInput({ value, onChange, placeholder = "Search…" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [v, setV] = useState(value);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const t = setTimeout(() => onChange(v), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v]);
  return (
    <div className="relative min-w-[200px] flex-1 max-sm:basis-full sm:max-w-xs">
      <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
      <input type="search" value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="adm-input !pl-9" />
    </div>
  );
}
