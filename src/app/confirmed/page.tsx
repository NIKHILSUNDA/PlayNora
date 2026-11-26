"use client";
import Link from "next/link";
import { useBooking } from "@/context/BookingContext";

export default function Confirmed() {
  const { booking } = useBooking();
  return (
    <div className="bg-page min-h-screen px-[6vw] pb-16 pt-32 text-center">
      <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full border-[3px] border-green-400 bg-white text-5xl text-green-500">✓</div>
      <h1 className="text-4xl font-extrabold max-sm:text-3xl">Booking Confirmed!</h1>
      <p className="mb-8 mt-2">{booking?.session ? "Your spot in the game is reserved." : "Your venue has been successfully booked."} <span className="text-white/60">(Demo – no payment was processed.)</span></p>
      {booking ? <div className="glass mx-auto max-w-[800px] text-left"><b>{booking.venue.name}</b><p className="text-sm text-white/70">{booking.session ? `${booking.session.title} · ` : ""}{booking.date} · {booking.slot} · ₹{booking.total.toLocaleString()}</p>{booking.players && <p className="mt-1 text-sm text-white/70">{booking.players.length} {booking.players.length === 1 ? "player" : "players"}: {booking.players.join(", ")}</p>}</div> : <p className="text-white/70">No recent booking found.</p>}
      <Link href="/venues" className="btn mt-8">Book another venue</Link>
    </div>
  );
}
