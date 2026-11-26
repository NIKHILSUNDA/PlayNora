"use client";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Booking } from "@/types";

interface Ctx { booking: Booking | null; setBooking: (b: Booking | null) => void }
const BookingCtx = createContext<Ctx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const value = useMemo(() => ({ booking, setBooking }), [booking]);
  return <BookingCtx.Provider value={value}>{children}</BookingCtx.Provider>;
}
export function useBooking() {
  const c = useContext(BookingCtx);
  if (!c) throw new Error("useBooking must be used inside BookingProvider");
  return c;
}
