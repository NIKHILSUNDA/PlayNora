import type { Sport } from "@/types";

const pts = (cx: number, cy: number, r: number, rot: number) =>
  Array.from({ length: 5 }, (_, k) => {
    const a = ((rot + k * 72) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

/** Accent colours per sport (badge background). */
export const SPORT_TONE: Record<Sport, [string, string]> = {
  Football: ["#16a34a", "#052e16"],
  "Box Cricket": ["#dc2626", "#450a0a"],
  Pickleball: ["#0d9488", "#042f2e"],
  Padel: ["#ea580c", "#431407"],
};

function Art({ sport }: { sport: Sport }) {
  if (sport === "Football") {
    const dirs = [0, 1, 2, 3, 4].map((k) => -90 + k * 72);
    return (
      <>
        <defs><clipPath id="sl-fb"><circle cx="32" cy="32" r="27" /></clipPath></defs>
        <circle cx="32" cy="32" r="27" fill="#fff" />
        <g clipPath="url(#sl-fb)" fill="#1f2937" stroke="#1f2937" strokeLinejoin="round" strokeWidth="1.5">
          <polygon points={pts(32, 32, 8.5, -90)} />
          {dirs.map((d) => {
            const rad = (d * Math.PI) / 180;
            return <polygon key={d} points={pts(32 + 27 * Math.cos(rad), 32 + 27 * Math.sin(rad), 9, d + 180)} />;
          })}
          {dirs.map((d) => {
            const rad = (d * Math.PI) / 180;
            return <line key={`l${d}`} x1={32 + 8.5 * Math.cos(rad)} y1={32 + 8.5 * Math.sin(rad)} x2={32 + 17 * Math.cos(rad)} y2={32 + 17 * Math.sin(rad)} strokeWidth="1.8" fill="none" />;
          })}
        </g>
        <circle cx="32" cy="32" r="27" fill="none" stroke="#111827" strokeWidth="2" />
        <path d="M14 18a22 22 0 0 1 12-9" stroke="#fff" strokeOpacity=".7" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </>
    );
  }
  if (sport === "Box Cricket") {
    return (
      <>
        <g transform="rotate(-38 30 32)">
          <rect x="27" y="3" width="6" height="17" rx="3" fill="#1f2937" />
          <rect x="27" y="9" width="6" height="2.2" fill="#fbbf12" />
          <rect x="27" y="13" width="6" height="2.2" fill="#fbbf12" />
          <rect x="21.5" y="19" width="17" height="38" rx="5" fill="#e7bd7a" stroke="#8a5a1f" strokeWidth="1.6" />
          <line x1="30" y1="22" x2="30" y2="54" stroke="#b9853a" strokeWidth="1.5" />
        </g>
        <circle cx="46.5" cy="44.5" r="11" fill="#c81e2e" stroke="#7f1220" strokeWidth="1.6" />
        <path d="M39 38.5c4 3 4 12 0 14.5M54 36.5c-4 3-4 12 0 14.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2.2 2.2" fill="none" />
      </>
    );
  }
  if (sport === "Pickleball") {
    return (
      <>
        <g transform="rotate(-32 30 30)">
          <rect x="29" y="38" width="6" height="19" rx="3" fill="#1f2937" />
          <rect x="16" y="5" width="32" height="36" rx="14" fill="#2dd4bf" stroke="#0f766e" strokeWidth="2" />
          <rect x="21" y="10" width="22" height="26" rx="10" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="1.5" />
          <rect x="28" y="36" width="8" height="4" rx="2" fill="#0f766e" />
        </g>
        <circle cx="47" cy="46" r="10" fill="#d9f23a" stroke="#8aa000" strokeWidth="1.6" />
        {[[43, 43], [48, 42], [51, 47], [45, 48], [48, 51], [43, 51]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" fill="#5f6d00" />)}
      </>
    );
  }
  return (
    <>
      <g transform="rotate(-34 30 30)">
        <rect x="28.5" y="38" width="7" height="19" rx="3.2" fill="#1f2937" />
        <path d="M32 3c11 0 17 7 17 17 0 10-6 18-17 18S15 30 15 20C15 10 21 3 32 3z" fill="#fb923c" stroke="#9a3412" strokeWidth="2" />
        {[0, 1, 2, 3].flatMap((r) => [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={25 + c * 7} cy={11 + r * 7} r="1.7" fill="#7c2d12" />))}
      </g>
      <circle cx="47.5" cy="46.5" r="9.5" fill="#d9f23a" stroke="#8aa000" strokeWidth="1.6" />
      <path d="M39 44c5 1 8 5 9 11M42 38c2 4 7 6 14 5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </>
  );
}

/** Illustrated sport emblem (vector, no emoji). */
export default function SportLogo({ sport, size = 56, className = "" }: { sport: Sport; size?: number; className?: string }) {
  const [a, b] = SPORT_TONE[sport];
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-2xl border border-white/25 shadow-[0_8px_20px_rgba(0,0,0,.45)] ${className}`}
      style={{ width: size, height: size, background: `linear-gradient(145deg, ${a}, ${b})` }}
      role="img"
      aria-label={`${sport} logo`}
    >
      <svg viewBox="0 0 64 64" width={size * 0.78} height={size * 0.78} aria-hidden="true"><Art sport={sport} /></svg>
    </span>
  );
}
