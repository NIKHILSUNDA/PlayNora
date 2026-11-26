"use client";
import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";

interface Props { open: boolean; title: string; onClose: () => void; children: ReactNode; footer?: ReactNode; variant?: "center" | "drawer"; size?: "sm" | "md" | "lg" }
const SIZE = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl" } as const;

/** Accessible dialog: Esc + backdrop close, scroll lock, role=dialog. `drawer` slides in from the right. */
export default function Modal({ open, title, onClose, children, footer, variant = "center", size = "md" }: Props) {
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);
  if (!open) return null;
  const drawer = variant === "drawer";
  return (
    <div className={`fixed inset-0 z-50 flex ${drawer ? "justify-end" : "items-center justify-center p-4 max-sm:items-end max-sm:p-0"}`}>
      <div className="adm-fade absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <section role="dialog" aria-modal="true" aria-labelledby={id} className={`relative flex flex-col border border-white/10 bg-[#1a0c30] shadow-2xl ${drawer ? "adm-slide h-full w-full max-w-lg" : `adm-fade adm-sheet max-h-[90vh] w-full rounded-2xl max-sm:max-h-[92dvh] max-sm:max-w-none max-sm:rounded-b-none ${SIZE[size]}`}`}>
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <h2 id={id} className="text-lg font-extrabold">{title}</h2>
          <button className="adm-icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && <footer className="flex flex-wrap justify-end gap-2 border-t border-white/10 px-5 py-4 max-sm:[&>*]:flex-1">{footer}</footer>}
      </section>
    </div>
  );
}
