import type { Lang } from "./types";

export interface Topic {
  id: string;
  ar: string;
  en: string;
}
export interface Chapter {
  id: number;
  ar: string;
  en: string;
  topics: Topic[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 0, ar: "الباب زيرو — التأسيس", en: "Chapter Zero — Foundation",
    topics: [
      { id: "ch0.intro", ar: "مقدمة ومنهجية الحل السريع", en: "Intro & quick-solve" },
      { id: "ch0.bigint", ar: "الأعداد الكبيرة", en: "Large-number arithmetic" },
      { id: "ch0.stats", ar: "الإحصاء", en: "Statistics" },
      { id: "ch0.prob", ar: "الاحتمالات", en: "Probability" },
      { id: "ch0.div", ar: "قواعد القسمة والموافقات", en: "Divisibility rules" },
    ],
  },
  {
    id: 1, ar: "الباب الأول — الأساسيات", en: "Chapter 1 — Basics",
    topics: [
      { id: "ch1.dec", ar: "الأعداد العشرية", en: "Decimals" },
      { id: "ch1.frac", ar: "الكسور", en: "Fractions" },
      { id: "ch1.root", ar: "الجذور", en: "Roots" },
      { id: "ch1.exp", ar: "الأسس", en: "Exponents" },
      { id: "ch1.sdt", ar: "السرعة والمسافة والزمن", en: "Speed/distance/time" },
      { id: "ch1.rel", ar: "الحركة النسبية", en: "Relative motion" },
    ],
  },
  {
    id: 2, ar: "الباب الثاني — النسب والنسبة", en: "Chapter 2 — Ratios & Percent",
    topics: [
      { id: "ch2.ratio", ar: "النسب والتناسب", en: "Ratios & proportions" },
      { id: "ch2.pct", ar: "النسب المئوية", en: "Percentages" },
      { id: "ch2.pfl", ar: "الربح والخسارة", en: "Profit & loss" },
      { id: "ch2.div", ar: "القسمة التناسبية", en: "Proportional division" },
      { id: "ch2.mean", ar: "الوسط الحسابي", en: "Arithmetic mean" },
    ],
  },
  {
    id: 3, ar: "الباب الثالث — الهندسة", en: "Chapter 3 — Geometry",
    topics: [
      { id: "ch3.ang", ar: "الزوايا", en: "Angles" },
      { id: "ch3.poly", ar: "المضلعات", en: "Polygons" },
      { id: "ch3.pyth", ar: "مثلثات فيثاغورس", en: "Pythagorean triangles" },
      { id: "ch3.rect", ar: "المستطيلات والمربعات", en: "Rectangles & squares" },
      { id: "ch3.circ", ar: "الدوائر والقطاعات", en: "Circles & sectors" },
      { id: "ch3.shade", ar: "المساحات المظللة", en: "Shaded areas" },
      { id: "ch3.solid", ar: "المجسمات", en: "3D solids" },
      { id: "ch3.coord", ar: "الهندسة الإحداثية", en: "Coordinate geometry" },
    ],
  },
];

/** Concise lesson summaries + test-day tips per topic (generic math,
 *  pending full PDF-derived content — logged in HANDOFF). */
export const LESSON_CONTENT: Record<string, { summary_ar: string; summary_en: string; tip_ar: string; tip_en: string }> = {
  "ch2.pct": {
    summary_ar: "النسبة المئوية طريقة لكتابة كسر من ١٠٠. التحويل: ٪١٥ = ٠٫١٥ = ١٥/١٠٠. للتغير: الجديد = الأصل × (١ ± النسبة).",
    summary_en: "A percentage is a fraction of 100. Convert: 15% = 0.15 = 15/100. Change: New = Old × (1 ± rate).",
    tip_ar: "في الاختبار: بدل ما تحسب النسبة مباشرة، حوّلها لكسر أو عدد عشري — أسرع وأقل أخطاء.",
    tip_en: "On test day: convert percentages to fractions/decimals first — faster, fewer errors.",
  },
  "ch3.shade": {
    summary_ar: "المساحة المظللة = مساحة الشكل الكلي − المساحات غير المظللة. قسم الشكل المركب إلى مستطيلات ومثلثات معروفة، أو استخدم قاعدة: المثلث = ½ × القاعدة × الارتفاع.",
    summary_en: "Shaded area = total area − unshaded parts. Split composites into known rectangles/triangles, or use triangle = ½ × base × height.",
    tip_ar: "في الاختبار: لا تحاول حساب المساحة المظللة مباشرة — اطرحها من الكل. هذا يختصر نصف الوقت.",
    tip_en: "In the exam: never compute shaded area directly — subtract it from the whole. Saves half the time.",
  },
  "ch1.frac": {
    summary_ar: "للمقارنة بين كسور: وحّد المقامات أو حوّل لكسور عشرية. لجمع/طرح كسور: المقام المشترك أولاً.",
    summary_en: "To compare fractions: unify denominators or convert to decimals. To add/subtract: common denominator first.",
    tip_ar: "في الاختبار: إذا كانت الخيارات أعدادًا متقاربة، حوّل الكسر العشري فورًا — المقارنة البصرية تكفي.",
    tip_en: "On test day: if options are close numbers, convert to decimal immediately — visual comparison suffices.",
  },
  "ch3.circ": {
    summary_ar: "مساحة الدائرة = πنق²، ومحيطها = ٢πنق. القطاع الدائري نسبته من الدائرة = زاويته/٣٦٠.slice",
    summary_en: "Circle area = πr², circumference = 2πr. A sector's fraction of the circle = its angle/360.",
    tip_ar: "في الاختبار: للقطاعات، احسب النسبة أولًا (زاوية/٣٦٠) ثم اضربها في مساحة الدائرة — لا تعِد اشتقاقها كل مرة.",
    tip_en: "In the exam: for sectors, compute the fraction first (angle/360), then multiply by circle area.",
  },
  "ch0.div": {
    summary_ar: "قواعد القسمة: على ٢ (زوجي)، ٣ (مجموع أرقام يقبل ٣)، ٤ (آخر رقمين)، ٥ (ينتهي بـ ٠/٥)، ٩ (مجموع أرقام)، ١١ (تناوب الجموع).",
    summary_en: "Divisibility: 2 (even), 3 (digit sum), 4 (last two digits), 5 (ends 0/5), 9 (digit sum), 11 (alternating sum).",
    tip_ar: "في الاختبار: almost كل سؤال يقبلية له «اختصار» — جرّب قواعد القسمة قبل أي حساب طويل.",
    tip_en: "On test day: almost every divisibility question has a shortcut — try the rules before long calculation.",
  },
};

export function topicName(id: string, lang: Lang): string {
  for (const ch of CHAPTERS) {
    const t = ch.topics.find((x) => x.id === id);
    if (t) return lang === "ar" ? t.ar : t.en;
  }
  return id;
}

export function chapterName(id: number, lang: Lang): string {
  const ch = CHAPTERS.find((c) => c.id === id);
  return ch ? (lang === "ar" ? ch.ar : ch.en) : `Ch ${id}`;
}
