"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useBooking } from "@/context/BookingContext";
import { PLATFORM_FEE } from "@/data/sessions";
import { fmtDate, inr } from "@/lib/format";
import type { Venue } from "@/types";

const METHODS = ["UPI (GPay, PhonePe, Paytm)", "Debit / Credit Card", "Net Banking", "Wallet"];
export default function Checkout({ venue }: { venue: Venue }) {
  const { booking } = useBooking();
  const router = useRouter();
  const [method, setMethod] = useState(0);
  if (!booking || booking.venue.id !== venue.id) return <div className="glass text-center">Please choose a date and slot first. <button className="btn mt-4" onClick={() => router.push(`/venues/${venue.id}`)}>Back to venue</button></div>;
  return (
    <div className="grid items-start gap-6 md:grid-cols-[1.5fr_1fr]">
      <div className="glass">{METHODS.map((m, i) => <button key={m} onClick={() => setMethod(i)} className="flex w-full items-center gap-3 border-b border-white/20 py-4 text-left last:border-0" aria-pressed={method === i}><span className={`h-[18px] w-[18px] rounded-full border-2 ${method === i ? "border-violet bg-violet" : "border-white/60"}`} />{m}</button>)}</div>
      <div className="glass">
        <b>{venue.name}</b>
        <p className="text-sm text-white/70">{booking.sport ? `${booking.sport} · ` : ""}{fmtDate(booking.date)} · {booking.slot}{booking.session ? "" : " (1 hour)"}</p>
        {booking.session && <p className="mt-1 text-sm font-semibold text-brand">{booking.session.title}</p>}
        {booking.players && booking.players.length > 0 && (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/[.04] p-3 text-sm">
            <p className="text-xs font-bold text-white/60">Players ({booking.players.length})</p>
            <ul className="mt-1.5 space-y-0.5">{booking.players.map((n, i) => <li key={i} className="truncate">{n}</li>)}</ul>
            {booking.contact && <p className="mt-2 border-t border-white/10 pt-2 text-xs text-white/65">Contact: {booking.contact.phone}</p>}
          </div>
        )}
        <div className="mt-3 flex justify-between text-sm"><span>{booking.session && booking.players ? `Entry fee (${inr(booking.session.fee)} × ${booking.players.length})` : "Venue Booking"}</span><span>₹{(booking.price ?? venue.pricePerHour).toLocaleString()}</span></div>
        <div className="flex justify-between py-2 text-sm"><span>Platform Fee</span><span>₹{PLATFORM_FEE}</span></div>
        <div className="mb-4 flex justify-between border-t border-white/20 pt-3 text-lg font-extrabold"><span>Total</span><span>₹{booking.total.toLocaleString()}</span></div>
        <button className="btn w-full" onClick={() => router.push("/confirmed")}>🔒 Pay Now</button>
        <p className="mt-3 text-xs text-white/70">Demo only – no real payment is processed.</p>
      </div>
    </div>
  );
}
