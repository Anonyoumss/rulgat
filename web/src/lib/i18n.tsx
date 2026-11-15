"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Lang } from "./types";

const STR = {
  ar: {
    appName: "قانون قدراتك",
    tagline: "أكبر عمل في تاريخ القدرات",
    nav: { home: "الرئيسية", stories: "القصص", curriculum: "المنهج", tigdr: "تِجْر", practice: "تدريب", mock: "محاكاة", profile: "ملفي", more: "المزيد" },
    home: {
      greeting: "أهلاً بك في قانون قدراتك",
      dailyPlan: "خطة اليوم",
      continueLearning: "تابع من حيث توقفت",
      questionsCount: "سؤال في البنك",
      startLesson: "ابدأ الدرس",
      waterTigdr: "اسقِ تِجْر",
      xp: "نقطة خبرة",
      streak: "أيام متتالية",
      level: "المستوى",
    },
    curriculum: {
      title: "منهج المعاصر ١١",
      ch0: "الباب زيرو — التأسيس",
      ch1: "الباب الأول — الأساسيات",
      ch2: "الباب الثاني — النسب والنسبة",
      ch3: "الباب الثالث — الهندسة",
      lessons: "درس",
      questions: "سؤال",
    },
    lesson: {
      summary: "ملخص الدرس",
      questions: "أسئلة الدرس",
      testTip: "طبّقها في الاختبار",
      complete: "إكمال الدرس",
      correct: "أحسنت! إجابة صحيحة",
      wrong: "ليست الإجابة الصحيحة",
      next: "التالي",
      waterEarned: "حصلت على قطرة ماء",
    },
    tigdr: {
      title: "حديقة تِجْر",
      water: "ماء",
      waterNow: "اسقِ الآن",
      howMuchWatered: "كم من الحديقة سُقي؟",
      howMuchDry: "كم لم يُسقى؟",
      guessIt: "احسب النسبة",
      correct: "ممتاز! الحديقة ازدهرت",
      wrong: "النسبة غير صحيحة — حاول مجدداً",
      nextGarden: "حديقة جديدة",
      xpEarned: "+{n} XP",
    },
    stories: { title: "قصص capability", hint: "اسحب للأعلى" },
    practice: {
      title: "وضع التدريب",
      start: "ابدأ الجلسة",
      question: "سؤال",
      of: "من",
      submit: "تحقق",
      finish: "إنهاء",
      next: "التالي",
      results: "النتيجة",
      accuracy: "الدقة",
      again: "مرة أخرى",
    },
    mock: {
      title: "الاختبار المحاكي",
      setup: "إعداد الاختبار",
      duration: "المدة",
      questions: "عدد الأسئلة",
      startExam: "بدء الاختبار",
      timer: "الوقت المتبقي",
      flag: "تظليل",
      palette: "لوحة الأسئلة",
      prev: "السابق",
      next: "التالي",
      finish: "إنهاء الاختبار",
      confirmFinish: "هل أنت متأكد من إنهاء الاختبار؟",
      unanswered: "بدون إجابة",
      flagged: "مُظلَّل",
      answered: "تمت الإجابة",
      results: "نتائج الاختبار",
      score: "النتيجة",
      review: "مراجعة الأسئلة",
      fontSize: "حجم الخط",
    },
    pomodoro: {
      title: "مؤقت بومودورو",
      focus: "تركيز",
      break: "استراحة",
      start: "ابدأ",
      pause: "إيقاف",
      reset: "إعادة",
      sessions: "جلسات اليوم",
    },
    planner: {
      title: "بوصلة قدرات",
      today: "خطة اليوم",
      testDate: "موعد الاختبار",
      dailyMinutes: "دقائق يومياً",
      generate: "ولّد الخطة",
      mockTomorrow: "أدِّ الاختبار المحاكي غداً",
      reviewTopic: "راجع {topic} لمدة {n} دقيقة",
      restDay: "يوم راحة — راجع الأخطاء فقط",
    },
    profile: {
      title: "ملف الطالب",
      xp: "النقاط",
      level: "المستوى",
      streak: "السلسلة",
      mastery: "إتقان كل باب",
      history: "سجل المحاكاة",
    },
    settings: {
      title: "الإعدادات",
      language: "اللغة",
      theme: "المظهر",
      light: "فاتح",
      dark: "داكن",
      system: "النظام",
      about: "عن قانون قدراتك",
    },
    common: {
      loading: "جارٍ التحميل…",
      error: "حدث خطأ",
      back: "رجوع",
      save: "حفظ",
      cancel: "إلغاء",
      close: "إغلاق",
      arabic: "العربية",
      english: "English",
      demoMode: "وضع تجريبي — without backend",
    },
  },
  en: {
    appName: "Qanoon Qudratak | TIGDR",
    tagline: "The biggest GAT prep ever built",
    nav: { home: "Home", stories: "Stories", curriculum: "Curriculum", tigdr: "TIGDR", practice: "Practice", mock: "Mock", profile: "Profile", more: "More" },
    home: {
      greeting: "Welcome to Qudratak",
      dailyPlan: "Today's plan",
      continueLearning: "Continue where you left off",
      questionsCount: "questions in bank",
      startLesson: "Start lesson",
      waterTigdr: "Water TIGDR",
      xp: "XP",
      streak: "day streak",
      level: "Level",
    },
    curriculum: {
      title: "Al-Moasser 11 Curriculum",
      ch0: "Chapter Zero — Foundation",
      ch1: "Chapter 1 — Basics",
      ch2: "Chapter 2 — Ratios & Percent",
      ch3: "Chapter 3 — Geometry",
      lessons: "lessons",
      questions: "questions",
    },
    lesson: {
      summary: "Lesson summary",
      questions: "Lesson questions",
      testTip: "Apply it in the test",
      complete: "Complete lesson",
      correct: "Correct!",
      wrong: "Not quite — here's why",
      next: "Next",
      waterEarned: "+1 water drop",
    },
    tigdr: {
      title: "TIGDR's Garden",
      water: "water",
      waterNow: "Water now",
      howMuchWatered: "How much of the garden is watered?",
      howMuchDry: "How much is not watered?",
      guessIt: "Compute the ratio",
      correct: "Great! The garden bloomed",
      wrong: "Wrong ratio — try again",
      nextGarden: "New garden",
      xpEarned: "+{n} XP",
    },
    stories: { title: "Capability stories", hint: "Swipe up" },
    practice: {
      title: "Practice mode",
      start: "Start session",
      question: "Question",
      of: "of",
      submit: "Check",
      finish: "Finish",
      next: "Next",
      results: "Results",
      accuracy: "Accuracy",
      again: "Again",
    },
    mock: {
      title: "Mock exam",
      setup: "Exam setup",
      duration: "Duration",
      questions: "Questions",
      startExam: "Start exam",
      timer: "Time left",
      flag: "Flag",
      palette: "Question palette",
      prev: "Previous",
      next: "Next",
      finish: "Finish exam",
      confirmFinish: "Finish the exam?",
      unanswered: "Unanswered",
      flagged: "Flagged",
      answered: "Answered",
      results: "Exam results",
      score: "Score",
      review: "Review questions",
      fontSize: "Font size",
    },
    pomodoro: {
      title: "Pomodoro timer",
      focus: "Focus",
      break: "Break",
      start: "Start",
      pause: "Pause",
      reset: "Reset",
      sessions: "Today's sessions",
    },
    planner: {
      title: "Qudrat Compass",
      today: "Today's plan",
      testDate: "Test date",
      dailyMinutes: "Minutes / day",
      generate: "Generate plan",
      mockTomorrow: "Take a mock test tomorrow",
      reviewTopic: "Review {topic} for {n} min",
      restDay: "Rest day — review mistakes only",
    },
    profile: {
      title: "Student profile",
      xp: "Points",
      level: "Level",
      streak: "Streak",
      mastery: "Mastery per chapter",
      history: "Mock history",
    },
    settings: {
      title: "Settings",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      about: "About Qudratak",
    },
    common: {
      loading: "Loading…",
      error: "Something went wrong",
      back: "Back",
      save: "Save",
      cancel: "Cancel",
      close: "Close",
      arabic: "العربية",
      english: "English",
      demoMode: "Demo mode — no backend",
    },
  },
} as const;

type Dict = typeof STR.ar;

const I18nCtx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({
  lang: "ar",
  t: STR.ar,
  setLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");
  useEffect(() => {
    const saved = (localStorage.getItem("rulgat.lang") as Lang) || "ar";
    setLangState(saved);
    document.documentElement.lang = saved;
    document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("rulgat.lang", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };
  const t = lang === "ar" ? STR.ar : (STR.en as unknown as Dict);
  return <I18nCtx.Provider value={{ lang, t, setLang }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  return useContext(I18nCtx);
}
