"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { STORIES } from "@/data/stories";
import { byId } from "@/lib/questions";
import { useI18n } from "@/lib/i18n";
import { useProgressCtx } from "@/components/ProgressProvider";
import QuestionCard from "@/components/QuestionCard";
import { ChevronUp, X } from "lucide-react";
import Link from "next/link";

export default function StoriesPage() {
  const { lang, t } = useI18n();
  const { addXp } = useProgressCtx();
  const [storyIdx, setStoryIdx] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const [, setAnswers] = useState<Record<string, boolean>>({});

  const story = STORIES[storyIdx];
  const card = story.cards[cardIdx];
  const question = card.question_id ? byId(card.question_id) : null;

  const next = useCallback(() => {
    if (cardIdx + 1 < story.cards.length) setCardIdx((i) => i + 1);
    else if (storyIdx + 1 < STORIES.length) { setStoryIdx((i) => i + 1); setCardIdx(0); }
    else { setStoryIdx(0); setCardIdx(0); }
  }, [cardIdx, storyIdx, story.cards.length]);

  const prev = () => {
    if (cardIdx > 0) setCardIdx((i) => i - 1);
    else if (storyIdx > 0) { setStoryIdx((i) => i - 1); setCardIdx(STORIES[storyIdx - 1].cards.length - 1); }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -60 || info.velocity.y < -400) next();
    else if (info.offset.y > 60) prev();
  };

  const handleAnswer = (qid: string, correct: boolean) => {
    setAnswers((a) => ({ ...a, [qid]: correct }));
    addXp(correct ? 10 : 2);
  };

  if (!story) return null;

  return (
    <main className="relative h-[calc(100dvh-140px)] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${storyIdx}-${cardIdx}`}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-30%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={onDragEnd}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center cursor-grab active:cursor-grabbing"
        >
          {/* progress bars */}
          <div className="absolute top-4 inset-x-6 flex gap-1">
            {story.cards.map((_, i) => (
              <div key={i} className="h-1 flex-1 rounded-full bg-[var(--border)] overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] transition-all duration-300"
                  style={{ width: i < cardIdx ? "100%" : i === cardIdx ? "50%" : "0%" }}
                />
              </div>
            ))}
          </div>

          <p className="text-xs text-[var(--muted)] mb-6">
            {storyIdx + 1}/{STORIES.length} · {lang === "ar" ? story.title_ar : story.title_en}
          </p>

          {card.kind === "question" && question ? (
            <div className="w-full max-w-md">
              <QuestionCard question={question} onAnswer={(s, c) => handleAnswer(question.id, c)} />
            </div>
          ) : (
            <div className="max-w-md">
              <p className="text-2xl font-bold leading-relaxed mb-8">
                {lang === "ar" ? card.body_ar : card.body_en}
              </p>
              {card.kind === "reveal" && (
                <div className="rounded-2xl bg-[var(--accent-yellow-soft)] border border-[var(--accent-yellow)]/40 p-4 text-start">
                  <p className="text-sm font-semibold text-[var(--accent-yellow)] mb-1">💡 {lang === "ar" ? "الخلاصة" : "Key takeaway"}</p>
                  <p className="text-sm leading-relaxed">{lang === "ar" ? card.body_ar : card.body_en}</p>
                </div>
              )}
            </div>
          )}

          <div className="absolute bottom-8 flex flex-col items-center gap-2 text-[var(--muted)]">
            <ChevronUp size={20} className="animate-bounce" />
            <span className="text-xs">{t.stories.hint}</span>
            <button onClick={next} className="btn-ghost text-xs mt-2"><X size={12} className="hidden" />{lang === "ar" ? "التالي" : "Next"}</button>
          </div>
        </motion.div>
      </AnimatePresence>

      <Link href="/tigdr" className="absolute top-4 end-4 z-10 chip">
        {lang === "ar" ? "العب الحديقة" : "Play garden"} →
      </Link>
    </main>
  );
}
