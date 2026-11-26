import { notFound } from "next/navigation";
import Checkout from "@/components/Checkout";
import { venueService } from "@/services/api";

export default async function Book({ params }: { params: { id: string } }) {
  const { data: v } = await venueService.get(params.id);
  if (!v) notFound();
  return (
    <div className="bg-page min-h-screen px-[6vw] pb-16 pt-28">
      <h1 className="pb-8 text-[clamp(40px,6vw,68px)] font-extrabold leading-none tracking-tight">Complete <span className="block font-serif italic text-brand">Payment</span></h1>
      <Checkout venue={v} />
    </div>
  );
}
