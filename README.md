# RulGAT — رولقات / Qudrat Question Compass

> أكبر عمل في تاريخ القدرات — the biggest Qudrat (GAT) prep platform ever built.
> Al-Moasser 11 (المعاصر ١١) foundation curriculum + Qiyas-style question bank +
> full gamification (TIGDR garden, stories, pomodoro, study compass) +
> pixel-faithful CBT mock exams. Arabic-first, English-supported.

## Stack
- **Web** (`web/`): Next.js 14 App Router, TypeScript, Tailwind — deploys to
  Vercel / GitHub Pages. PWA, offline question packs (demo mode: localStorage).
- **Mobile/Desktop** (`mobile/`): Flutter — Android APK via CI, Linux/macOS/Windows roadmap.
- **Backend** (`backend/`): PocketBase (single binary) — `bash backend/scripts/setup-backend.sh`
  provisions binary + admin + collections + `.env` with zero dashboard clicks.

## Quick start (web)
```bash
cd web
npm install
npm run dev    # http://localhost:3000
```

## Backend (optional — app works in demo mode without it)
```bash
bash backend/scripts/setup-backend.sh
cd backend/pocketbase && ./pocketbase serve --http=0.0.0.0:8090
```

## Content
- `content/questions/*.json` — schema-validated shards (see `docs/QUESTION_SCHEMA.md`)
- Seed bank: 191 official GAT mock questions (AR+EN), ingested by
  `scripts/ingest_questions.py`.
- Curriculum taxonomy: `docs/CURRICULUM.md` (الباب زيرو → الباب الثالث).

## Features
| Area | Route | What |
|---|---|---|
| Home | `/` | daily plan, TIGDR status, continue learning |
| Stories | `/stories` | doom-scroll micro-challenge reels |
| Curriculum | `/curriculum` | Al-Moasser 11 chapters & topics |
| Lesson | `/lesson/[id]` | summary + test-tip + gamified questions |
| TIGDR | `/tigdr`, `/tigdr/play` | garden watering game w/ real geometry |
| Practice | `/practice` | topic-filtered drill sessions |
| Pomodoro | `/pomodoro` | focus timer → water drops + XP |
| Compass | `/planner` | rules-based daily study plan |
| Mock CBT | `/mock` → `/mock/exam` → `/mock/results` | Qiyas-style timed exam, palette, flags, A± |
| Profile | `/profile` | ملف الطالب — XP, streak, mastery, history |
| Settings | `/settings` | AR/EN, theme, data reset |

## Docs
See `docs/` — HANDOFF (live status), RULES, UI_GUIDELINES, UI_MAP,
QUESTION_SCHEMA, CURRICULUM, QIYAS_UI_SPEC, DEVIOUS (decision log),
SECURITY, PROMPT (sub-agent templates), PLATFORM_ROADMAP.
Master spec: `MASTER_PROMPT.md`.

## License
This is free and unlicense
