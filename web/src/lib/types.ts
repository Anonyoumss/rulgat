export type Lang = "ar" | "en";

export interface Question {
  id: string;
  lang: "ar" | "en";
  section: "quantitative" | "verbal";
  chapter: number;
  topic: string;
  topic_id: string;
  stem: string;
  stem_i18n?: Record<string, string>;
  options: string[];
  answer_index: number;
  answer_label: string;
  explanation: string;
  explanation_i18n?: Record<string, string>;
  figure?: {
    type: "svg" | "image" | "geo-scene";
    svg?: string;
    url?: string;
    scene?: GeoSceneSpec;
  };
  difficulty: 1 | 2 | 3;
  source: string;
  year: number;
  video_url: string;
  tags: string[];
}

export interface GeoSceneSpec {
  kind: "triangle" | "square" | "rect" | "circle-sector" | "composite";
  /** fraction of total area that is "watered" (shaded) */
  wateredRatio: number; // 0..1
  /** labels for dimensions */
  labels?: { at: [number, number]; text: string }[];
  /** for circle-sector: angle in degrees */
  angleDeg?: number;
  /** composite: list of sub-shapes each with own watered flag */
  parts?: { kind: string; watered: boolean; ratio?: number }[];
}

export interface Progress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  water: number; // drops available to water garden
  completedLessons: string[];
  answeredQuestions: Record<string, { correct: boolean; ts: number }>;
  gardenPlots: { id: string; name: string; stage: number; watered: boolean }[];
  mockHistory: { date: string; score: number; total: number; pct: number }[];
  pomodoroSessions: number;
}

export interface Story {
  id: string;
  topic_id: string;
  title_ar: string;
  title_en: string;
  cards: {
    kind: "text" | "question" | "reveal";
    body_ar: string;
    body_en: string;
    question_id?: string;
  }[];
}
