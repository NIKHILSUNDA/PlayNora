"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return <button type="button" className="adm-icon-btn !h-7 !w-7" aria-label={`${label} ${value}`} onClick={async (e) => { e.stopPropagation(); try { await navigator.clipboard.writeText(value); setDone(true); setTimeout(() => setDone(false), 1500); } catch { /* clipboard unavailable */ } }}>{done ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}</button>;
}
