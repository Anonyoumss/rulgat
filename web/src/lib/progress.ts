"use client";

import { useCallback, useEffect, useState } from "react";
import type { Progress } from "./types";

const KEY = "rulgat.progress.v1";

export const DEFAULT_PROGRESS: Progress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: "",
  water: 3,
  completedLessons: [],
  answeredQuestions: {},
  gardenPlots: [
    { id: "g1", name: "plot-rose", stage: 0, watered: false },
    { id: "g2", name: "plot-lily", stage: 0, watered: false },
    { id: "g3", name: "plot-ivy", stage: 0, watered: false },
  ],
  mockHistory: [],
  pomodoroSessions: 0,
};

function load(): Progress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROGRESS;
    }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(progress));
  }, [progress, ready]);

  const touchStreak = useCallback((p: Progress): Progress => {
    const today = new Date().toISOString().slice(0, 10);
    if (p.lastActiveDate === today) return p;
    const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const streak = p.lastActiveDate === yesterday ? p.streak + 1 : 1;
    return { ...p, streak, lastActiveDate: today };
  }, []);

  const addXp = useCallback(
    (n: number) => {
      setProgress((p) => {
        const base = touchStreak(p);
        const xp = base.xp + n;
        const level = Math.floor(xp / 200) + 1;
        return { ...base, xp, level, water: base.water + (n >= 20 ? 1 : 0) };
      });
    },
    [touchStreak]
  );

  const addWater = useCallback((n: number) => {
    setProgress((p) => ({ ...p, water: Math.max(0, p.water + n) }));
  }, []);

  const completeLesson = useCallback(
    (lessonId: string) => {
      setProgress((p) => {
        if (p.completedLessons.includes(lessonId)) return p;
        const base = touchStreak(p);
        return {
          ...base,
          xp: base.xp + 30,
          water: base.water + 2,
          completedLessons: [...base.completedLessons, lessonId],
          level: Math.floor((base.xp + 30) / 200) + 1,
        };
      });
    },
    [touchStreak]
  );

  const recordAnswer = useCallback(
    (qid: string, correct: boolean) => {
      setProgress((p) => {
        const base = touchStreak(p);
        const already = p.answeredQuestions[qid];
        const firstTry = !already || !already.correct;
        return {
          ...base,
          xp: base.xp + (correct ? (firstTry ? 10 : 3) : 2),
          level: Math.floor((base.xp + (correct ? (firstTry ? 10 : 3) : 2)) / 200) + 1,
          answeredQuestions: { ...p.answeredQuestions, [qid]: { correct, ts: Date.now() } },
        };
      });
    },
    [touchStreak]
  );

  const waterGarden = useCallback(() => {
    setProgress((p) => {
      if (p.water <= 0) return p;
      const idx = p.gardenPlots.findIndex((g) => !g.watered);
      if (idx === -1) return p;
      const plots = [...p.gardenPlots];
      plots[idx] = { ...plots[idx], watered: true, stage: plots[idx].stage + 1 };
      return { ...p, water: p.water - 1, gardenPlots: plots, xp: p.xp + 15 };
    });
  }, []);

  const recordMock = useCallback((score: number, total: number) => {
    setProgress((p) => {
      const base = touchStreak(p);
      return {
        ...base,
        xp: base.xp + Math.round((score / total) * 60),
        level: Math.floor((base.xp + Math.round((score / total) * 60)) / 200) + 1,
        mockHistory: [
          ...p.mockHistory,
          { date: new Date().toISOString(), score, total, pct: Math.round((score / total) * 100) },
        ].slice(-20),
      };
    });
  }, [touchStreak]);

  const recordPomodoro = useCallback(() => {
    setProgress((p) => ({ ...p, pomodoroSessions: p.pomodoroSessions + 1, xp: p.xp + 15, water: p.water + 1 }));
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(KEY);
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return { progress, ready, addXp, addWater, completeLesson, recordAnswer, waterGarden, recordMock, recordPomodoro, resetAll };
}
