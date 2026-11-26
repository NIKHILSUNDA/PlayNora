import type { ReactNode } from "react";

export default function PageHeader({ title, accent, description, actions }: { title: string; accent?: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{title}{accent && <span className="ml-2 font-serif italic text-brand">{accent}</span>}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-white/60">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
