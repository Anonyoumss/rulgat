"use client";

import Link from "next/link";
import { useProgressCtx } from "@/components/ProgressProvider";
import { useI18n } from "@/lib/i18n";
import Mascot from "@/components/Mascot";
import GeoScene from "@/components/GeoScene";
import { GARDEN_LEVELS } from "@/lib/geo-core";
import { Droplets, Play, BookOpen, Sparkles } from "lucide-react";

export default function TigdrPage() {
  const { t } = useI18n();
  const { progress } = useProgressCtx();
  const wateredCount = progress.gardenPlots.filter((g) => g.watered).length;
  const nextScene = GARDEN_LEVELS[wateredCount % GARDEN_LEVELS.length];

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold">{t.tigdr.title}</h1>
          <p className="text-[var(--muted)]">TIGDR · تِجْر</p>
        </div>
        <div className="chip text-base">
          <Droplets size={18} className="text-[var(--primary)]" /> {progress.water} {t.tigdr.water}
        </div>
      </header>

      {/* mascot + status */}
      <section className="glass rounded-[28px] p-6 flex flex-col sm:flex-row items-center gap-5 mb-6">
        <Mascot mood={progress.water > 0 ? "happy" : "sad"} size={110} />
        <div className="flex-1 text-center sm:text-start">
          <h2 className="text-xl font-bold mb-1">
            {wateredCount === 0 ? "TIGDR awaits his first watering" : `${wateredCount} gardens blooming 🌱`}
          </h2>
          <p className="text-sm text-[var(--muted)] mb-3">
            Finish lessons and Pomodoro sessions to earn water drops. Every garden teaches a geometry concept.
          </p>
          <Link href="/tigdr/play" className="btn-primary">
            <Play size={18} /> {t.tigdr.waterNow}
          </Link>
        </div>
      </section>

      {/* next garden preview */}
      <section className="card p-5 mb-6">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-[var(--accent-purple)]" /> Next garden preview
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <GeoScene scene={nextScene} size={200} />
          <div>
            <p className="font-semibold">{nextScene.name_en}</p>
            <p className="text-sm text-[var(--muted)]">topic: {nextScene.lessonTopic}</p>
            <p className="text-sm mt-1">{nextScene.question.ar}</p>
          </div>
        </div>
      </section>

      {/* gardens */}
      <section className="grid grid-cols-3 gap-3 mb-6">
        {progress.gardenPlots.map((g) => (
          <div key={g.id} className={`card p-3 text-center ${g.watered ? "border-[var(--success)]/50" : "opacity-70"}`}>
            <div className="text-2xl mb-1">{g.watered ? "🌸" : "🪴"}</div>
            <p className="text-xs font-medium">{g.name}</p>
            <p className="text-[10px] text-[var(--muted)]">{g.watered ? `stage ${g.stage}` : "seed"}</p>
          </div>
        ))}
      </section>

      {/* how it works */}
      <section className="card p-5">
        <h3 className="font-bold mb-2">How the garden teaches</h3>
        <ol className="space-y-2 text-sm text-[var(--muted)] list-decimal list-inside">
          <li>Complete a lesson or Pomodoro session → earn water drops 💧</li>
          <li>TIGDR visits a random garden shaped like the concept (triangle, square, shaded sector)</li>
          <li>You compute: how much is watered? how much is not? — real geometry, real answers</li>
          <li>Correct → plant grows a stage. Wrong → it wilts (recoverable). Streaks grow rare plants.</li>
        </ol>
        <Link href="/curriculum" className="btn-ghost mt-3 text-sm">
          <BookOpen size={15} /> {t.curriculum.title}
        </Link>
      </section>
    </main>
  );
}
