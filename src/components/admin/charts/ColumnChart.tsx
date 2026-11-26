"use client";
import { useState } from "react";
import { compact } from "@/lib/format";
import type { SeriesPoint } from "@/types/admin";
import { niceMax, useWidth } from "./useWidth";

const PL = 36, PR = 8, PT = 12, PB = 28;

export default function ColumnChart({ data, color = "#8b3dff", height = 240, format = compact, ariaLabel }: { data: SeriesPoint[]; color?: string; height?: number; format?: (n: number) => string; ariaLabel: string }) {
  const [ref, W] = useWidth();
  const [hover, setHover] = useState<number | null>(null);
  const n = data.length, iw = W - PL - PR, ih = height - PT - PB, slot = iw / Math.max(1, n), bw = Math.min(28, slot * 0.62);
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const step = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 56))));
  return (
    <div ref={ref} className="relative w-full min-w-0 overflow-hidden">
      <svg width={W} height={height} role="img" aria-label={ariaLabel} onPointerLeave={() => setHover(null)}>
        {[0, 1, 2, 3, 4].map((t) => { const yy = PT + ih - (ih * t) / 4; return <g key={t}><line x1={PL} x2={W - PR} y1={yy} y2={yy} stroke="rgba(255,255,255,.08)" /><text x={PL - 6} y={yy + 4} textAnchor="end" fontSize="11" fill="rgba(255,255,255,.45)">{format((max * t) / 4)}</text></g>; })}
        {data.map((d, i) => { const h = (d.value / max) * ih, cx = PL + slot * i + slot / 2; return <g key={i} onPointerEnter={() => setHover(i)}><rect x={PL + slot * i} y={PT} width={slot} height={ih + PB} fill="transparent" /><rect x={cx - bw / 2} y={PT + ih - h} width={bw} height={Math.max(h, d.value > 0 ? 2 : 0)} rx="4" fill={color} opacity={hover === null || hover === i ? 1 : 0.45} />{i % step === 0 && <text x={cx} y={height - 8} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,.45)">{d.label}</text>}</g>; })}
      </svg>
      {hover !== null && data[hover] && <div className="pointer-events-none absolute top-0 z-10 whitespace-nowrap rounded-lg border border-white/15 bg-[#26113f] px-3 py-2 text-xs shadow-xl" style={{ left: Math.min(Math.max(PL + slot * hover + slot / 2, 50), W - 50), transform: "translateX(-50%)" }}><p className="font-bold">{data[hover]!.label}</p><p><b>{format(data[hover]!.value)}</b></p></div>}
    </div>
  );
}
