"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SLOTS } from "@/data/venues";
import { useBooking } from "@/context/BookingContext";
import { SPORT_LABEL } from "@/data/sports";
import type { Sport, Venue } from "@/types";

export default function BookingPanel({ venue }: { venue: Venue }) {
  const router = useRouter();
  const { setBooking } = useBooking();
  const options = venue.sports;
  const [sport, setSport] = useState<Sport>(options[0]);
  const price = venue.prices?.[sport] ?? venue.pricePerHour;
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(SLOTS[2]);
  const [err, setErr] = useState("");
  const go = () => {
    if (!date) return setErr("Please select a date");
    setBooking({ venue, date, slot, sport, price, total: price + 50 });
    router.push(`/book/${venue.id}`);
  };
  return (
    <div className="glass">
      <label className="block text-xs font-bold">Select Game
        <select value={sport} onChange={(e) => setSport(e.target.value as Sport)} className="mt-1.5 w-full rounded border border-white/20 bg-white/5 p-2.5 font-normal">
          {options.map((o) => <option key={o} value={o} className="text-black">{SPORT_LABEL[o]} – ₹{(venue.prices?.[o] ?? venue.pricePerHour).toLocaleString()}</option>)}
        </select>
      </label>
      <div className="mt-5 text-3xl font-extrabold">₹{price.toLocaleString()} <small className="text-sm font-normal">/ hour</small></div>
      <label className="mt-5 block text-xs font-bold">Select Date<input type="date" value={date} onChange={(e) => { setDate(e.target.value); setErr(""); }} className="mt-1.5 w-full rounded border border-white/20 bg-white/5 p-2.5 font-normal" /></label>
      <h4 className="mb-1.5 mt-5 text-xs font-bold">Select Time Slot</h4>
      <div className="grid grid-cols-2 gap-2.5">{SLOTS.map((s) => <button key={s} onClick={() => setSlot(s)} aria-pressed={slot === s} className={`rounded border p-2.5 text-sm font-semibold ${slot === s ? "border-violet bg-violet" : "border-white/20"}`}>{s}</button>)}</div>
      {err && <p role="alert" className="mt-3 text-sm text-red-300">{err}</p>}
      <button className="btn mt-5 w-full" onClick={go}>Book Now →</button>
    </div>
  );
}
