"use client";

import { useCallback, useEffect, useState } from "react";
import type { Progress, LawMark } from "./types";
import { pushProgress } from "./sync";

const KEY = "rulgat.progress.v1";

export const DEFAULT_PROGRESS: Progress = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: "",
  passportName: "",
  stamps: [],
  goldStamp: false,
  boardingPassId: `RG-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  chapterBest: {},
  lawMarks: {},
  completedLessons: [],
  answeredQuestions: {},
  delayedReports: [],
  mockHistory: [],
  pomodoroSessions: 0,
  coins: 0,
  districts: ["old-town"],
  vehicle: "scooter",
  upgrades: { engine: 0, armor: 0, nitro: 0 },
};

function load(): Progress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const p = { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
    // one-time migration: old garden/water fields dropped
    return p;
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
    if (ready) {
      localStorage.setItem(KEY, JSON.stringify(progress));
      void pushProgress(progress); // best-effort PocketBase sync (no-op without backend)
    }
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
        return { ...base, xp, level: Math.floor(xp / 200) + 1 };
      });
    },
    [touchStreak]
  );

  const setPassportName = useCallback((name: string) => {
    setProgress((p) => ({ ...p, passportName: name }));
  }, []);

  const completeLesson = useCallback(
    (lessonId: string) => {
      setProgress((p) => {
        if (p.completedLessons.includes(lessonId)) return p;
        const base = touchStreak(p);
        const xp = base.xp + 30;
        return {
          ...base,
          xp,
          level: Math.floor(xp / 200) + 1,
          completedLessons: [...base.completedLessons, lessonId],
        };
      });
    },
    [touchStreak]
  );

  const recordAnswer = useCallback(
    (qid: string, correct: boolean) => {
      setProgress((p) => {
        const base = touchStreak(p);
        const xpGain = correct ? 10 : 2;
        const xp = base.xp + xpGain;
        return {
          ...base,
          xp,
          level: Math.floor(xp / 200) + 1,
          coins: base.coins + (correct ? 10 : 2),
          answeredQuestions: { ...p.answeredQuestions, [qid]: { correct, ts: Date.now() } },
        };
      });
    },
    [touchStreak]
  );

  /** Chapter challenge result: ≥7/10 stamps the chapter & unlocks next.
   *  <7/10 records a delayed-flight report. */
  const recordChallenge = useCallback(
    (chapter: number, score: number, total: number, weakTopics: string[]) => {
      setProgress((p) => {
        const base = touchStreak(p);
        const passed = score / total >= 0.7;
        const xp = base.xp + (passed ? 60 : 15);
        return {
          ...base,
          xp,
          level: Math.floor(xp / 200) + 1,
          coins: base.coins + (passed ? 150 : 30),
          stamps: passed && !base.stamps.includes(chapter) ? [...base.stamps, chapter].sort() : base.stamps,
          chapterBest: { ...base.chapterBest, [chapter]: Math.max(base.chapterBest[chapter] ?? 0, score) },
          delayedReports: passed
            ? base.delayedReports
            : [...base.delayedReports, { chapter, score, ts: Date.now(), topics: weakTopics }].slice(-10),
        };
      });
    },
    [touchStreak]
  );

  /** Final exam: 20 questions all chapters → gold stamp. */
  const recordFinalExam = useCallback(
    (score: number, total: number) => {
      setProgress((p) => {
        const base = touchStreak(p);
        const passed = score / total >= 0.7;
        const xp = base.xp + (passed ? 200 : 40);
        return {
          ...base,
          xp,
          level: Math.floor(xp / 200) + 1,
          goldStamp: base.goldStamp || passed,
          stamps: passed ? [0, 1, 2, 3] : base.stamps,
        };
      });
    },
    [touchStreak]
  );

  const setLawMark = useCallback((topicId: string, mark: LawMark | null) => {
    setProgress((p) => {
      const lawMarks = { ...p.lawMarks };
      if (mark === null) delete lawMarks[topicId];
      else lawMarks[topicId] = mark;
      return { ...p, lawMarks };
    });
  }, []);

  const recordMock = useCallback((score: number, total: number) => {
    setProgress((p) => {
      const base = touchStreak(p);
      const xp = base.xp + Math.round((score / total) * 60);
      return {
        ...base,
        xp,
        level: Math.floor(xp / 200) + 1,
        mockHistory: [
          ...p.mockHistory,
          { date: new Date().toISOString(), score, total, pct: Math.round((score / total) * 100) },
        ].slice(-20),
      };
    });
  }, [touchStreak]);

  const recordPomodoro = useCallback(() => {
    setProgress((p) => ({ ...p, pomodoroSessions: p.pomodoroSessions + 1, xp: p.xp + 15, coins: p.coins + 5 }));
  }, []);

  /** Buy a vehicle if affordable & unlocked tier order. Returns true on success. */
  const buyVehicle = useCallback((id: string, price: number) => {
    let ok = false;
    setProgress((p) => {
      const order = ["scooter", "sedan", "sportscar", "jetcar"];
      const cur = order.indexOf(p.vehicle);
      const next = order.indexOf(id);
      if (next <= cur || p.coins < price) return p;
      ok = true;
      return { ...p, coins: p.coins - price, vehicle: id };
    });
    return ok;
  }, []);

  /** Buy one upgrade level (engine/armor/nitro), max 5. */
  const buyUpgrade = useCallback((kind: "engine" | "armor" | "nitro", price: number) => {
    let ok = false;
    setProgress((p) => {
      const lvl = p.upgrades[kind];
      if (lvl >= 5 || p.coins < price) return p;
      ok = true;
      return { ...p, coins: p.coins - price, upgrades: { ...p.upgrades, [kind]: lvl + 1 } };
    });
    return ok;
  }, []);

  /** Unlock a city district (costs coins, requires previous district). */
  const unlockDistrict = useCallback((id: string, price: number, requires: string) => {
    let ok = false;
    setProgress((p) => {
      if (p.districts.includes(id) || !p.districts.includes(requires) || p.coins < price) return p;
      ok = true;
      return { ...p, coins: p.coins - price, districts: [...p.districts, id] };
    });
    return ok;
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(KEY);
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    progress, ready, addXp, setPassportName, completeLesson, recordAnswer,
    recordChallenge, recordFinalExam, setLawMark, recordMock, recordPomodoro,
    buyVehicle, buyUpgrade, unlockDistrict, resetAll,
  };
}
