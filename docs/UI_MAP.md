# UI Map — RulGAT / كويز بوكس

Every route and major component. Keep in sync with `apps/web` (and later
`apps/mobile`). Status: ✅ built · 🚧 in progress · ⬜ planned.

## Web routes (`apps/web`)
| Route | Screen | Status |
|---|---|---|
| `/` | Home — greeting, daily plan card, TIGDR status, continue-learning | 🚧 |
| `/stories` | Doom-scroll story feed (vertical, swipe cards) | 🚧 |
| `/curriculum` | Chapter browser (باب زيرو → ١ → ٢ → ٣) | 🚧 |
| `/lesson/[id]` | Lesson player: PDF summary + gamified questions + test-tip card | 🚧 |
| `/practice` | Question practice session (topic-filtered, instant feedback) | 🚧 |
| `/tigdr` | TIGDR garden hub — waters, gardens, evolution | 🚧 |
| `/tigdr/play` | Garden Water mini-game (geometric shaded-area scenes) | 🚧 |
| `/pomodoro` | Pomodoro timer + session log | 🚧 |
| `/planner` | Qudrat Compass daily study plan | 🚧 |
| `/mock` | Mock-test setup (mode, duration, topics) | 🚧 |
| `/mock/[sessionId]` | Qiyas-style CBT interface | 🚧 |
| `/mock/[sessionId]/results` | Score + per-question review + analytics | 🚧 |
| `/profile` | ملف الطالب — XP, streak, mastery bars, score history | 🚧 |
| `/settings` | Language, theme, font size, account, data sync | 🚧 |
| `/pdf` | Interactive PDF companion (reader + checkboxes + QR deep-links) | ⬜ |

## Shared components (`components/`)
| Component | Purpose |
|---|---|
| `ThemeEngine` | light/dark animated transition, persistence |
| `GlassSurface` / `GlassCard` | liquid-glass surfaces (backdrop-blur + specular border) |
| `BottomNav` | floating pill nav with layoutId indicator |
| `Mascot` | TIGDR avatar with mood states (happy/thinking/proud/sad) |
| `XpChip`, `StreakChip`, `LevelRing` | gamification HUD |
| `QuestionCard` | stem + 4 options + explanation reveal |
| `GeoScene` | SVG renderer driven by `geo-core` scene specs |
| `Timer` | countdown chip (CBT + pomodoro variants) |
| `FontSizeControl` | A−/A+ control (CBT + reader) |
| `Toast` | reward/toast system (glass, spring entry) |

## State stores (client)
- `useProgress` — completed lessons, XP, streak, garden state (localStorage
  + optional PocketBase sync).
- `useI18n` — `ar`/`en` strings + RTL direction.
- `useTheme` — theme mode.
- `useQuestionPack` — loaded question shards (IndexedDB cache).

## Design tokens
All colors/spacing/radii consumed from `tailwind.config` tokens documented
in `docs/UI_GUIDELINES.md`. OnePrep token extraction saved to
`assets/design/oneprep-tokens.md`.
