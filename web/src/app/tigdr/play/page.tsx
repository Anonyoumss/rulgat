"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GARDEN_LEVELS, formatRatio, dryRatio, type GardenScene } from "@/lib/geo-core";
import { useProgressCtx } from "@/components/ProgressProvider";
import { useI18n } from "@/lib/i18n";
import GeoScene from "@/components/GeoScene";
import Mascot from "@/components/Mascot";
import { Droplets, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

type Phase = "watering" | "asking" | "feedback";

const WATERING_MS = 2200;

export default function TigdrPlayPage() {
  const { t, lang } = useI18n();
  const { progress, addXp, addWater } = useProgressCtx();
  const [levelIdx, setLevelIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("watering");
  const [selected, setSelected] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(0);

  const scene: GardenScene = GARDEN_LEVELS[levelIdx % GARDEN_LEVELS.length];

  // answer choices: correct watered ratio + dry ratio + 2 distractors
  const choices = useMemo(() => {
    const correct = scene.wateredRatio;
    const dry = dryRatio(scene);
    const distractors = [0.5, 0.25, 0.75, 1 / 3, 2 / 3, 0.6, 0.4, 0.125, 0.875]
      .map((d) => (Math.abs(d - correct) > 0.02 && Math.abs(d - dry) > 0.02 ? d : null))
      .filter((d): d is number => d !== null)
      .slice(0, 2);
    const all = [correct, dry, ...distractors].slice(0, 4);
    // deterministic shuffle keyed by round + value
    return [...all].sort((a, b) => {
      const ka = Math.sin((round + 1) * 997 + a * 131) ;
      const kb = Math.sin((round + 1) * 997 + b * 131);
      return ka - kb;
    });
  }, [scene, round]);

  const startWatering = () => {
    setPhase("watering");
    setSelected(null);
    setTimeout(() => setPhase("asking"), WATERING_MS);
  };

  const pick = (v: number) => {
    if (phase !== "asking") return;
    setSelected(v);
    setPhase("feedback");
    const ok = Math.abs(v - scene.wateredRatio) < 0.001;
    if (ok) {
      setStreak((s) => s + 1);
      addXp(15);
      addWater(1);
    } else {
      setStreak(0);
    }
  };

  const nextGarden = () => {
    setLevelIdx((i) => i + 1);
    setRound((r) => r + 1);
    setPhase("watering");
    setSelected(null);
    setTimeout(() => setPhase("asking"), WATERING_MS);
  };

  const lastCorrect = selected !== null && Math.abs(selected - scene.wateredRatio) < 0.001;

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold">{t.tigdr.title}</h1>
        <div className="flex gap-2">
          <span className="chip"><Droplets size={14} className="text-[var(--primary)]" />{progress.water}</span>
          <span className="chip">🔥 {streak}</span>
        </div>
      </header>

      <section className="card p-6 mb-5 text-center relative overflow-hidden">
        {/* TIGDR watering animation */}
        <AnimatePresence mode="wait">
          {phase === "watering" && (
            <motion.div key="water" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8">
              <Mascot mood="happy" size={100} className="mx-auto mb-3" />
              <p className="text-lg font-semibold">{scene.name_en} — TIGDR is watering…</p>
              <div className="mt-4 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="inline-block text-2xl"
                    animate={{ y: [0, -14, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.25 }}
                  >
                    💧
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
          {(phase === "asking" || phase === "feedback") && (
            <motion.div key="scene" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
              <div className="flex justify-center"><GeoScene scene={scene} size={280} /></div>
              <p className="mt-3 font-semibold">{lang === "ar" ? scene.question.ar : scene.question.en}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* answer phase */}
      <AnimatePresence>
        {phase !== "watering" && (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <p className="font-bold text-center">{t.tigdr.howMuchWatered}</p>
            <div className="grid grid-cols-2 gap-3">
              {choices.map((v, i) => {
                const isCorrect = Math.abs(v - scene.wateredRatio) < 0.001;
                const isSel = selected === v;
                return (
                  <button
                    key={i}
                    onClick={() => pick(v)}
                    disabled={phase === "feedback"}
                    className={`option-row justify-center text-xl font-bold py-4 ${
                      phase === "feedback" && isCorrect ? "correct" : ""
                    } ${phase === "feedback" && isSel && !isCorrect ? "wrong" : ""} ${
                      phase === "feedback" && !isSel && !isCorrect ? "opacity-50" : ""
                    }`}
                  >
                    {formatRatio(v, lang)}
                    {phase === "feedback" && isCorrect && <CheckCircle2 size={18} className="text-[var(--success)]" />}
                    {phase === "feedback" && isSel && !isCorrect && <XCircle size={18} className="text-[var(--danger)]" />}
                  </button>
                );
              })}
            </div>

            {phase === "feedback" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-3 pt-2">
                <p className={`font-bold ${lastCorrect ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
                  {lastCorrect ? `✓ ${t.tigdr.correct}` : `✗ ${t.tigdr.wrong}`}
                </p>
                <p className="text-sm text-[var(--muted)]">
                  {lang === "ar"
                    ? `المسقي ${formatRatio(scene.wateredRatio, "ar")} — غير المسقي ${formatRatio(dryRatio(scene), "ar")}`
                    : `Watered ${formatRatio(scene.wateredRatio, "en")} — dry ${formatRatio(dryRatio(scene), "en")}`}
                </p>
                <button onClick={nextGarden} className="btn-primary">
                  {t.tigdr.nextGarden} <ArrowLeft size={16} className="rtl:rotate-180" />
                </button>
              </motion.div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {phase === "watering" && (
        <button onClick={startWatering} className="btn-tonal w-full mt-2">
          <Droplets size={16} /> Skip animation
        </button>
      )}
    </main>
  );
}
