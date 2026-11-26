import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/admin/ui/Toast";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

export const metadata: Metadata = { title: "PlayNora Admin", description: "PlayNora platform administration", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminAuthProvider><ToastProvider>{children}</ToastProvider></AdminAuthProvider>;
}
