"use client";
import Link from "next/link";
import { CalendarCheck, CalendarDays, CheckCircle2, Clock, IndianRupee, MapPin, RefreshCw, Users, XCircle } from "lucide-react";
import AreaChart from "@/components/admin/charts/AreaChart";
import ChartCard from "@/components/admin/charts/ChartCard";
import ColumnChart from "@/components/admin/charts/ColumnChart";
import DonutChart from "@/components/admin/charts/DonutChart";
import PageHeader from "@/components/admin/ui/PageHeader";
import StatCard from "@/components/admin/ui/StatCard";
import StatusBadge from "@/components/admin/ui/StatusBadge";
import { EmptyState, ErrorState, Skeleton } from "@/components/admin/ui/States";
import { useAsync } from "@/hooks/useAdminData";
import { fmtDate, inr, num } from "@/lib/format";
import { bookingsApi, statsApi, venuesApi } from "@/services/admin";

export default function DashboardPage() {
  const stats = useAsync(() => statsApi.get());
  const recent = useAsync(() => bookingsApi.list({ page: 1, pageSize: 6, sort: "createdAt", dir: "desc" }));
  const pending = useAsync(() => venuesApi.list({ page: 1, pageSize: 5, status: "PENDING", sort: "createdAt", dir: "desc" }));
  const t = stats.data?.totals, s = stats.data;
  const L = stats.loading;
  const refresh = () => { stats.reload(); recent.reload(); pending.reload(); };

  return (
    <>
      <PageHeader title="Dashboard" accent="overview" description="A live snapshot of everything happening on PlayNora." actions={<button className="adm-btn" onClick={refresh}><RefreshCw size={14} className={L ? "animate-spin" : ""} aria-hidden="true" />Refresh</button>} />
      {stats.error ? <div className="adm-card"><ErrorState message={stats.error} onRetry={stats.reload} /></div> : (
        <>
          <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <StatCard loading={L} label="Registered users" value={num(t?.users ?? 0)} icon={Users} accent="violet" hint="All customer accounts" />
            <StatCard loading={L} label="Total venues" value={num(t?.venues ?? 0)} icon={MapPin} accent="brand" hint="Approved listings" />
            <StatCard loading={L} label="Total bookings" value={num(t?.bookings ?? 0)} icon={CalendarCheck} accent="blue" hint="All time" />
            <StatCard loading={L} label="Today's bookings" value={num(t?.todayBookings ?? 0)} icon={CalendarDays} accent="green" hint="Scheduled for today" />
            <StatCard loading={L} label="Total revenue" value={inr(t?.revenue ?? 0)} icon={IndianRupee} accent="brand" hint="Gross, paid bookings" />
            <StatCard loading={L} label="Pending bookings" value={num(t?.pending ?? 0)} icon={Clock} accent="amber" hint="Awaiting payment / confirmation" />
            <StatCard loading={L} label="Completed" value={num(t?.completed ?? 0)} icon={CheckCircle2} accent="green" hint="Played & closed" />
            <StatCard loading={L} label="Cancelled" value={num(t?.cancelled ?? 0)} icon={XCircle} accent="red" hint="By users or admins" />
          </section>
          <section className="mt-4 grid gap-4 lg:grid-cols-3">
            <ChartCard className="lg:col-span-2" title="Revenue analytics" subtitle="Last 6 months · gross paid bookings" loading={L}>
              <AreaChart ariaLabel="Monthly revenue" labels={s?.revenueSeries.map((p) => p.label) ?? []} series={[{ name: "Revenue", color: "#fbbf12", values: s?.revenueSeries.map((p) => p.value) ?? [] }]} format={(n) => (n >= 1000 ? `₹${Math.round(n / 1000)}k` : `₹${n}`)} />
            </ChartCard>
            <ChartCard title="Popular sports" subtitle="Share of active bookings" loading={L}><DonutChart ariaLabel="Bookings by sport" centerLabel="bookings" items={s?.popularSports ?? []} /></ChartCard>
            <ChartCard className="lg:col-span-2" title="Booking trends" subtitle="Bookings per day · last 14 days" loading={L}><ColumnChart ariaLabel="Bookings per day" data={s?.bookingTrend ?? []} /></ChartCard>
            <ChartCard title="Monthly platform growth" subtitle="New users & venues" loading={L}>
              <AreaChart ariaLabel="Monthly platform growth" labels={s?.growth.map((g) => g.label) ?? []} series={[{ name: "New users", color: "#8b3dff", values: s?.growth.map((g) => g.users) ?? [] }, { name: "New venues", color: "#34d399", values: s?.growth.map((g) => g.venues) ?? [] }]} />
            </ChartCard>
          </section>
        </>
      )}

      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="adm-card adm-fade overflow-hidden lg:col-span-2">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4"><h2 className="font-extrabold">Recent bookings</h2><Link href="/admin/bookings" className="text-xs font-semibold text-brand hover:underline">View all →</Link></header>
          {recent.error ? <ErrorState message={recent.error} onRetry={recent.reload} /> : recent.loading ? <div className="space-y-3 p-5">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10" />)}</div> : !recent.data?.items.length ? <EmptyState title="No bookings yet" /> : (
            <ul className="divide-y divide-white/5">{recent.data.items.map((b) => <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm"><div className="min-w-0"><p className="truncate font-semibold">{b.venueName}</p><p className="truncate text-xs text-white/50">{b.userName} · {fmtDate(b.date)} · {b.slot}</p></div><div className="flex shrink-0 items-center gap-3"><span className="hidden font-semibold sm:inline">{inr(b.amount)}</span><StatusBadge status={b.status} /></div></li>)}</ul>
          )}
        </div>
        <div className="adm-card adm-fade overflow-hidden">
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4"><h2 className="font-extrabold">Venue approvals</h2><Link href="/admin/venues" className="text-xs font-semibold text-brand hover:underline">Review →</Link></header>
          {pending.error ? <ErrorState message={pending.error} onRetry={pending.reload} /> : pending.loading ? <div className="space-y-3 p-5">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-10" />)}</div> : !pending.data?.items.length ? <EmptyState title="All caught up" hint="No venue submissions are waiting for review." /> : (
            <ul className="divide-y divide-white/5">{pending.data.items.map((v) => <li key={v.id} className="px-5 py-3 text-sm"><p className="font-semibold">{v.name}</p><p className="text-xs text-white/50">{v.location} · {v.sports.join(", ")}</p></li>)}</ul>
          )}
        </div>
      </section>
    </>
  );
}
