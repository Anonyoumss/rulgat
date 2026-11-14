"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import type { Question } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({
  question,
  onAnswer,
  review = false,
  compact = false,
}: {
  question: Question;
  onAnswer?: (selected: number, correct: boolean) => void;
  review?: boolean; // show correct/wrong after answering
  compact?: boolean;
}) {
  const { lang } = useI18n();
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(review);

  const pick = (i: number) => {
    if (revealed && !review) return;
    setSelected(i);
    if (!review) {
      setRevealed(true);
      onAnswer?.(i, i === question.answer_index);
    }
  };

  const stem = question.stem_i18n?.[lang] || question.stem;
  const expl = question.explanation_i18n?.[lang] || question.explanation;

  return (
    <div className={cn("card p-5", compact && "p-4")}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="chip text-xs">{question.topic}</span>
        <span className="chip text-xs">{lang === "ar" ? "ص" : "Q"} · {"★".repeat(question.difficulty)}</span>
      </div>
      <p className="text-lg leading-relaxed font-medium mb-5 whitespace-pre-wrap">{stem}</p>

      <div className="flex flex-col gap-2.5">
        {question.options.map((opt, i) => {
          const isSel = selected === i;
          const isCorrect = i === question.answer_index;
          const showState = revealed;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              className={cn(
                "option-row text-base",
                showState && isCorrect && "correct",
                showState && isSel && !isCorrect && "wrong",
                showState && !isSel && !isCorrect && "opacity-60"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
                  showState && isCorrect
                    ? "bg-[var(--success)] text-white border-[var(--success)]"
                    : showState && isSel && !isCorrect
                      ? "bg-[var(--danger)] text-white border-[var(--danger)]"
                      : "border-[var(--border)] text-[var(--muted)]"
                )}
              >
                {LETTERS[i]}
              </span>
              <span className="flex-1">{opt}</span>
              {showState && isCorrect && <CheckCircle2 className="text-[var(--success)]" size={20} />}
              {showState && isSel && !isCorrect && <XCircle className="text-[var(--danger)]" size={20} />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {revealed && expl && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-2xl bg-[var(--primary-soft)] dark:bg-[var(--primary-soft)]/10 border border-[var(--primary)]/20 p-4 flex gap-3"
          >
            <Lightbulb className="shrink-0 text-[var(--primary)] mt-0.5" size={18} />
            <p className="text-sm leading-relaxed">{expl}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
