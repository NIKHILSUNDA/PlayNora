import { titleCase } from "@/lib/format";

type Tone = "green" | "amber" | "red" | "blue" | "violet" | "gray";
const TONE: Record<Tone, string> = {
  green: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25", amber: "bg-amber-400/10 text-amber-300 ring-amber-400/25",
  red: "bg-red-400/10 text-red-300 ring-red-400/25", blue: "bg-sky-400/10 text-sky-300 ring-sky-400/25",
  violet: "bg-violet/15 text-[#c9a3ff] ring-violet/30", gray: "bg-white/5 text-white/60 ring-white/15",
};
const MAP: Record<string, Tone> = {
  ACTIVE: "green", CONFIRMED: "green", PAID: "green", SUCCESS: "green", COMPLETED: "blue",
  PENDING: "amber", FAILED: "red", CANCELLED: "red", BLOCKED: "red", REJECTED: "red", INACTIVE: "gray", REFUNDED: "violet",
};
export default function StatusBadge({ status, label }: { status: string; label?: string }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${TONE[MAP[status] ?? "gray"]}`}><i className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{label ?? titleCase(status)}</span>;
}
