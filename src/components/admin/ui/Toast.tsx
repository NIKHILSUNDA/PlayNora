"use client";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface T { id: number; kind: "success" | "error"; msg: string }
const Ctx = createContext<{ success: (m: string) => void; error: (m: string) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<T[]>([]);
  const push = useCallback((kind: T["kind"], msg: string) => {
    const id = Date.now() + Math.random();
    setItems((p) => [...p, { id, kind, msg }]);
    setTimeout(() => setItems((p) => p.filter((t) => t.id !== id)), 4500);
  }, []);
  const api = useMemo(() => ({ success: (m: string) => push("success", m), error: (m: string) => push("error", m) }), [push]);
  return (
    <Ctx.Provider value={api}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(92vw,380px)] flex-col gap-2 max-sm:inset-x-3 max-sm:bottom-3 max-sm:w-auto">
        {items.map((t) => (
          <div key={t.id} role="status" className="adm-fade pointer-events-auto flex items-start gap-3 rounded-xl border border-white/15 bg-[#26113f] px-4 py-3 text-sm shadow-xl">
            {t.kind === "success" ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-300" /> : <XCircle size={18} className="mt-0.5 shrink-0 text-red-300" />}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast must be used inside ToastProvider");
  return c;
}
