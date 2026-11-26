import type { ReactNode } from "react";
import { ErrorState } from "../ui/States";

export default function ChartCard({ title, subtitle, className = "", loading, error, onRetry, height = 240, actions, children }: { title: string; subtitle?: string; className?: string; loading?: boolean; error?: string | null; onRetry?: () => void; height?: number; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className={`adm-card adm-fade min-w-0 p-5 ${className}`}>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div><h2 className="font-extrabold">{title}</h2>{subtitle && <p className="text-xs text-white/50">{subtitle}</p>}</div>
        {actions}
      </header>
      {error ? <ErrorState message={error} onRetry={onRetry} /> : loading ? <div className="animate-pulse rounded-lg bg-white/10" style={{ height }} aria-hidden="true" /> : children}
    </section>
  );
}
