import type { ReactNode } from "react";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";

export const Skeleton = ({ className = "" }: { className?: string }) => <div className={`animate-pulse rounded-lg bg-white/10 ${className}`} aria-hidden="true" />;

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-white/5 text-white/50"><Inbox size={22} aria-hidden="true" /></span>
      <p className="font-bold">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-white/55">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-red-500/10 text-red-300"><AlertTriangle size={22} aria-hidden="true" /></span>
      <p className="font-bold">Something went wrong</p>
      <p className="mt-1 max-w-sm text-sm text-white/60">{message}</p>
      {onRetry && <button className="adm-btn mt-4" onClick={onRetry}><RefreshCw size={14} aria-hidden="true" />Try again</button>}
    </div>
  );
}
