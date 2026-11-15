# UI Map — RulGAT (رولقات / قانونك)

Every route and major component. Status: ✅ built · 🚧 in progress · ⬜ planned.

## Web routes (`web/`)
| Route | Screen | Status |
|---|---|---|
| `/` | Home — greeting, daily plan, passport status, continue-learning | ✅ |
| `/journey` | جواز سفر القدرات — check-in, passport stamps, departure board, delayed reports, final exam CTA | ✅ |
| `/challenge/[chapter]` | Chapter challenge — 10 questions → stamp (≥7/10) or رحلة مؤجلة report | ✅ |
| `/laws/[chapter]` | خريطة القوانين — numbered laws + traffic-light mastery marks | ✅ |
| `/lesson/[id]` | Lesson: summary + test-tip + gamified questions | ✅ |
| `/curriculum` | Chapter browser (باب زيرو → ٣) | ✅ |
| `/stories` | Doom-scroll story feed | ✅ |
| `/practice` | Topic-filtered drill sessions | ✅ |
| `/pomodoro` | Focus timer → XP | ✅ |
| `/planner` | Qudrat Compass daily plan | ✅ |
| `/mock` | Mock-test setup | ✅ |
| `/mock/exam` | Qiyas-style CBT interface | ✅ |
| `/mock/results` | Score + per-question review | ✅ |
| `/profile` | ملف الطالب — XP, streak, stamps, mastery, history | ✅ |
| `/settings` | Language, theme, reset | ✅ |
| `/teacher/dashboard` | لوحة المدرس — email-gated analytics (demo gate) | ✅ |
| `/pdf` | Interactive PDF companion + QR deep-links | ⬜ |

## Shared components (`web/src/components/`)
`ThemeProvider`, `ProgressProvider`, `BottomNav` (floating pill, layoutId),
`Mascot` (Tiqdr traveler SVG — placeholder pending brand art),
`HudChips` (XP/streak/stamps), `QuestionCard`, `GeoScene` (geo-core SVG —
kept for shaded-figure questions), `sounds.ts` (WebAudio airport cues:
stamp/chime/announce/delay/correct/wrong/gold).

## Gamification state (`lib/progress.ts`)
Passport: `passportName`, `boardingPassId` (RG-####), `stamps[]` (ch 0-3),
`goldStamp`, `chapterBest`, `lawMarks` (traffic lights), `delayedReports`,
`xp/level/streak`, `mockHistory`, `pomodoroSessions`.
Chapter unlock rule: sequential — chapter N requires stamp N-1 (journey board
enforces lock icons).

## Design tokens
`web/src/app/globals.css` — OnePrep-derived palette (see
`assets/design/oneprep-tokens.md`), liquid-glass utilities, animated
theme transitions. Rules: `docs/UI_GUIDELINES.md`.
