import { Footprints, Trophy, Users } from "lucide-react";

/** Pure-CSS animation: players orbiting a central community hub. No JS needed. */
const PLAYERS = [
  { c: "#fbbf12", d: 0 }, { c: "#8b3dff", d: 1 }, { c: "#ec4899", d: 2 },
  { c: "#22d3ee", d: 3 }, { c: "#34d399", d: 4 }, { c: "#fb923c", d: 5 },
];

export default function CommunityOrbit() {
  return (
    <div className="cm-stage relative mx-auto aspect-square w-full max-w-[460px]" role="img" aria-label="Animated illustration of players gathering around the PlayNora community">
      <span className="cm-ring" style={{ animationDelay: "0s" }} />
      <span className="cm-ring" style={{ animationDelay: "1.3s" }} />
      <span className="cm-ring" style={{ animationDelay: "2.6s" }} />
      <div className="cm-orbit absolute inset-[10%]">
        {PLAYERS.map((p, i) => (
          <span key={i} className="cm-spoke" style={{ transform: `rotate(${i * 60}deg)` }}>
            <span className="cm-player" style={{ background: p.c, animationDelay: `${p.d * 0.25}s` }}>
              <Users size={18} aria-hidden="true" className="cm-counter" />
            </span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="cm-hub grid h-[34%] w-[34%] place-items-center rounded-full bg-gradient-to-br from-brand to-pink-500 text-[#1a1200] shadow-[0_0_60px_#a63a9c]" style={{ aspectRatio: "1" }}>
          <Trophy size={44} aria-hidden="true" />
        </div>
      </div>
      <Footprints size={22} aria-hidden="true" className="cm-float absolute left-[6%] top-[14%] text-white/60" />
      <Footprints size={18} aria-hidden="true" className="cm-float absolute bottom-[10%] right-[8%] text-white/60" style={{ animationDelay: "1.2s" }} />
    </div>
  );
}
