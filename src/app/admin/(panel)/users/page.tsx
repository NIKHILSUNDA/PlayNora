"use client";
import { useState } from "react";
import { Eye, ShieldCheck, ShieldOff } from "lucide-react";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import DataTable, { RowActions, type Column } from "@/components/admin/ui/DataTable";
import { FilterBar, FilterSelect } from "@/components/admin/ui/FilterBar";
import PageHeader from "@/components/admin/ui/PageHeader";
import SearchInput from "@/components/admin/ui/SearchInput";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import { useToast } from "@/components/admin/ui/Toast";
import UserDrawer from "@/components/admin/users/UserDrawer";
import { useList } from "@/hooks/useAdminData";
import { fmtDate, initials, inr } from "@/lib/format";
import { usersApi } from "@/services/admin";
import type { UserAccount } from "@/types/admin";

export default function UsersPage() {
  const toast = useToast();
  const list = useList(usersApi.list, { sort: "joinedAt", dir: "desc" });
  const [view, setView] = useState<UserAccount | null>(null);
  const [target, setTarget] = useState<UserAccount | null>(null);

  const apply = async (u: UserAccount) => {
    const next = u.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    const r = await usersApi.setStatus(u.id, next);
    if (r.error || !r.data) return toast.error(r.error ?? "Update failed");
    toast.success(`${u.name} ${next === "BLOCKED" ? "blocked" : "unblocked"}`);
    setTarget(null); setView((v) => (v ? r.data : null)); list.reload();
  };
  const cols: Column<UserAccount>[] = [
    { key: "user", header: "User", sortKey: "name", render: (u) => <div className="flex items-center gap-3 md:min-w-[200px]"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet to-pink-500 text-xs font-extrabold">{initials(u.name)}</span><div className="min-w-0"><p className="truncate font-semibold">{u.name}</p><p className="truncate text-xs text-white/50">{u.email}</p></div></div> },
    { key: "phone", header: "Phone", hide: "lg", render: (u) => <span className="whitespace-nowrap text-white/70">{u.phone}</span> },
    { key: "joined", header: "Joined", sortKey: "joinedAt", hide: "md", render: (u) => <span className="whitespace-nowrap">{fmtDate(u.joinedAt)}</span> },
    { key: "bookings", header: "Bookings", sortKey: "bookingsCount", hide: "md", render: (u) => u.bookingsCount },
    { key: "spent", header: "Spent", sortKey: "totalSpent", hide: "lg", render: (u) => <span className="font-semibold">{inr(u.totalSpent)}</span> },
    { key: "status", header: "Status", render: (u) => <StatusBadge status={u.status} /> },
    { key: "actions", header: "", align: "right", render: (u) => <RowActions><button className="adm-icon-btn" aria-label={`View ${u.name}`} title="View profile" onClick={() => setView(u)}><Eye size={16} /></button><button className={`adm-icon-btn ${u.status === "BLOCKED" ? "!text-emerald-300" : "hover:!text-red-300"}`} aria-label={`${u.status === "BLOCKED" ? "Unblock" : "Block"} ${u.name}`} title={u.status === "BLOCKED" ? "Unblock" : "Block"} onClick={() => setTarget(u)}>{u.status === "BLOCKED" ? <ShieldCheck size={16} /> : <ShieldOff size={16} />}</button></RowActions> },
  ];
  const blocking = target?.status !== "BLOCKED";

  return (
    <>
      <PageHeader title="User" accent="management" description="Browse registered players, review their history, and control account access." />
      <FilterBar>
        <SearchInput value={list.query.search ?? ""} onChange={(v) => list.patch({ search: v })} placeholder="Search name, email or phone" />
        <FilterSelect label="Account status" value={String(list.query.status ?? "all")} onChange={(v) => list.patch({ status: v })} options={[{ value: "all", label: "All accounts" }, { value: "ACTIVE", label: "Active" }, { value: "BLOCKED", label: "Blocked" }]} />
      </FilterBar>
      <DataTable columns={cols} rows={list.items} rowKey={(u) => u.id} loading={list.loading} error={list.error} onRetry={list.reload} page={list.query.page} pageSize={list.query.pageSize} total={list.total} onPage={list.setPage} onPageSize={(n) => list.patch({ pageSize: n })} sort={list.query.sort} dir={list.query.dir} onSort={list.toggleSort} onRowClick={setView} empty={{ title: "No users found", hint: "Try a different search or filter." }} />
      <UserDrawer user={view} onClose={() => setView(null)} onToggle={setTarget} />
      <ConfirmDialog open={!!target} title={blocking ? "Block this account?" : "Unblock this account?"} message={blocking ? `${target?.name} will be signed out and unable to log in or make bookings. Existing bookings are not cancelled.` : `${target?.name} will be able to sign in and book again.`} confirmLabel={blocking ? "Block account" : "Unblock account"} danger={blocking} onConfirm={async () => { if (target) await apply(target); }} onClose={() => setTarget(null)} />
    </>
  );
}
