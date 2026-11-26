"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ApiResponse } from "@/types";
import type { ListQuery, Page } from "@/types/admin";

/** One-shot async loader with loading / error / reload. Ignores stale responses. */
export function useAsync<T>(fn: () => Promise<ApiResponse<T>>, deps: readonly unknown[] = []) {
  const [s, setS] = useState<{ data: T | null; loading: boolean; error: string | null }>({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);
  const ref = useRef(fn);
  ref.current = fn;
  useEffect(() => {
    let live = true;
    setS((p) => ({ ...p, loading: true, error: null }));
    ref.current().then((r) => { if (live) setS({ data: r.data, loading: false, error: r.error ?? (r.data === null ? "No data returned" : null) }); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...s, reload };
}

/** Server-driven paged list: search / filter / sort / pagination state + fetching. */
export function useList<T>(fetcher: (q: ListQuery) => Promise<ApiResponse<Page<T>>>, initial: Partial<ListQuery> = {}) {
  const [query, setQuery] = useState<ListQuery>({ page: 1, pageSize: 10, ...initial });
  const [s, setS] = useState<{ items: T[]; total: number; loading: boolean; error: string | null }>({ items: [], total: 0, loading: true, error: null });
  const [tick, setTick] = useState(0);
  const ref = useRef(fetcher);
  ref.current = fetcher;
  useEffect(() => {
    let live = true;
    setS((p) => ({ ...p, loading: true, error: null }));
    ref.current(query).then((r) => {
      if (!live) return;
      if (r.error || !r.data) setS((p) => ({ ...p, loading: false, error: r.error ?? "No data returned" }));
      else setS({ items: r.data.items, total: r.data.total, loading: false, error: null });
    });
    return () => { live = false; };
  }, [query, tick]);
  return {
    query, ...s,
    /** Change filters/search/page size. Resets to page 1. */
    patch: useCallback((p: Partial<ListQuery>) => setQuery((q) => ({ ...q, page: 1, ...p })), []),
    setPage: useCallback((page: number) => setQuery((q) => ({ ...q, page })), []),
    toggleSort: useCallback((key: string) => setQuery((q) => ({ ...q, sort: key, dir: q.sort === key && q.dir === "desc" ? "asc" : "desc", page: 1 })), []),
    reload: useCallback(() => setTick((t) => t + 1), []),
  };
}
