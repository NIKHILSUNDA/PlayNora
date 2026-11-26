"use client";
import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import Pagination from "./Pagination";
import { EmptyState, ErrorState, Skeleton } from "./States";

export interface Column<T> { key: string; header: string; render: (row: T) => ReactNode; sortKey?: string; hide?: "md" | "lg"; align?: "right"; className?: string }
interface Props<T> {
  columns: Column<T>[]; rows: T[]; rowKey: (r: T) => string; loading: boolean; error: string | null; onRetry: () => void;
  page: number; pageSize: number; total: number; onPage: (p: number) => void; onPageSize?: (n: number) => void;
  sort?: string; dir?: "asc" | "desc"; onSort?: (key: string) => void; onRowClick?: (r: T) => void;
  empty?: { title: string; hint?: string; action?: ReactNode };
}
const HIDE = { md: "hidden md:table-cell", lg: "hidden lg:table-cell" } as const;

export default function DataTable<T>(p: Props<T>) {
  const [primary, ...others] = p.columns;
  const actions = others.find((c) => c.header === "");
  const rest = others.filter((c) => c !== actions);
  const sortable = p.columns.filter((c) => c.sortKey);
  const cls = (c: Column<T>) => `${c.hide ? HIDE[c.hide] : ""} ${c.align === "right" ? "text-right" : "text-left"} ${c.className ?? ""}`;
  return (
    <div className="adm-card overflow-hidden">
      <div className="overflow-x-auto max-md:hidden">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] font-bold uppercase tracking-wider text-white/50">
              {p.columns.map((c) => {
                const active = c.sortKey && p.sort === c.sortKey;
                return (
                  <th key={c.key} scope="col" aria-sort={active ? (p.dir === "asc" ? "ascending" : "descending") : undefined} className={`whitespace-nowrap px-4 py-3 ${cls(c)}`}>
                    {c.sortKey && p.onSort ? <button onClick={() => p.onSort!(c.sortKey!)} className="inline-flex items-center gap-1 uppercase tracking-wider transition hover:text-white">{c.header}{active ? (p.dir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ChevronsUpDown size={12} className="opacity-40" />}</button> : c.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {p.loading && Array.from({ length: Math.min(p.pageSize, 6) }, (_, i) => <tr key={i} className="border-b border-white/5">{p.columns.map((c) => <td key={c.key} className={`px-4 py-4 ${cls(c)}`}><Skeleton className="h-4 w-full max-w-[140px]" /></td>)}</tr>)}
            {!p.loading && !p.error && p.rows.map((r) => (
              <tr key={p.rowKey(r)} onClick={p.onRowClick && (() => p.onRowClick!(r))} onKeyDown={p.onRowClick && ((e) => { if (e.key === "Enter") p.onRowClick!(r); })} tabIndex={p.onRowClick ? 0 : undefined} className={`border-b border-white/5 transition last:border-0 hover:bg-white/[0.04] focus-visible:bg-white/[0.06] focus-visible:outline-none ${p.onRowClick ? "cursor-pointer" : ""}`}>
                {p.columns.map((c) => <td key={c.key} className={`px-4 py-3 align-middle ${cls(c)}`}>{c.render(r)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Phones: each row becomes a card (first column = title, "" header = actions, the rest = label/value pairs) */}
      <div className="md:hidden">
        {p.onSort && sortable.length > 0 && (
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <select aria-label="Sort by" value={sortable.some((c) => c.sortKey === p.sort) ? p.sort : ""} onChange={(e) => { if (e.target.value && e.target.value !== p.sort) p.onSort!(e.target.value); }} className="adm-input !py-2">
              {!sortable.some((c) => c.sortKey === p.sort) && <option value="">Sort by…</option>}
              {sortable.map((c) => <option key={c.key} value={c.sortKey}>Sort: {c.header}</option>)}
            </select>
            <button type="button" className="adm-icon-btn shrink-0 border border-white/15" aria-label={p.dir === "asc" ? "Ascending. Switch to descending" : "Descending. Switch to ascending"} disabled={!p.sort} onClick={() => p.sort && p.onSort!(p.sort)}>{p.dir === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}</button>
          </div>
        )}
        {p.loading && <div className="space-y-3 p-4">{Array.from({ length: Math.min(p.pageSize, 4) }, (_, i) => <Skeleton key={i} className="h-28" />)}</div>}
        {!p.loading && !p.error && p.rows.length > 0 && (
          <ul>
            {p.rows.map((r) => (
              <li key={p.rowKey(r)} onClick={p.onRowClick && (() => p.onRowClick!(r))} onKeyDown={p.onRowClick && ((e) => { if (e.key === "Enter" && e.target === e.currentTarget) p.onRowClick!(r); })} tabIndex={p.onRowClick ? 0 : undefined} className={`border-b border-white/5 px-4 py-4 transition last:border-0 active:bg-white/[0.06] focus-visible:bg-white/[0.06] focus-visible:outline-none ${p.onRowClick ? "cursor-pointer" : ""}`}>
                {primary && <div className="min-w-0">{primary.render(r)}</div>}
                {rest.length > 0 && (
                  <dl className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                    {rest.map((c) => <div key={c.key} className="min-w-0"><dt className="text-[10px] font-bold uppercase tracking-wider text-white/40">{c.header}</dt><dd className="mt-1 min-w-0 break-words">{c.render(r)}</dd></div>)}
                  </dl>
                )}
                {actions && <div className="mt-3 flex justify-end border-t border-white/5 pt-2">{actions.render(r)}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
      {p.error && <ErrorState message={p.error} onRetry={p.onRetry} />}
      {!p.loading && !p.error && p.rows.length === 0 && <EmptyState title={p.empty?.title ?? "No results"} hint={p.empty?.hint ?? "Try changing your search or filters."} action={p.empty?.action} />}
      {!p.error && <Pagination page={p.page} pageSize={p.pageSize} total={p.total} onPage={p.onPage} onPageSize={p.onPageSize} />}
    </div>
  );
}

/** Stops row-click from firing when interacting with action buttons inside a row. */
export const RowActions = ({ children }: { children: ReactNode }) => <div className="flex items-center justify-end gap-0.5" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>{children}</div>;
