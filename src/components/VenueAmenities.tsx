import Reveal from "@/components/Reveal";

const Washroom = () => (
  <svg viewBox="0 0 48 48" width="38" height="38" fill="currentColor" aria-hidden="true">
    <g className="vn-bob">
      <circle cx="13" cy="11" r="4" />
      <rect x="8" y="17" width="10" height="15" rx="3.5" />
      <rect x="9.5" y="31" width="3.4" height="11" rx="1.7" /><rect x="13.1" y="31" width="3.4" height="11" rx="1.7" />
    </g>
    <line x1="24" y1="8" x2="24" y2="42" stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" strokeDasharray="3 3" />
    <g className="vn-bob vn-d2">
      <circle cx="35" cy="11" r="4" />
      <path d="M35 17c2.6 0 3.6 1.4 4.4 4L43 33H27l3.6-12c.8-2.6 1.8-4 4.4-4z" />
      <rect x="31.2" y="32" width="3.2" height="10" rx="1.6" /><rect x="35.6" y="32" width="3.2" height="10" rx="1.6" />
    </g>
  </svg>
);

const Parking = () => (
  <svg viewBox="0 0 48 48" width="38" height="38" aria-hidden="true" fill="none" stroke="currentColor">
    <rect x="9" y="3" width="30" height="27" rx="7" strokeWidth="2.6" />
    <path d="M19.5 24V10.5h6.2a4.4 4.4 0 0 1 0 8.8h-6.2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="3" y1="45" x2="45" y2="45" strokeOpacity=".4" strokeWidth="1.6" strokeDasharray="4 4" />
    <g className="vn-car" fill="currentColor" stroke="none">
      <path d="M8 41.5c0-2 1.2-3 3-3.4l3-3.6h9l3.2 3.6c1.6.3 2.8 1.4 2.8 3.4V43H8z" />
      <circle cx="13.5" cy="43.5" r="2.5" fill="#1a0b2e" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="26.5" cy="43.5" r="2.5" fill="#1a0b2e" stroke="currentColor" strokeWidth="1.4" />
    </g>
  </svg>
);

const Water = () => (
  <svg viewBox="0 0 48 48" width="38" height="38" aria-hidden="true">
    <defs><clipPath id="vn-glass"><path d="M12.5 19h23l-2.9 22.6a2 2 0 0 1-2 1.7H17.4a2 2 0 0 1-2-1.7z" /></clipPath></defs>
    <path className="vn-drop" d="M24 2.5c2.8 3.6 4.8 6.4 4.8 8.8a4.8 4.8 0 0 1-9.6 0c0-2.4 2-5.2 4.8-8.8z" fill="currentColor" />
    <g clipPath="url(#vn-glass)">
      <path className="vn-wave" d="M-24 30q6-5 12 0t12 0 12 0 12 0 12 0 12 0 12 0 12 0V50H-24z" fill="currentColor" fillOpacity=".85" />
    </g>
    <path d="M12.5 19h23l-2.9 22.6a2 2 0 0 1-2 1.7H17.4a2 2 0 0 1-2-1.7z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
  </svg>
);

const Seat = () => (
  <svg viewBox="0 0 48 48" width="38" height="38" fill="currentColor" aria-hidden="true">
    <rect x="10" y="8" width="28" height="18" rx="6.5" fillOpacity=".55" />
    <rect className="vn-squish" x="8" y="23" width="32" height="11" rx="4.5" />
    <rect x="3" y="17" width="8" height="19" rx="4" /><rect x="37" y="17" width="8" height="19" rx="4" />
    <rect x="11" y="36" width="3.6" height="7" rx="1.8" /><rect x="33.4" y="36" width="3.6" height="7" rx="1.8" />
  </svg>
);

const ITEMS = [
  { label: "Washroom", note: "Clean & hygienic", Icon: Washroom },
  { label: "Parking", note: "Easy vehicle parking", Icon: Parking },
  { label: "Drinking Water", note: "Fresh & filtered", Icon: Water },
  { label: "Sitting Area", note: "Relax between games", Icon: Seat },
] as const;

export default function VenueAmenities() {
  return (
    <section className="mt-8 max-sm:mt-6" aria-labelledby="amenities-title">
      <p className="text-[11px] font-semibold tracking-[.3em] text-brand">— AMENITIES</p>
      <h2 id="amenities-title" className="mb-4 mt-1 text-2xl font-extrabold leading-tight max-sm:mb-3 max-sm:text-lg">Everything you need, on site</h2>
      <Reveal stagger>
        <ul className="grid grid-cols-4 gap-2 sm:gap-3">
          {ITEMS.map(({ label, note, Icon }, i) => (
            <li key={label} className="stg" style={{ transitionDelay: `${i * 110}ms` }}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/15 bg-white/[.06] p-4 text-center backdrop-blur-sm transition duration-300 max-sm:rounded-xl max-sm:p-2 max-sm:pb-2.5 hover:-translate-y-1 hover:border-violet/60 hover:bg-white/10 hover:shadow-[0_14px_34px_-12px_rgba(139,61,255,.6)]">
                <span className="vn-sheen" aria-hidden="true" />
                <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full max-sm:h-9 max-sm:w-9 max-sm:[&_svg]:h-5 max-sm:[&_svg]:w-5 bg-gradient-to-br from-violet/45 to-pink-500/30 text-brand">
                  <span className="vn-ring absolute inset-0 rounded-full border border-brand/50" aria-hidden="true" />
                  <Icon />
                </span>
                <h3 className="mt-3 text-[15px] font-extrabold leading-tight max-sm:mt-1.5 max-sm:text-[11px]">{label}</h3>
                <p className="mt-1 text-xs leading-snug text-white/60 max-sm:hidden">{note}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
