import type { Story } from "@/lib/types";

/** Doom-scroll educational stories — vertical micro-challenge cards.
 *  Story #1 is the canonical gardener/watering arc from the product spec. */
export const STORIES: Story[] = [
  {
    id: "story-gardener",
    topic_id: "ch3.shade",
    title_ar: "الرجل والمزرعة",
    title_en: "The Man and the Garden",
    cards: [
      {
        kind: "text",
        body_ar: "في يوم صيفي حار، قرر رجل أن يسقي حديقته قبل سفره. لكن الحديقة ليست quadrilateral عادية…",
        body_en: "On a hot summer day, a man decided to water his garden before traveling. But the garden isn't an ordinary shape…",
      },
      {
        kind: "text",
        body_ar: "الحديقة على شكل مستطيل كبير، لكنه ترك ركنًا مثلثًا فارغًا ليزرع فيه وردًا. سقى المنطقة المتبقية كاملة.",
        body_en: "The garden is a large rectangle, but he left a triangular corner empty for roses. He watered the remaining region completely.",
      },
      {
        kind: "question",
        body_ar: "إذا كانت مساحة المثلث المقطوع = نصف مساحة المستطيل، فما نسبة الجزء المسقي؟",
        body_en: "If the cut triangle = half the rectangle's area, what fraction is watered?",
      },
      {
        kind: "reveal",
        body_ar: "الإجابة: ١/٢ المسقي، ١/٢ غير المسقي. الحيلة: احسب مساحة المثلث (½×القاعدة×الارتفاع) ثم اطرحها من مساحة المستطيل — لا تحسب المسقي مباشرة أبدًا.",
        body_en: "Answer: 1/2 watered, 1/2 dry. Trick: compute the triangle (½×base×height), subtract from the rectangle — never compute the watered part directly.",
      },
      {
        kind: "text",
        body_ar: "جرّب الآن في حديقة تِجْر — TIGDR ينتظرك لتسقي الحدائق الهندسية بنفسك!",
        body_en: "Now try it in TIGDR's garden — he awaits you to water the geometric gardens yourself!",
      },
    ],
  },
  {
    id: "story-percent-farmer",
    topic_id: "ch2.pct",
    title_ar: "مزرعة percentual",
    title_en: "The Percentage Farm",
    cards: [
      {
        kind: "text",
        body_ar: "مزارع باع ٤٠٪ من محصوله الأول بسعر أقل من السوق ١٠٪. هل خسر أم ربح؟",
        body_en: "A farmer sold 40% of his first harvest at 10% below market price. Did he lose or gain?",
      },
      {
        kind: "question",
        body_ar: "إذا كان سعر السوق ١٠٠ ريال/كجم، فكم.average/s كجم получил продавец من هذه الدفعة؟",
        body_en: "If market price is 100 SAR/kg, how much per kg did the seller get for this batch?",
      },
      {
        kind: "reveal",
        body_ar: "١٠٠ × ٠٫٩ = ٩٠ ريال — خصم ١٠٪ يعني يدفع ٩٠٪ من السعر. تذكّر: «أقل بـ ١٠٪» = ×٠٫٩ وليس ×٠٫١.",
        body_en: "100 × 0.9 = 90 SAR — 10% off means paying 90% of price. Remember: '10% less' = ×0.9, not ×0.1.",
      },
      {
        kind: "text",
        body_ar: "النسب المئوية كلها كسور من ١٠٠ — حوّلها لكسور أو أعداد عشرية قبل أي حساب.",
        body_en: "All percentages are fractions of 100 — convert to fractions/decimals before any calculation.",
      },
    ],
  },
  {
    id: "story-pythagoras-road",
    topic_id: "ch3.pyth",
    title_ar: "الطريق المثلث",
    title_en: "The Triangle Road",
    cards: [
      {
        kind: "text",
        body_ar: "مهندس يبني طريقًا مختصرًا بين نقطتين تفصلهما ٣٠٠م شرقًا و٤٠٠م شمالًا. ما طول الطريق المائل؟",
        body_en: "An engineer builds a shortcut between two points 300m east and 400m north apart. How long is the diagonal road?",
      },
      {
        kind: "question",
        body_ar: "ما طول الوتر في مثلث قائم أضلاعه ٣٠٠ و ٤٠٠؟",
        body_en: "What is the hypotenuse of a right triangle with legs 300 and 400?",
      },
      {
        kind: "reveal",
        body_ar: "٣٠٠-٤٠٠-٥٠٠ مثلث فيثاغورس (نسخة مكبرة من ٣-٤-٥). الوتر = ٥٠٠م. في الاختبار: احفظ النسب ٣-٤-٥، ٦-٨-١٠، ٥-١٢-١٣، ٨-١٥-١٧ — توفر دقائق كاملة.",
        body_en: "300-400-500 is a Pythagorean triple (scaled 3-4-5). Hypotenuse = 500m. In the exam: memorize 3-4-5, 6-8-10, 5-12-13, 8-15-17 — saves whole minutes.",
      },
    ],
  },
];
