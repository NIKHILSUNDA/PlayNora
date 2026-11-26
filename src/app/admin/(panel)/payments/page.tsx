"use client";
import { useState } from "react";
import { CheckCircle2, Clock, Eye, Undo2, XCircle, type LucideIcon } from "lucide-react";
import TransactionDrawer from "@/components/admin/payments/TransactionDrawer";
import CopyButton from "@/components/admin/ui/CopyButton";
import DataTable, { RowActions, type Column } from "@/components/admin/ui/DataTable";
import { DateRange, FilterBar, FilterSelect, Tabs } from "@/components/admin/ui/FilterBar";
import PageHeader from "@/components/admin/ui/PageHeader";
import SearchInput from "@/components/admin/ui/SearchInput";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import { Skeleton } from "@/components/admin/ui/States";
import { useAsync, useList } from "@/hooks/useAdminData";
import { fmtDateTime, inr, num } from "@/lib/format";
import { transactionsApi } from "@/services/admin";
import type { Transaction, TransactionSummary } from "@/types/admin";

const TABS = [{ value: "all", label: "All" }, { value: "SUCCESS", label: "Successful" }, { value: "PENDING", label: "Pending" }, { value: "FAILED", label: "Failed" }, { value: "REFUNDED", label: "Refunds" }];
const CARDS: { key: keyof TransactionSummary; label: string; icon: LucideIcon; tone: string }[] = [
  { key: "success", label: "Successful", icon: CheckCircle2, tone: "bg-emerald-400/15 text-emerald-300" }, { key: "pending", label: "Pending", icon: Clock, tone: "bg-amber-400/15 text-amber-300" },
  { key: "failed", label: "Failed", icon: XCircle, tone: "bg-red-400/15 text-red-300" }, { key: "refunded", label: "Refunded", icon: Undo2, tone: "bg-violet/20 text-[#c9a3ff]" },
];

export default function PaymentsPage() {
  const list = useList(transactionsApi.list, { sort: "createdAt", dir: "desc" });
  const sum = useAsync(() => transactionsApi.summary());
  const [view, setView] = useState<Transaction | null>(null);

  const cols: Column<Transaction>[] = [
    { key: "txn", header: "Transaction", render: (t) => <div className="whitespace-nowrap"><p className="font-semibold">{t.id}</p><p className="text-xs text-white/50">{fmtDateTime(t.createdAt)}</p></div> },
    { key: "rzp", header: "Razorpay payment ID", hide: "lg", render: (t) => t.razorpayPaymentId ? <span className="inline-flex items-center gap-1 font-mono text-xs">{t.razorpayPaymentId}<CopyButton value={t.razorpayPaymentId} /></span> : <span className="text-xs text-white/40">Not issued</span> },
    { key: "customer", header: "Customer", hide: "md", render: (t) => <div className="md:min-w-[130px]"><p>{t.userName}</p><p className="text-xs text-white/50">{t.bookingRef}</p></div> },
    { key: "method", header: "Method", hide: "lg", render: (t) => t.method },
    { key: "amount", header: "Amount", sortKey: "amount", render: (t) => <span className="font-semibold">{inr(t.amount)}</span> },
    { key: "status", header: "Status", render: (t) => <StatusBadge status={t.status} /> },
    { key: "actions", header: "", align: "right", render: (t) => <RowActions><button className="adm-icon-btn" aria-label={`View ${t.id}`} title="View details" onClick={() => setView(t)}><Eye size={16} /></button></RowActions> },
  ];

  return (
    <>
      <PageHeader title="Payment" accent="management" description="Razorpay transactions, outcomes and refunds. Refunds are issued by the backend, never from the browser." />
      <section aria-label="Payment summary" className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map(({ key, label, icon: Icon, tone }) => (
          <div key={key} className="adm-card adm-fade flex items-center gap-4 p-5 max-sm:p-4">
            <span className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}><Icon size={20} aria-hidden="true" /></span>
            <div><p className="text-xs font-semibold uppercase tracking-wider text-white/55">{label}</p>{sum.loading ? <Skeleton className="mt-1.5 h-6 w-24" /> : <><p className="text-xl font-extrabold">{sum.data ? inr(sum.data[key].amount) : "—"}</p><p className="text-xs text-white/50">{sum.data ? `${num(sum.data[key].count)} transactions` : sum.error ?? ""}</p></>}</div>
          </div>
        ))}
      </section>
      <Tabs value={String(list.query.status ?? "all")} options={TABS} onChange={(v) => list.patch({ status: v })} />
      <FilterBar>
        <SearchInput value={list.query.search ?? ""} onChange={(v) => list.patch({ search: v })} placeholder="Search ID, Razorpay ref, booking, user" />
        <FilterSelect label="Payment method" value={String(list.query.method ?? "all")} onChange={(v) => list.patch({ method: v })} options={[{ value: "all", label: "All methods" }, ...["UPI", "Card", "Net Banking", "Wallet"].map((m) => ({ value: m, label: m }))]} />
        <DateRange from={String(list.query.from ?? "")} to={String(list.query.to ?? "")} onChange={(r) => list.patch({ from: r.from, to: r.to })} />
      </FilterBar>
      <DataTable columns={cols} rows={list.items} rowKey={(t) => t.id} loading={list.loading} error={list.error} onRetry={list.reload} page={list.query.page} pageSize={list.query.pageSize} total={list.total} onPage={list.setPage} onPageSize={(n) => list.patch({ pageSize: n })} sort={list.query.sort} dir={list.query.dir} onSort={list.toggleSort} onRowClick={setView} empty={{ title: "No transactions found", hint: "Try a different status, method or date range." }} />
      <TransactionDrawer txn={view} onClose={() => setView(null)} />
    </>
  );
}
