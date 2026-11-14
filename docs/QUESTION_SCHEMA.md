# Question Schema — RulGAT question bank

Canonical JSON schema for every question (web `content/questions/*.json`,
Flutter bundled JSON, and PocketBase `questions` collection).

```jsonc
{
  "id": "qat.quant.percentages.001",      // stable, dot-namespaced
  "lang": "ar" | "en" | "both",
  "section": "quantitative" | "verbal",
  "chapter": 0 | 1 | 2 | 3,               // Al-Moasser 11 chapter
  "topic": "Percentages & Ratios",        // human topic name
  "topic_id": "geo.pyth.345",             // optional taxonomy id
  "stem": "نص السؤال...",                  // primary language
  "stem_i18n": { "ar": "...", "en": "..." },
  "options": ["١٠٠", "١٢٠", "٨٠", "٦٠"],   // exactly 4, ordered A–D
  "answer_index": 0,                       // 0-based
  "answer_label": "A",
  "explanation": "شرح الإجابة...",          // required or content-gap ticket
  "explanation_i18n": { "ar": "...", "en": "..." },
  "figure": { "type": "svg" | "image" | "geo-scene",
              "svg": "...", "url": "...", "scene": { /* geo-core spec */ } },
  "difficulty": 1 | 2 | 3,                 // 1 easy, 2 medium, 3 hard
  "source": "official-mock" | "qiyas" | "e-tec" | "muaser-11" | ...,
  "year": 2026,
  "video_url": "https://...",              // optional explanation video
  "tags": ["percent", "ratio"]
}
```

## Ingestion rules
- Source JSONs with `options` as `{"A":..,"B":..,"C":..,"D":..}` map
  `answer_index` from `correct_option` letter → 0-based index.
- Arabic-Indic digits are preserved in `stem`/`options` as authored.
- Dedupe key: normalized `(section, stem)` hash.
- Validation: `tests/` schema test must pass before a shard ships.
