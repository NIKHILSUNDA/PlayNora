"use client";
import { useEffect, useRef, useState } from "react";

/** Measures a container so SVG charts render at true pixel size (text stays legible on phones). */
export function useWidth(initial = 320) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => { if (e) setW(Math.max(240, Math.floor(e.contentRect.width))); });
    ro.observe(el);
    setW(Math.max(240, Math.floor(el.clientWidth)));
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export const niceMax = (m: number) => {
  if (m <= 0) return 4;
  const p = 10 ** Math.floor(Math.log10(m)), n = m / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 4 ? 4 : n <= 5 ? 5 : 10) * p;
};
export const PALETTE = ["#fbbf12", "#8b3dff", "#ec4899", "#22d3ee", "#34d399", "#f97316"];
