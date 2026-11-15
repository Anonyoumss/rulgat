"use client";

import { useState } from "react";
import Link from "next/link";
import { LESSON_CONTENT, topicName, chapterName } from "@/lib/curriculum";
import { byTopic } from "@/lib/questions";
import { useProgressCtx } from "@/components/ProgressProvider";
import { useI18n } from "@/lib/i18n";
import QuestionCard from "@/components/QuestionCard";
import Mascot from "@/components/Mascot";
import { CheckCircle2, Lightbulb, Droplets, ArrowRight } from "lucide-react";

export default function LessonPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { t, lang } = useI18n();
  const { progress, completeLesson } = useProgressCtx();
  const [done, setDone] = useState(progress.completedLessons.includes(id));

  const content = LESSON_CONTENT[id];
  const questions = byTopic(id).slice(0, 5);
  const name = topicName(id, lang);
  const chId = Number(id.split(".")[0].replace("ch", ""));

  const finish = () => {
    completeLesson(id);
    setDone(true);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6 pb-10">
      <Link href="/curriculum" className="btn-ghost text-sm mb-4">
        <ArrowRight size={16} className="rtl:rotate-180" /> {t.common.back}
      </Link>

      <header className="flex items-center gap-4 mb-6">
        <Mascot mood={done ? "proud" : "idle"} size={72} />
        <div>
          <p className="text-sm text-[var(--muted)]">{chapterName(chId, lang)}</p>
          <h1 className="text-2xl font-extrabold">{name}</h1>
        </div>
      </header>

      {/* lesson summary */}
      {content && (
        <section className="card p-5 mb-5">
          <h2 className="font-bold mb-2 flex items-center gap-2">
            <BookIcon /> {t.lesson.summary}
          </h2>
          <p className="leading-relaxed text-[var(--foreground)]/90">
            {lang === "ar" ? content.summary_ar : content.summary_en}
          </p>
        </section>
      )}

      {/* test tip */}
      {content && (
        <section className="rounded-2xl border border-[var(--accent-yellow)]/40 bg-[var(--accent-yellow-soft)] p-5 mb-5">
          <h2 className="font-bold mb-2 flex items-center gap-2 text-[var(--accent-yellow)] dark:text-[var(--accent-yellow)]">
            <Lightbulb size={18} /> {t.lesson.testTip}
          </h2>
          <p className="leading-relaxed">{lang === "ar" ? content.tip_ar : content.tip_en}</p>
        </section>
      )}

      {/* gamified questions */}
      {questions.length > 0 && (
        <section className="mb-5">
          <h2 className="font-bold mb-3">{t.lesson.questions} ({questions.length})</h2>
          <div className="space-y-4">
            {questions.map((q) => (
              <QuestionCard key={q.id} question={q} compact />
            ))}
          </div>
        </section>
      )}

      {/* complete */}
      <button onClick={finish} className="btn-primary w-full text-lg" disabled={done}>
        {done ? (
          <>
            <CheckCircle2 size={20} /> {t.lesson.complete} ✓
          </>
        ) : (
          <>
            <Droplets size={20} /> {t.lesson.complete} — {t.lesson.waterEarned}
          </>
        )}
      </button>
      {done && (
        <Link href="/journey" className="btn-tonal w-full mt-3">
          {t.home.waterTigdr} →
        </Link>
      )}
    </main>
  );
}

function BookIcon() {
  return <span className="inline-block h-2 w-2 rounded-full bg-[var(--primary)]" />;
}
