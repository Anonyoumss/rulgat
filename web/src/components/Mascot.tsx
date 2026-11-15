"use client";

import { cn } from "@/lib/cn";

export type MascotMood = "happy" | "thinking" | "proud" | "sad" | "idle";

/** TIGDR — original tiger mascot (placeholder art pending brand assets).
 *  Rounded, friendly, M3-expressive proportions. */
export default function Mascot({
  mood = "idle",
  size = 96,
  className,
}: {
  mood?: MascotMood;
  size?: number;
  className?: string;
}) {
  const mouth =
    mood === "happy" || mood === "proud"
      ? "M40 62 Q50 72 60 62"
      : mood === "sad"
        ? "M40 68 Q50 60 60 68"
        : "M42 64 L58 64";
  const eyes =
    mood === "thinking"
      ? { left: "M34 46 q4 -4 8 0", right: "M58 42 q4 -4 8 0" }
      : mood === "sad"
        ? { left: "M34 44 q4 4 8 0", right: "M58 44 q4 4 8 0" }
        : { left: "M34 44 q4 -5 8 0", right: "M58 44 q4 -5 8 0" };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn("animate-float", className)}
      role="img"
      aria-label="TIGDR mascot"
    >
      {/* ears */}
      <circle cx="26" cy="26" r="12" fill="#f59e0b" />
      <circle cx="74" cy="26" r="12" fill="#f59e0b" />
      <circle cx="26" cy="26" r="6" fill="#fbcfe8" />
      <circle cx="74" cy="26" r="6" fill="#fbcfe8" />
      {/* head */}
      <ellipse cx="50" cy="55" rx="34" ry="30" fill="#fbbf24" />
      {/* stripes */}
      <path d="M30 30 q4 8 0 14 M42 26 q2 8 0 14 M58 26 q-2 8 0 14 M70 30 q-4 8 0 14" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      {/* muzzle */}
      <ellipse cx="50" cy="68" rx="16" ry="11" fill="#fef3c7" />
      {/* eyes */}
      <path d={eyes.left} stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d={eyes.right} stroke="#1f2937" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* nose + mouth */}
      <path d="M46 60 h8 l-4 6 z" fill="#1f2937" />
      <path d={mouth} stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* whiskers */}
      <path d="M16 62 h10 M16 68 h8 M84 62 h-10 M84 68 h-8" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
