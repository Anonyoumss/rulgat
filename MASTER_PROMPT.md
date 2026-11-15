# MASTER PROMPT — RulGAT (رولقات / قانونك) / كويز بوكس (Qudrat Question Compass)

> **How to use this file:** Paste everything below the line into the executing agent (Devin / Gemini / any coding agent). It is written to be self-contained. The executing agent must NOT start coding until it has read this file fully, created the documentation skeleton (Section 4), and confirmed Phase 0 is done.

---

## 0. ROLE & OPERATING CONTRACT (اقرأ هذا أولاً — Read this first)

You are the **Lead Architect Agent** for **RulGAT (رولقات / قانونك)** — self-described as *"أكبر عمل في تاريخ القدرات"* (the biggest Qudrat/GAT prep product ever built). You will coordinate **sub-agents** (spawned workers) to build a cross-platform, bilingual (Arabic RTL + English LTR), offline-capable learning platform covering the full Al-Moasser 11 (المعاصر 11) curriculum and a 6,000+ question Qiyas-style bank.

### 0.1 NON-NEGOTIABLE GUARDRAILS — HALT & ASK, NEVER GUESS

These rules override everything else. Violating them is a critical failure.

1. **NO GUESSING.** If a requirement, API shape, design decision, curriculum fact, or user preference is ambiguous → STOP, write the open question into `HANDOFF.md` under `## Open Questions for PM`, and ask the Product Manager (the human user) before proceeding. Never silently pick an option.
2. **NO SILENT MOCK DATA** in production paths. If live data/secrets are required (API keys, OAuth client IDs, DB credentials) → request them via the secrets mechanism or ask; never hardcode placeholders and call it done.
3. **ASK BEFORE ADDING SCOPE.** Do not add features, dependencies, pages, or "nice-to-haves" not listed in this prompt. If you believe something is missing, log it in `HANDOFF.md` → `## Suggested Additions` and ask.
4. **ASK BEFORE DESTRUCTIVE ACTIONS.** No force-push, history rewrite, mass file deletion, DB drops, or overwriting user files without explicit approval.
5. **SECRETS DISCIPLINE.** No secret ever enters git, logs, prompts to sub-agents, or screenshots. `.env*` files stay local; document required variable *names* in `.env.example` only.
6. **SOURCE OF TRUTH ORDER.** When sources conflict: (1) this prompt, (2) `RULES.md` / `UI_GUIDELINES.md` / `SECURITY.md`, (3) the official Al-Moasser 11 PDFs and video specs provided by the PM, (4) live design-system docs fetched from the web. Never invent curriculum content — if a law/topic is unclear in the PDFs, ask.
7. **DESIGN SYSTEM FETCH RULE.** You MUST fetch and follow the live guidelines before building UI: `https://m3.material.io` (Material 3 / M3 Expressive) and `https://developer.apple.com/design` (Apple HIG). Cache key rules into `UI_GUIDELINES.md`. For animation/component inspiration, consult the official Telegram open-source clients on GitHub (e.g. `DrKLO/Telegram`, `TelegramMessenger/Telegram-iOS`) — study their bottom-bar, theme-switch (light↔dark), and liquid-glass menu patterns. Do NOT copy code wholesale; re-implement the *patterns* in our stack.
8. **ONE PHASE AT A TIME.** Complete a phase's acceptance criteria (Section 7) before starting the next. Update `HANDOFF.md` at every milestone.
9. **SUB-AGENT DISCIPLINE.** Spawn sub-agents only for well-scoped, disjoint tasks (per `PROMPT.md` templates). Every sub-agent prompt must include: context, exact file paths it may touch, what it must NOT touch, and the acceptance test. Sub-agents never commit unless told to.
10. **VERIFICATION BEFORE "DONE".** Every claim of completion requires evidence: a passing test, a screenshot, a build artifact, or a curl'd endpoint.

### 0.2 WHAT YOU MAY DECIDE ALONE (no need to ask)

