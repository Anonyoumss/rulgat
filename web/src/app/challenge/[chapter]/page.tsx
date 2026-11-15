"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { pickQuestions } from "@/lib/questions";
import { CHAPTERS, topicName } from "@/lib/curriculum";
import { useProgressCtx } from "@/components/ProgressProvider";
import { useI18n } from "@/lib/i18n";
import QuestionCard from "@/components/QuestionCard";
import Mascot from "@/components/Mascot";
import { sounds } from "@/lib/sounds";
import { ArrowRight, Plane, Stamp, Timer } from "lucide-react";

const CHALLENGE_SIZE = 10;
const PASS_SCORE = 7;

export default function ChallengePage({ params }: { params: { chapter: string } }) {
  const chapter = Number(params.chapter);
  const { t, lang } = useI18n();
  const { recordChallenge } = useProgressCtx();

  const questions = useMemo(
    () => pickQuestions({ chapter }, CHALLENGE_SIZE, Date.now() % 100000),
    [chapter]
  );
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"quiz" | "done">("quiz");
  const resultsRef = useRef<{ qid: string; ok: boolean; topic: string }[]>([]);
  const [doneResults, setDoneResults] = useState<typeof resultsRef.current>([]);

  const ch = CHAPTERS.find((c) => c.id === chapter);
  const q = questions[idx];

  const answer = (_sel: number, correct: boolean) => {
    if (correct) sounds.correct(); else sounds.wrong();
    resultsRef.current = [...resultsRef.current, { qid: q.id, ok: correct, topic: q.topic_id }];
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      const res = resultsRef.current;
      setDoneResults(res);
      setPhase("done");
      const sc = res.filter((r) => r.ok).length;
      const weak = Array.from(new Set(res.filter((r) => !r.ok).map((r) => r.topic)));
      recordChallenge(chapter, sc, questions.length, weak);
      if (sc >= PASS_SCORE) sounds.stamp(); else sounds.delay();
    } else {
      setIdx(idx + 1);
    }
  };

  if (!ch || !q) return null;

  if (phase === "done") {
    const sc = doneResults.filter((r) => r.ok).length;
    const ok = sc >= PASS_SCORE;
    return (
      <main className="mx-auto max-w-2xl px-4 pt-10 text-center">
        <Mascot mood={ok ? "proud" : "thinking"} size={100} className="mx-auto mb-4" />
        <h1 className="text-2xl font-extrabold mb-1">
          {ok ? t.journey.stampEarned : t.journey.delayed}
        </h1>
        <p className="text-5xl font-black my-3 text-[var(--primary)]">{sc}/{questions.length}</p>
        {ok ? (
          <>
            <Stamp size={48} className="mx-auto text-[var(--success)] mb-3" />
            <p className="text-[var(--muted)] mb-6">{t.journey.nextGate}: {lang === "ar" ? CHAPTERS[chapter + 1]?.ar : CHAPTERS[chapter + 1]?.en}</p>
            <Link href="/journey" className="btn-primary"><Plane size={18} /> {t.journey.departure}</Link>
          </>
        ) : (
          <>
            <div className="card p-5 text-start mb-5">
              <h2 className="font-bold mb-2 text-[var(--warning)]">{t.journey.reviewReport}</h2>
              <p className="text-sm mb-3">{t.journey.whichLaw}:</p>
              <ul className="space-y-1.5">
                {Array.from(new Set(doneResults.filter((r) => !r.ok).map((r) => r.topic))).map((tp) => (
                  <li key={tp} className="text-sm flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--warning)]" />
                    {topicName(tp, lang)}
                    <Link href={`/laws/${chapter}`} className="text-xs text-[var(--primary)] underline">{t.laws.jumpToPdf}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => { resultsRef.current = []; setDoneResults([]); setIdx(0); setPhase("quiz"); }} className="btn-tonal me-2">{lang === "ar" ? "إعادة التحدي" : "Retry"}</button>
            <Link href={`/laws/${chapter}`} className="btn-primary"><ArrowRight size={16} className="rtl:rotate-180" /> {t.laws.title}</Link>
          </>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pt-6">
      <Link href="/journey" className="btn-ghost text-sm mb-4"><ArrowRight size={16} className="rtl:rotate-180" /> {t.common.back}</Link>

      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-extrabold">{lang === "ar" ? ch.ar : ch.en}</h1>
          <p className="text-sm text-[var(--muted)]">{t.journey.challenge} · {t.journey.gate} {chapter + 1}</p>
        </div>
        <div className="flex gap-2">
          <span className="chip"><Timer size={14} /> {idx + 1}/{questions.length}</span>
        </div>
      </header>

      <QuestionCard key={q.id} question={q} onAnswer={answer} />

      <button onClick={next} className="btn-primary w-full mt-4">
        {idx + 1 >= questions.length ? (lang === "ar" ? "إنهاء الرحلة" : "End flight") : t.practice.next}
      </button>
    </main>
  );
}
