"use client";
import { useId, useState } from "react";
import { compact } from "@/lib/format";
import { niceMax, useWidth } from "./useWidth";

export interface LineSeries { name: string; color: string; values: number[] }
const PL = 44, PR = 12, PT = 12, PB = 28;
const curve = (pts: [number, number][]) => pts.reduce((d, p, i, a) => (i === 0 ? `M${p[0]},${p[1]}` : `${d} C${(a[i - 1]![0] + p[0]) / 2},${a[i - 1]![1]} ${(a[i - 1]![0] + p[0]) / 2},${p[1]} ${p[0]},${p[1]}`), "");

export default function AreaChart({ labels, series, height = 240, format = compact, ariaLabel }: { labels: string[]; series: LineSeries[]; height?: number; format?: (n: number) => string; ariaLabel: string }) {
  const uid = useId().replace(/:/g, "");
  const [ref, W] = useWidth();
  const [hover, setHover] = useState<number | null>(null);
  const n = labels.length, iw = W - PL - PR, ih = height - PT - PB;
  const max = niceMax(Math.max(0, ...series.flatMap((s) => s.values)));
  const x = (i: number) => PL + (n > 1 ? (i * iw) / (n - 1) : iw / 2);
  const y = (v: number) => PT + ih - (v / max) * ih;
  const step = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 64))));
  const base = PT + ih;
  return (
    <div>
      {series.length > 1 && <ul className="mb-2 flex gap-4 text-xs text-white/70">{series.map((s) => <li key={s.name} className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.name}</li>)}</ul>}
      <div ref={ref} className="relative w-full min-w-0 overflow-hidden">
        <svg width={W} height={height} style={{ touchAction: "pan-y" }} role="img" aria-label={ariaLabel} onPointerLeave={() => setHover(null)} onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setHover(Math.min(n - 1, Math.max(0, Math.round((e.clientX - r.left - PL) / (iw / Math.max(1, n - 1)))))); }}>
          <defs>{series.map((s, i) => <linearGradient key={i} id={`${uid}${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={s.color} stopOpacity=".32" /><stop offset="100%" stopColor={s.color} stopOpacity="0" /></linearGradient>)}</defs>
          {[0, 1, 2, 3, 4].map((t) => <g key={t}><line x1={PL} x2={W - PR} y1={y((max * t) / 4)} y2={y((max * t) / 4)} stroke="rgba(255,255,255,.08)" /><text x={PL - 8} y={y((max * t) / 4) + 4} textAnchor="end" fontSize="11" fill="rgba(255,255,255,.45)">{format((max * t) / 4)}</text></g>)}
          {labels.map((l, i) => i % step === 0 && <text key={i} x={x(i)} y={height - 8} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,.45)">{l}</text>)}
          {series.map((s, si) => { const pts = s.values.map((v, i) => [x(i), y(v)] as [number, number]); const d = curve(pts); return <g key={si}>{n > 1 && <path d={`${d} L${x(n - 1)},${base} L${x(0)},${base} Z`} fill={`url(#${uid}${si})`} />}<path d={d} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />{n === 1 && <circle cx={pts[0]![0]} cy={pts[0]![1]} r="4" fill={s.color} />}</g>; })}
          {hover !== null && <g><line x1={x(hover)} x2={x(hover)} y1={PT} y2={base} stroke="rgba(255,255,255,.25)" strokeDasharray="3 3" />{series.map((s, si) => <circle key={si} cx={x(hover)} cy={y(s.values[hover] ?? 0)} r="4.5" fill={s.color} stroke="#1a0c30" strokeWidth="2" />)}</g>}
        </svg>
        {hover !== null && <div className="pointer-events-none absolute top-0 z-10 rounded-lg border border-white/15 bg-[#26113f] px-3 py-2 text-xs shadow-xl" style={{ left: Math.min(Math.max(x(hover), 70), W - 70), transform: "translateX(-50%)" }}><p className="mb-1 font-bold">{labels[hover]}</p>{series.map((s) => <p key={s.name} className="flex items-center gap-1.5 whitespace-nowrap"><i className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.name}: <b>{format(s.values[hover] ?? 0)}</b></p>)}</div>}
      </div>
    </div>
  );
}
