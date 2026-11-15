"use client";

import { cn } from "@/lib/cn";

export type MascotMood = "happy" | "thinking" | "proud" | "sad" | "idle";

/** Tiqdr (تيجر) — the RulGAT mascot: a cartoon boy traveler holding his
 *  GAT passport and suitcase. Placeholder vector art pending official
 *  tiqdr.com brand assets (see HANDOFF Open Questions). */
export default function Mascot({
  mood = "idle",
  size = 96,
  className,
}: {
  mood?: MascotMood;
  size?: number;
  className?: string;
}) {
  const smile =
    mood === "happy" || mood === "proud"
      ? "M42 58 Q50 66 58 58"
      : mood === "sad"
        ? "M42 64 Q50 56 58 64"
        : "M43 60 L57 60";
  const brow = mood === "thinking" ? -4 : mood === "sad" ? 4 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 110"
      className={cn("animate-float", className)}
      role="img"
      aria-label="Tiqdr mascot"
    >
      {/* legs */}
      <rect x="42" y="88" width="7" height="16" rx="3" fill="#334155" />
      <rect x="51" y="88" width="7" height="16" rx="3" fill="#334155" />
      {/* suitcase */}
      <rect x="60" y="86" width="26" height="20" rx="4" fill="#8b5cf6" />
      <rect x="60" y="86" width="26" height="6" rx="3" fill="#7c3aed" />
      <rect x="71" y="82" width="8" height="6" rx="2" fill="none" stroke="#7c3aed" strokeWidth="2" />
      {/* body */}
      <rect x="38" y="64" width="24" height="26" rx="8" fill="#38bdf8" />
      {/* passport in left hand */}
      <rect x="14" y="70" width="14" height="18" rx="2" fill="#ef4444" transform="rotate(-8 21 79)" />
      <rect x="17" y="75" width="8" height="2" fill="#fecaca" />
      <rect x="17" y="79" width="8" height="2" fill="#fecaca" />
      {/* head */}
      <circle cx="50" cy="38" r="22" fill="#fcd9b8" />
      {/* hair */}
      <path d="M28 36 Q30 16 50 16 Q70 16 72 36 Q66 24 50 24 Q34 24 28 36 Z" fill="#1f2937" />
      {/* eyes */}
      <circle cx="42" cy="38" r="2.6" fill="#1f2937" />
      <circle cx="58" cy="38" r="2.6" fill="#1f2937" />
      {/* brows */}
      <path d={`M37 ${30 + brow} q5 -3 9 0 M54 ${30 + brow} q5 -3 9 0`} stroke="#1f2937" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* nose + mouth */}
      <path d="M50 42 q2 3 0 5" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d={smile} stroke="#1f2937" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* cheeks */}
      <circle cx="36" cy="48" r="3" fill="#fda4af" opacity="0.6" />
      <circle cx="64" cy="48" r="3" fill="#fda4af" opacity="0.6" />
      {/* arms */}
      <path d="M40 72 L28 78" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
      <path d="M60 72 L70 82" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}
