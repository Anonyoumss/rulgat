"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { pickQuestions } from "@/lib/questions";
import { CHAPTERS } from "@/lib/curriculum";
import { useI18n } from "@/lib/i18n";
import { Play, Clock } from "lucide-react";

const DURATIONS = [
  { label: "10 min", sec: 600 },
  { label: "20 min", sec: 1200 },
  { label: "30 min", sec: 1800 },
];

export default function MockSetupPage() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const [count, setCount] = useState(20);
  const [chapter, setChapter] = useState<number | "all">("all");
  const [section, setSection] = useState<"all" | "quantitative" | "verbal">("all");
  const [duration, setDuration] = useState(1200);

  const start = () => {
    const qs = pickQuestions(
      {
        chapter: chapter === "all" ? undefined : chapter,
        section: section === "all" ? undefined : section,
      },
      Math.min(count, 96),
      Date.now() % 100000
    );
    sessionStorage.setItem(
      "rulgat.mock",
      JSON.stringify({ questions: qs, durationSec: duration, startedAt: Date.now() })
    );
    router.push("/mock/exam");
  };

  return (
    <main className="mx-auto max-w-2xl px-4 pt-6">
      <h1 className="text-2xl font-extrabold mb-1">{t.mock.title}</h1>
      <p className="text-[var(--muted)] mb-6">{t.mock.setup} — Qiyas-style CBT</p>

      <section className="card p-6 space-y-5">
        <div>
          <p className="font-semibold mb-2">{lang === "ar" ? "الباب" : "Chapter"}</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setChapter("all")} className={`chip cursor-pointer ${chapter === "all" ? "ring-2 ring-[var(--primary)]" : ""}`}>{lang === "ar" ? "الكل" : "All"}</button>
            {CHAPTERS.map((c) => (
              <button key={c.id} onClick={() => setChapter(c.id)} className={`chip cursor-pointer ${chapter === c.id ? "ring-2 ring-[var(--primary)]" : ""}`}>
                {lang === "ar" ? `باب ${c.id}` : `Ch ${c.id}`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">{lang === "ar" ? "القسم" : "Section"}</p>
          <div className="flex gap-2">
            {(["all", "quantitative", "verbal"] as const).map((s) => (
              <button key={s} onClick={() => setSection(s)} className={`chip cursor-pointer ${section === s ? "ring-2 ring-[var(--primary)]" : ""}`}>
                {s === "all" ? (lang === "ar" ? "الكل" : "All") : s === "quantitative" ? (lang === "ar" ? "كمّي" : "Quant") : (lang === "ar" ? "لفظي" : "Verbal")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-2">{t.mock.questions}: {count}</p>
          <input type="range" min={5} max={96} step={5} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
        </div>

        <div>
          <p className="font-semibold mb-2 flex items-center gap-1.5"><Clock size={15} /> {t.mock.duration}</p>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button key={d.sec} onClick={() => setDuration(d.sec)} className={`chip cursor-pointer ${duration === d.sec ? "ring-2 ring-[var(--primary)]" : ""}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={start} className="btn-primary w-full text-lg py-3">
          <Play size={20} /> {t.mock.startExam}
        </button>
      </section>
    </main>
  );
}
