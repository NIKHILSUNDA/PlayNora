import { BarChart3, CalendarCheck, CreditCard, LayoutDashboard, MapPin, Settings, Trophy, Users, type LucideIcon } from "lucide-react";

export interface NavItem { href: string; label: string; icon: LucideIcon }
export const NAV: { title: string; items: NavItem[] }[] = [
  { title: "Overview", items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }, { href: "/admin/analytics", label: "Analytics & Reports", icon: BarChart3 }] },
  { title: "Management", items: [
    { href: "/admin/venues", label: "Venues", icon: MapPin }, { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
    { href: "/admin/users", label: "Users", icon: Users }, { href: "/admin/payments", label: "Payments", icon: CreditCard }, { href: "/admin/sports", label: "Sports", icon: Trophy },
  ] },
  { title: "System", items: [{ href: "/admin/settings", label: "Settings", icon: Settings }] },
];
export const titleFor = (path: string) => NAV.flatMap((g) => g.items).find((i) => path.startsWith(i.href))?.label ?? "Admin";
