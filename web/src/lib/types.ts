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
  /** image-based question (e.g. tiqdr bank pages) — rendered instead of stem/options text */
  stem_image?: string;
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

export type LawMark = "green" | "yellow" | "red"; // فاهم / محتاج مراجعة / مش فاهم

export interface Progress {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  /** GAT Travel Passport (جواز سفر القدرات) */
  passportName: string;
  stamps: number[];              // chapter ids stamped (0-3)
  goldStamp: boolean;            // final exam passed
  boardingPassId: string;        // e.g. RG-0001
  chapterBest: Record<number, number>; // chapter -> best score /10
  lawMarks: Record<string, LawMark>;  // topic_id -> traffic light
  completedLessons: string[];
  answeredQuestions: Record<string, { correct: boolean; ts: number }>;
  delayedReports: { chapter: number; score: number; ts: number; topics: string[] }[];
  mockHistory: { date: string; score: number; total: number; pct: number }[];
  pomodoroSessions: number;
  /** City & Garage progression — coins earned from correct answers */
  coins: number;
  districts: string[];                    // unlocked city district ids
  vehicle: string;                        // scooter | sedan | sportscar | jetcar
  upgrades: { engine: number; armor: number; nitro: number }; // levels 0-5
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