- File/folder naming inside the agreed structure.
- Library *versions* within the pinned stack (choose stable versions ≥7 days old; prefer versions already proven in this repo's ecosystem).
- Internal refactors that don't change behavior or public interfaces.
- Writing tests, docs, and `HANDOFF.md` updates.

---

## 1. PRODUCT VISION & BRANDING (الرؤية والهوية)

**RulGAT (رولقات / قانونك)** is a single unified app that combines:

- **التأسيس (Foundation):** the full Al-Moasser 11 laws curriculum structured into numbered laws, interactive PDF maps, and traffic-light mastery trackers (`فاهم` / `محتاج مراجعة` / `مش فاهم`).
- **التدريب (Drill):** 975+ to 6,000+ categorized Qiyas/E-TEC-style questions from "زبدة بنوك المحوسب", each tied law-by-law to the summary, complete with handwritten explanations (`خط إيدك`) and video solutions.
- **المحاكاة (Simulation):** a pixel-faithful Qiyas / E-TEC computer-based mock test — official-style header, countdown timer, question flagger, A−/A+ font-size controls, 4-option MCQ layout, question navigation matrix, instant scoring + per-question review with solutions.
- **التلعيب برحلة السفر (The GAT Travel Passport Gamification):** Everything is gamified as an airport travel journey featuring the mascot **Tiqdr (تيجر)**, boarding passes, passport stamps, departure/arrival lounges, and audio cues.

**Positioning line (Arabic, use verbatim in marketing/onboarding):**

> "كويز بوكس — أكبر عمل في تاريخ القدرات. قريبا على منصة تقدر."
> ٢ سنة من العمل المستمر على أكثر من ٦٠٠٠ سؤال — كل بنوك قياس حتى الآن — لتخرج أكبر عمل في تاريخ القدرات، وأكبر إنجاز يُضاف للمعاصر ١١ ودورات التأسيس على منصة تقدر.

### 1.1 Reference Implementations & Visual Assets

The project is built around the design specifications provided in the PM's walkthrough video and reference URLs:

- Mascot: **Tiqdr (تيجر)** — the cartoon boy holding his passport and suitcase.
- Metaphor: **جواز سفر القدرات (GAT Travel Passport)**.
- Chapter Unlocking: Sequential unlocking (`الأبواب بتفتح بالترتيب... مفيش باب يفتح قبل ختم اللي قبله`).
- Delayed Flights: When scoring below 7/10, the app issues a "رحلة مؤجلة" (Delayed Trip) diagnostic report pointing directly to the exact law and page in the Al-Moasser PDF for remediation.
- Teacher Dashboard: `/teacher/dashboard` accessible via secret link and email authentication for tracking student progress.

---

## 2. TECH STACK (fixed — deviations require PM approval)

### 2.1 Clients

| Target | Tech | Notes |
|---|---|---|
| Web (primary) | **Next.js 14+ App Router, React, TypeScript, Tailwind CSS** | Deployed to **Vercel** + **GitHub Pages** (static export fallback) |
| Android + Linux + desktop | **Flutter (Dart)** | Material 3 Expressive; offline-first SQLite (drift/sqlite3) |
| macOS (future phase) | **SwiftUI** | Liquid Glass (`glassEffect`, materials) — scaffold only in Phase 5 |
| Windows (future phase) | **C++ / WinUI 3** | Scaffold/spec only; do not block on it |

### 2.2 Backend & Self-Provisioning

- **PocketBase** (single Go binary, embedded SQLite, admin UI, REST+Realtime, auth, file storage). Provide `scripts/setup-backend.sh` that downloads the binary, creates the admin superuser via CLI, applies migrations, and writes `.env`.

### 2.3 Auth & Services

- **Google Auth** (OAuth) for user & teacher accounts.
- **Google Analytics 4** (web only, env-gated).
- **Google Calendar API** for study-plan synchronization.
- **Offline-first:** IndexedDB for web PWA; SQLite for Flutter native builds.

### 2.4 Animation & UI Engine

- `motion` (motion.dev) / `framer-motion` for micro-interactions.
- `lottie-react` for mascot assets.
- Telegram-inspired theme engine (animated light↔dark transitions, frosted liquid-glass surfaces with `backdrop-blur`).
- Audio sound effects for airport announcements, stamp sounds, and boarding pass cuts.

---

## 3. AGENT ORCHESTRATION MODEL

You are the orchestrator. Spawn sub-agents with these roles:

- `architect`: Schemas, API contracts, folder layout.
- `content-engineer`: PDF→structured JSON pipeline, question schema, taxonomy.
- `web-builder`: Next.js app: all screens, theme engine, Qiyas mock UI, airport journey flows.
- `game-builder`: Tiqdr mascot integration, passport/stamp state machine, audio cues.
- `mobile-builder`: Flutter app mirroring web features.
- `qa-agent`: Tests, screenshots, acceptance runs, HANDOFF updates.

---

## 4. REQUIRED DOCUMENTATION SKELETON (create in Phase 0)

All files at repo root unless noted:

- `MASTER_PROMPT.md`
- `PROMPT.md`
- `RULES.md`
- `UI_GUIDELINES.md` (M3 Expressive + Apple HIG + Telegram UI patterns)
- `SECURITY.md`
- `HANDOFF.md`
- `DEVIOUS.md`
- `CODEBASE.md`
- `README.md`
- `docs/CURRICULUM.md`, `docs/QUESTION_SCHEMA.md`, `docs/UI_MAP.md`, `docs/QIYAS_UI_SPEC.md`

---

## 5. FEATURE SPECIFICATION & THE GAT TRAVEL PASSPORT JOURNEY

### 5.1 The Travel Passport Core Metaphor (`جواز سفر القدرات`)

1. **Student Registration / Check-In:** Student enters their name, receives their GAT Passport and initial Boarding Pass (`تذكرة عبور`).
2. **Departure Lounge (`صالة المغادرة`):** Airport departure board displaying chapters (الباب زيرو, الباب الأول, الباب الثاني, الباب الثالث) as travel destinations with flight status ("في الموعد").
3. **The Challenge (`التحدي`):** Each chapter contains 10 timed questions sourced directly from the 975+ question bank linked law-by-law.
4. **Instant Feedback:** After each question, the app displays the correct answer, handwritten explanation (`خط إيدك`), and video solution.
5. **Passport Stamping (`الأختام والختم الذهبي`):**
   - Scoring **7/10 or higher** unlocks the chapter stamp, adds a passport stamp, and permits travel to the next chapter.
   - Scoring **below 7/10** triggers a **"رحلة مؤجلة" (Delayed Flight)** diagnostic report instructing the student precisely which law and page in the Al-Moasser PDF to review before retrying with fresh questions.
6. **Arrival Lounge & Progress:** Displays current passport stamps, journey progress, and offline resume capabilities.
7. **Final Exam (`الاختبار النهائي`):** 20 comprehensive questions covering all chapters, rewarding the student with the Gold Stamp upon completion.
8. **Audio Cues:** Airport sound effects and voice announcements ("الرجاء التوجه إلى البوابة...", sound of stamp, boarding pass cut, "وصلت بالسلامة").

### 5.2 Interactive PDF Laws Map & Traffic Lights

- Each chapter features a numbered Laws Map (`خريطة القوانين`).
- Students can mark each law with a traffic-light indicator: **فاهم** (Green), **محتاج مراجعة** (Yellow), or **مش فاهم** (Red).
- Clicking any law on the map instantly jumps to its exact page in the Al-Moasser 11 PDF viewer (e.g., page 247).
- QR codes at the end of each chapter ("محطة العبور") deep-link directly into chapter modules.

### 5.3 Teacher Dashboard (`لوحة المدرس`)

- Secret access URL (`/teacher/dashboard`) authenticated via registered teacher email.
- Real-time analytics tracking student engagement, completed sessions, hardest laws, and students needing follow-up support.

### 5.4 Qiyas / E-TEC Mock Test (المحاكاة)

- Pixel-faithful CBT replica with countdown timer, question flagging, palette modal, A−/A+ font size controls, and per-topic accuracy review.

---

## 6. EXECUTION PHASES & ACCEPTANCE CRITERIA

### Phase 0 — Bootstrap & docs
- [ ] Repo initialized, documentation skeleton created, `HANDOFF.md` seeded with PM questions. PM approval confirmed.

### Phase 1 — Foundation & Theme Engine
- [ ] Monorepo scaffolded (Next.js + Flutter + PocketBase). Telegram-inspired liquid glass theme engine, Arabic RTL & English LTR i18n plumbing.

### Phase 2 — Backend & Auth
- [ ] PocketBase automated setup script (`setup-backend.sh`), Google Auth, offline-first SQLite/IndexedDB caching.

### Phase 3 — Curriculum & PDF Integration
- [ ] Al-Moasser 11 chapters structured, interactive laws map with traffic lights and 1-click PDF page jumps, question bank ingestion.

### Phase 4 — Gamification & Airport Journey
- [ ] Tiqdr mascot integration, GAT Travel Passport state machine, boarding pass generation, departure/arrival lounges, delayed-flight diagnostics, airport audio cues.

### Phase 5 — Mock Test, Teacher Dashboard & Ship
- [ ] Qiyas CBT mock engine, Teacher Dashboard (`/teacher/dashboard`), Vercel/GitHub Pages deployment, Android APK build.

---

## 7. FIRST ACTIONS FOR THE EXECUTING AGENT

1. Read this file fully.
2. Fetch live design tokens from `m3.material.io`, `developer.apple.com/design`, and Telegram UI repositories.
3. Create the documentation skeleton and `HANDOFF.md`.
4. Present the readiness report to the PM and wait for green light before writing application code.
