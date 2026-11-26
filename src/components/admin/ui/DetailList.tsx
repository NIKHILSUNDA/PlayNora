import type { ReactNode } from "react";

export const DetailSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="mb-6 last:mb-0"><h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-white/45">{title}</h3><dl className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">{children}</dl></section>
);
export const DetailRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex items-start justify-between gap-4 px-4 py-2.5 text-sm"><dt className="shrink-0 text-white/55">{label}</dt><dd className="min-w-0 break-words text-right font-medium">{children}</dd></div>
);
