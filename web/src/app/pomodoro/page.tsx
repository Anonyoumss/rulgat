"use client";

import { useEffect, useRef, useState } from "react";
import { useProgressCtx } from "@/components/ProgressProvider";
import { useI18n } from "@/lib/i18n";
import Mascot from "@/components/Mascot";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";

const FOCUS = 25 * 60;
const SHORT = 5 * 60;

export default function PomodoroPage() {
  const { t } = useI18n();
  const { recordPomodoro } = useProgressCtx();
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [left, setLeft] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          clearInterval(timer.current!);
          setRunning(false);
          if (mode === "focus") {
            recordPomodoro();
            setDone(true);
          }
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(timer.current!);
  }, [running, mode, recordPomodoro]);

  const switchMode = (m: "focus" | "break") => {
    setMode(m); setLeft(m === "focus" ? FOCUS : SHORT); setRunning(false); setDone(false);
  };

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const pct = 1 - left / (mode === "focus" ? FOCUS : SHORT);
  const R = 84, C = 2 * Math.PI * R;

  return (
    <main className="mx-auto max-w-md px-4 pt-10 text-center">
      <h1 className="text-2xl font-extrabold mb-6">{t.pomodoro.title}</h1>

      <div className="relative inline-flex items-center justify-center mb-6">
        <svg width="200" height="200" className="-rotate-90">
          <circle cx="100" cy="100" r={R} fill="none" stroke="var(--border-subtle)" strokeWidth="10" />
          <circle
            cx="100" cy="100" r={R} fill="none"
            stroke="var(--primary)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - pct)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div className="absolute">
          <p className="text-5xl font-black tabular-nums">{mm}:{ss}</p>
          <p className="text-sm text-[var(--muted)]">{mode === "focus" ? t.pomodoro.focus : t.pomodoro.break}</p>
        </div>
      </div>

      <Mascot mood={running ? "happy" : done ? "proud" : "idle"} size={84} className="mx-auto mb-4" />

      {done && (
        <div className="card p-4 mb-4 animate-pop">
          <p className="font-bold text-[var(--success)]">🎉 {t.lesson.waterEarned} +{t.home.xp}!</p>
          <p className="text-sm text-[var(--muted)]">TIGDR got water for his garden.</p>
        </div>
      )}

      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => switchMode("focus")} className={`chip cursor-pointer ${mode === "focus" ? "ring-2 ring-[var(--primary)]" : ""}`}>{t.pomodoro.focus}</button>
        <button onClick={() => switchMode("break")} className={`chip cursor-pointer ${mode === "break" ? "ring-2 ring-[var(--primary)]" : ""}`}>{t.pomodoro.break}</button>
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={() => setRunning((r) => !r)} className="btn-primary px-8">
          {running ? <Pause size={18} /> : <Play size={18} />} {running ? t.pomodoro.pause : t.pomodoro.start}
        </button>
        <button onClick={() => { setLeft(mode === "focus" ? FOCUS : SHORT); setRunning(false); }} className="btn-ghost">
          <RotateCcw size={18} /> {t.pomodoro.reset}
        </button>
      </div>

      <p className="mt-8 text-sm text-[var(--muted)] flex items-center justify-center gap-2">
        <Coffee size={14} /> {t.pomodoro.sessions}: see profile
      </p>
    </main>
  );
}
