"use client";
import { useState } from "react";
import { Bell, KeyRound, SlidersHorizontal, UserCircle, type LucideIcon } from "lucide-react";
import { NotificationForm, PasswordForm, PlatformForm, ProfileForm } from "@/components/admin/settings/SettingsForms";
import PageHeader from "@/components/admin/ui/PageHeader";
import { ErrorState, Skeleton } from "@/components/admin/ui/States";
import { useAsync } from "@/hooks/useAdminData";
import { settingsApi } from "@/services/admin";

type Tab = "profile" | "security" | "platform" | "notifications";
const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [{ id: "profile", label: "Profile", icon: UserCircle }, { id: "security", label: "Password", icon: KeyRound }, { id: "platform", label: "Platform", icon: SlidersHorizontal }, { id: "notifications", label: "Notifications", icon: Bell }];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const profile = useAsync(() => settingsApi.profile());
  const cfg = useAsync(() => settingsApi.get());
  const loading = tab === "security" ? false : tab === "profile" ? profile.loading : cfg.loading;
  const error = tab === "profile" ? profile.error : tab === "platform" || tab === "notifications" ? cfg.error : null;
  return (
    <>
      <PageHeader title="Admin" accent="settings" description="Manage your profile, security and platform-wide configuration." />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div role="tablist" aria-orientation="vertical" className="flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1 lg:h-fit lg:flex-col">
          {TABS.map(({ id, label, icon: Icon }) => <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-semibold transition ${tab === id ? "bg-violet text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}><Icon size={16} aria-hidden="true" />{label}</button>)}
        </div>
        <div role="tabpanel" className="min-w-0">
          {loading ? <Skeleton className="h-72" /> : error ? <div className="adm-card"><ErrorState message={error} onRetry={tab === "profile" ? profile.reload : cfg.reload} /></div> : (
            <>
              {tab === "profile" && profile.data && <ProfileForm profile={profile.data} onSaved={profile.reload} />}
              {tab === "security" && <PasswordForm />}
              {tab === "platform" && cfg.data && <PlatformForm value={cfg.data.platform} onSaved={cfg.reload} />}
              {tab === "notifications" && cfg.data && <NotificationForm value={cfg.data.notifications} onSaved={cfg.reload} />}
            </>
          )}
        </div>
      </div>
    </>
  );
}
