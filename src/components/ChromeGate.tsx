"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Hides the customer-site chrome (navbar/footer) on /admin/* routes, which render their own shell. */
export default function ChromeGate({ children }: { children: ReactNode }) {
  return usePathname()?.startsWith("/admin") ? null : <>{children}</>;
}
