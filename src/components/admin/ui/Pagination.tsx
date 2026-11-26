import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pageSize, total, onPage, onPageSize }: { page: number; pageSize: number; total: number; onPage: (p: number) => void; onPageSize?: (n: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1, to = Math.min(total, page * pageSize);
  const win = Array.from({ length: pages }, (_, i) => i + 1).filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1);
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-xs text-white/60 max-sm:justify-center">
      <div className="flex items-center gap-3">
        <span>Showing <b className="text-white">{from}–{to}</b> of <b className="text-white">{total}</b></span>
        {onPageSize && <select aria-label="Rows per page" value={pageSize} onChange={(e) => onPageSize(Number(e.target.value))} className="adm-input !w-auto !py-1 !text-xs max-md:!text-base">{[10, 25, 50].map((n) => <option key={n} value={n}>{n} / page</option>)}</select>}
      </div>
      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button className="adm-icon-btn" aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)}><ChevronLeft size={16} /></button>
        {win.map((p, i) => <span key={p} className="flex items-center max-sm:hidden">{i > 0 && p - win[i - 1]! > 1 && <span className="px-1">…</span>}<button aria-current={p === page ? "page" : undefined} onClick={() => onPage(p)} className={`h-8 min-w-8 rounded-lg px-2 font-semibold transition ${p === page ? "bg-violet text-white" : "hover:bg-white/10"}`}>{p}</button></span>)}
        <span className="px-2 text-xs font-semibold text-white/70 sm:hidden" aria-live="polite">Page {page} of {pages}</span>
        <button className="adm-icon-btn" aria-label="Next page" disabled={page >= pages} onClick={() => onPage(page + 1)}><ChevronRight size={16} /></button>
      </nav>
    </div>
  );
}
