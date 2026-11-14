"use client";

import { useState } from "react";
import { QUESTIONS, pickQuestions } from "@/lib/questions";
import { CHAPTERS } from "@/lib/curriculum";
import { useProgressCtx } from "@/components/ProgressProvider";
import { useI18n } from "@/lib/i18n";
import QuestionCard from "@/components/QuestionCard";
import Mascot from "@/components/Mascot";
import { Play, RotateCcw, Target } from "lucide-react";

const SESSION_SIZE = 10;

export default function PracticePage() {
  const { t, lang } = useI18n();
  const { recordAnswer } = useProgressCtx();
  const [chapter, setChapter] = useState<number | "all">("all");
  const [session, setSession] = useState<ReturnType<typeof pickQuestions> | null>(null);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);

  const start = () => {
    setSession(pickQuestions({ chapter: chapter === "all" ? undefined : chapter }, SESSION_SIZE, Date.now() % 100000));
    setIdx(0); setScore(0); setFinished(false); setAnsweredCount(0);
  };

  const answer = (selected: number, correct: boolean) => {
    recordAnswer(session![idx].id, correct);
    if (correct) setScore((s) => s + 1);
    setAnsweredCount((c) => c + 1);
  };

  const next = () => {
    if (idx + 1 >= session!.length) setFinished(true);
    else setIdx(idx + 1);
  };

  const reset = () => { setSession(null); setFinished(false); };

  const accuracy = session ? Math.round((score / Math.max(1, answeredCount)) * 100) : 0;

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6">
      <h1 className="text-2xl font-extrabold mb-1 flex items-center gap-2">
        <Target className="text-[var(--primary)]" /> {t.practice.title}
      </h1>
      <p className="text-[var(--muted)] mb-6">{QUESTIONS.length} {lang === "ar" ? "سؤال متاح" : "questions available"}</p>

      {!session && (
        <section className="card p-6">
          <p className="font-semibold mb-3">{lang === "ar" ? "اختر الباب" : "Choose chapter"}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={() => setChapter("all")} className={`chip cursor-pointer ${chapter === "all" ? "ring-2 ring-[var(--primary)]" : ""}`}>
              {lang === "ar" ? "الكل" : "All"}
            </button>
            {CHAPTERS.map((c) => (
              <button key={c.id} onClick={() => setChapter(c.id)} className={`chip cursor-pointer ${chapter === c.id ? "ring-2 ring-[var(--primary)]" : ""}`}>
                {lang === "ar" ? `باب ${c.id}` : `Ch ${c.id}`}
              </button>
            ))}
          </div>
          <button onClick={start} className="btn-primary w-full">
            <Play size={18} /> {t.practice.start} — {SESSION_SIZE} {lang === "ar" ? "أسئلة" : "questions"}
          </button>
        </section>
      )}

      {session && !finished && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <span className="chip">{t.practice.question} {idx + 1} {t.practice.of} {session.length}</span>
            <span className="chip">{score} ✓</span>
          </div>
          <QuestionCard key={session[idx].id} question={session[idx]} onAnswer={answer} />
          <button onClick={next} className="btn-primary w-full mt-4">
            {idx + 1 >= session.length ? t.practice.finish : t.practice.next ?? "Next"}
          </button>
        </section>
      )}

      {session && finished && (
        <section className="card p-8 text-center">
          <Mascot mood={accuracy >= 70 ? "proud" : "thinking"} size={90} className="mx-auto mb-3" />
          <h2 className="text-2xl font-extrabold mb-1">{t.practice.results}</h2>
          <p className="text-5xl font-black text-[var(--primary)] my-3">{score}/{session.length}</p>
          <p className="text-[var(--muted)] mb-5">{t.practice.accuracy}: {accuracy}%</p>
          <div className="flex gap-3 justify-center">
            <button onClick={reset} className="btn-tonal"><RotateCcw size={16} /> {t.practice.again}</button>
            <button onClick={start} className="btn-primary">{t.practice.start}</button>
          </div>
        </section>
      )}
    </main>
  );
}
