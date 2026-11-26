"use client";
import { useMemo, useState } from "react";
import { CalendarCheck, Download, IndianRupee, Percent, UserPlus, Wallet, type LucideIcon } from "lucide-react";
import AreaChart from "@/components/admin/charts/AreaChart";
import ChartCard from "@/components/admin/charts/ChartCard";
import ColumnChart from "@/components/admin/charts/ColumnChart";
import DonutChart from "@/components/admin/charts/DonutChart";
import { DateRange } from "@/components/admin/ui/FilterBar";
import PageHeader from "@/components/admin/ui/PageHeader";
import StatCard from "@/components/admin/ui/StatCard";
import { EmptyState, ErrorState, Skeleton } from "@/components/admin/ui/States";
import { useAsync } from "@/hooks/useAdminData";
import { addDays, downloadCsv, inr, num, toDateStr } from "@/lib/format";
import { reportsApi } from "@/services/admin";

const PRESETS = [{ label: "7 days", days: 7 }, { label: "30 days", days: 30 }, { label: "90 days", days: 90 }, { label: "12 months", days: 365 }];
const range = (days: number) => ({ from: toDateStr(addDays(new Date(), -(days - 1))), to: toDateStr(new Date()) });
const money = (n: number) => (n >= 1000 ? `₹${Math.round(n / 1000)}k` : `₹${n}`);

export default function AnalyticsPage() {
  const [r, setR] = useState(range(30));
  const [preset, setPreset] = useState<number | null>(30);
  const rep = useAsync(() => reportsApi.get(r), [r.from, r.to]);
  const d = rep.data, L = rep.loading;
  const labels = useMemo(() => d?.timeline.map((t) => t.label) ?? [], [d]);
  const valid = !!r.from && !!r.to && r.from <= r.to;

  const kpis: { label: string; value: string; icon: LucideIcon; accent: "brand" | "blue" | "violet" | "green" | "red" }[] = [
    { label: "Revenue", value: inr(d?.totals.revenue ?? 0), icon: IndianRupee, accent: "brand" }, { label: "Bookings", value: num(d?.totals.bookings ?? 0), icon: CalendarCheck, accent: "blue" },
    { label: "New users", value: num(d?.totals.newUsers ?? 0), icon: UserPlus, accent: "violet" }, { label: "Avg. booking value", value: inr(d?.totals.avgBookingValue ?? 0), icon: Wallet, accent: "green" },
    { label: "Cancellation rate", value: `${d?.totals.cancellationRate ?? 0}%`, icon: Percent, accent: "red" },
  ];
  const exportCsv = () => d && downloadCsv(`playnora-report-${r.from}-to-${r.to}.csv`, [["Period", "Revenue (INR)", "Bookings", "New users"], ...d.timeline.map((t) => [t.label, t.revenue, t.bookings, t.newUsers])]);

  return (
    <>
      <PageHeader title="Analytics" accent="& reports" description="Revenue, bookings, growth and venue performance for any date range." actions={<button className="adm-btn" onClick={exportCsv} disabled={!d || L}><Download size={14} aria-hidden="true" />Export CSV</button>} />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Date presets" className="flex max-w-full gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-xl border border-white/10 bg-white/5 p-1">{PRESETS.map((p) => <button key={p.days} aria-pressed={preset === p.days} onClick={() => { setPreset(p.days); setR(range(p.days)); }} className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition ${preset === p.days ? "bg-violet text-white" : "text-white/60 hover:text-white"}`}>Last {p.label}</button>)}</div>
        <DateRange from={r.from} to={r.to} onChange={(x) => { setPreset(null); setR(x); }} />
      </div>
      {!valid ? <div className="adm-card"><EmptyState title="Choose a valid date range" hint="The start date must be on or before the end date." /></div> : rep.error ? <div className="adm-card"><ErrorState message={rep.error} onRetry={rep.reload} /></div> : (
        <>
          <section aria-label="Report totals" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">{kpis.map((k) => <StatCard key={k.label} loading={L} {...k} />)}</section>
          <section className="mt-4 grid gap-4 lg:grid-cols-2">
            <ChartCard title="Revenue report" subtitle="Gross paid bookings" loading={L}><AreaChart ariaLabel="Revenue over time" labels={labels} series={[{ name: "Revenue", color: "#fbbf12", values: d?.timeline.map((t) => t.revenue) ?? [] }]} format={money} /></ChartCard>
            <ChartCard title="Booking report" subtitle="Bookings in period" loading={L}><ColumnChart ariaLabel="Bookings over time" data={d?.timeline.map((t) => ({ label: t.label, value: t.bookings })) ?? []} /></ChartCard>
            <ChartCard title="User growth" subtitle="New registrations" loading={L}><AreaChart ariaLabel="New users over time" labels={labels} series={[{ name: "New users", color: "#8b3dff", values: d?.timeline.map((t) => t.newUsers) ?? [] }]} /></ChartCard>
            <ChartCard title="Popular sports" subtitle="Share of active bookings" loading={L}><DonutChart ariaLabel="Bookings by sport" centerLabel="bookings" items={d?.popularSports ?? []} /></ChartCard>
          </section>
          <section className="adm-card adm-fade mt-4 overflow-hidden">
            <header className="border-b border-white/10 px-5 py-4"><h2 className="font-extrabold">Venue performance</h2><p className="text-xs text-white/50">Ranked by revenue · occupancy = booked slots ÷ available slots in the period</p></header>
            {L ? <div className="space-y-3 p-5">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10" />)}</div> : !d?.venuePerformance.length ? <EmptyState title="No venue activity" /> : (
              <><div className="overflow-x-auto max-md:hidden"><table className="w-full min-w-[520px] text-sm"><thead><tr className="border-b border-white/10 bg-white/[0.03] text-left text-[11px] font-bold uppercase tracking-wider text-white/50"><th className="px-5 py-3">#</th><th className="py-3">Venue</th><th className="py-3 text-right">Bookings</th><th className="py-3 text-right">Revenue</th><th className="px-5 py-3">Occupancy</th></tr></thead>
                <tbody>{d.venuePerformance.slice(0, 10).map((v, i) => <tr key={v.venueId} className="border-b border-white/5 last:border-0"><td className="px-5 py-3 text-white/40">{i + 1}</td><td className="py-3 font-semibold">{v.name}</td><td className="py-3 text-right">{v.bookings}</td><td className="py-3 text-right font-semibold">{inr(v.revenue)}</td><td className="px-5 py-3"><div className="flex items-center gap-3"><div className="h-2 w-full min-w-[80px] max-w-[160px] overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-violet to-brand" style={{ width: `${v.occupancy}%` }} /></div><span className="w-12 text-xs text-white/60">{v.occupancy}%</span></div></td></tr>)}</tbody></table></div>
              <ul className="divide-y divide-white/5 md:hidden">{d.venuePerformance.slice(0, 10).map((v, i) => <li key={v.venueId} className="px-4 py-3.5"><div className="flex items-start justify-between gap-3"><p className="min-w-0 font-semibold"><span className="mr-2 text-white/40">{i + 1}</span>{v.name}</p><span className="shrink-0 text-sm font-semibold">{inr(v.revenue)}</span></div><div className="mt-2.5 flex items-center gap-3 text-xs text-white/60"><span className="shrink-0">{v.bookings} bookings</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-violet to-brand" style={{ width: `${v.occupancy}%` }} /></div><span className="w-10 shrink-0 text-right">{v.occupancy}%</span></div></li>)}</ul></>
            )}
          </section>
        </>
      )}
    </>
  );
}
