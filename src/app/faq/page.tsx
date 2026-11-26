import type { Metadata } from "next";
import FaqExplorer from "@/components/FaqExplorer";

export const metadata: Metadata = { title: "FAQs – PlayNora", description: "Answers about bookings, payments, cancellations and your PlayNora account." };

export default function FaqPage() {
  return (
    <section className="bg-page min-h-screen px-[6vw] pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        <div className="faq-rise mb-10 text-center">
          <p className="text-[11px] font-semibold tracking-[.3em] text-brand">— NEED GUIDANCE?</p>
          <h1 className="mt-3 text-[clamp(40px,6vw,68px)] font-black italic leading-none tracking-tight">How can we <span className="bg-gradient-to-r from-brand to-pink-500 bg-clip-text font-serif text-transparent">help?</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-white/75">Quick answers about bookings, payments, cancellations and your account.</p>
        </div>
        <FaqExplorer />
      </div>
    </section>
  );
}
