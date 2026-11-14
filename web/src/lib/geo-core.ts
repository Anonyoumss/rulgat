import type { GeoSceneSpec } from "./types";

/**
 * geo-core — deterministic geometric scene generator for the TIGDR garden
 * game and "what fraction is shaded" questions. Every scene carries a
 * ground-truth wateredRatio computed mathematically, never eyeballed.
 */

export interface GardenScene extends GeoSceneSpec {
  id: string;
  name_ar: string;
  name_en: string;
  lessonTopic: string;
  question: { ar: string; en: string };
}

const r2 = (n: number) => Math.round(n * 1000) / 1000;

/** Triangle split horizontally: top fraction f watered. Area ∝ width². */
export function triangleScene(id: string, topFraction: number): GardenScene {
  return {
    id,
    kind: "triangle",
    wateredRatio: r2(topFraction * topFraction),
    name_ar: "حديقة المثلث",
    name_en: "Triangle Garden",
    lessonTopic: "ch3.poly",
    question: {
      ar: "ما نسبة الجزء المسقي من مساحة الحديقة الكلية؟",
      en: "What fraction of the garden is watered?",
    },
  };
}

/** Square/rectangle grid: rows×cols cells, `watered` of them green. */
export function gridScene(
  id: string,
  rows: number,
  cols: number,
  wateredCells: number
): GardenScene {
  return {
    id,
    kind: "square",
    wateredRatio: r2(wateredCells / (rows * cols)),
    name_ar: "حديقة الشبكة",
    name_en: "Grid Garden",
    lessonTopic: "ch3.rect",
    question: {
      ar: "ما نسبة الجزء المسقي؟",
      en: "What fraction is watered?",
    },
    parts: Array.from({ length: rows * cols }, (_, i) => ({
      kind: "cell",
      watered: i < wateredCells,
    })),
    labels: [{ at: [0.5, 1.05], text: `${rows}×${cols}` }],
  };
}

/** Circle sector: angle fraction of the circle watered. */
export function sectorScene(id: string, angleDeg: number): GardenScene {
  return {
    id,
    kind: "circle-sector",
    wateredRatio: r2(angleDeg / 360),
    angleDeg,
    name_ar: "حديقة القطاع",
    name_en: "Sector Garden",
    lessonTopic: "ch3.circ",
    question: {
      ar: "ما نسبة الجزء المسقي من الدائرة؟",
      en: "What fraction of the circle is watered?",
    },
  };
}

/** Composite: rectangle + corner triangle removed (classic shaded-area). */
export function compositeScene(id: string, rectW: number, rectH: number, cutFraction: number): GardenScene {
  const rectArea = rectW * rectH;
  const triangleArea = (rectW * rectH * cutFraction) / 2;
  const watered = rectArea - triangleArea; // L-shape watered
  return {
    id,
    kind: "composite",
    wateredRatio: r2(watered / rectArea),
    name_ar: "حديقة الشكل المركب",
    name_en: "Composite Garden",
    lessonTopic: "ch3.shade",
    question: {
      ar: "ما نسبة الجزء المسقي من المستطيل؟",
      en: "What fraction of the rectangle is watered?",
    },
    labels: [{ at: [0.5, 1.05], text: `${rectW}×${rectH}` }],
  };
}

/** The canonical gardener/watering story scene (from the PM's example). */
export const GARDENER_SCENE: GardenScene = {
  id: "story-gardener",
  kind: "composite",
  wateredRatio: 0.75,
  name_ar: "حديقة المزارع",
  name_en: "The Gardener's Plot",
  lessonTopic: "ch3.shade",
  question: {
    ar: "سقى الرجل ثلاثة أرباع حديقته. ما الكسر الذي يمثل الجزء غير المسقي؟",
    en: "He watered 3/4 of the garden. What fraction is NOT watered?",
  },
};

/** Preset garden levels for the game (in order). */
export const GARDEN_LEVELS: GardenScene[] = [
  gridScene("lvl-grid-2x2", 2, 2, 3),
  triangleScene("lvl-tri-half", 0.5),
  sectorScene("lvl-sector-90", 90),
  compositeScene("lvl-comp-25", 4, 4, 0.5),
  gridScene("lvl-grid-3x3", 3, 3, 6),
  triangleScene("lvl-tri-707", Math.SQRT1_2),
  sectorScene("lvl-sector-120", 120),
  compositeScene("lvl-comp-33", 6, 3, 0.5),
];

export function formatRatio(r: number, lang: "ar" | "en"): string {
  // nice fraction if close to simple ratio
  const fracs: [number, string, string][] = [
    [0.25, "١/٤", "1/4"], [1 / 3, "١/٣", "1/3"], [0.5, "١/٢", "1/2"],
    [2 / 3, "٢/٣", "2/3"], [0.75, "٣/٤", "3/4"], [0.2, "١/٥", "1/5"],
    [0.4, "٢/٥", "2/5"], [0.6, "٣/٥", "3/5"], [0.8, "٤/٥", "4/5"],
    [1 / 6, "١/٦", "1/6"], [5 / 6, "٥/٦", "5/6"], [1 / 8, "١/٨", "1/8"],
    [3 / 8, "٣/٨", "3/8"], [5 / 8, "٥/٨", "5/8"], [7 / 8, "٧/٨", "7/8"],
    [0.125, "١/٨", "1/8"], [0.375, "٣/٨", "3/8"], [0.625, "٥/٨", "5/8"],
    [0.875, "٧/٨", "7/8"], [0.1, "١/١٠", "1/10"], [0.3, "٣/١٠", "3/10"],
    [0.7, "٧/١٠", "7/10"], [0.9, "٩/١٠", "9/10"],
  ];
  for (const [v, ar, en] of fracs) {
    if (Math.abs(r - v) < 0.001) return lang === "ar" ? ar : en;
  }
  const pct = Math.round(r * 100);
  return lang === "ar" ? `${pct}٪` : `${pct}%`;
}

export function dryRatio(scene: GardenScene): number {
  return r2(1 - scene.wateredRatio);
}
