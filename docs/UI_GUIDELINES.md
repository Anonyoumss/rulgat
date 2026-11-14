# UI Guidelines — RulGAT / كويز بوكس

> Recyclable design-system rules. Sources: Google Material 3 Expressive
> (m3.material.io), Apple HIG (developer.apple.com/design), Telegram open-source
> clients (DrKLO/Telegram, TelegramMessenger/Telegram-iOS) for interaction
> patterns, and OnePrep (oneprep.xyz mirror in `~/Desktop/oneprep_download`)
> for the education-product visual language.

## Stack
- Web: Next.js App Router + Tailwind. Theme via CSS custom properties.
- Flutter: Material 3 (`useMaterial3: true`), dynamic color optional.

## Theme engine
- Two themes: **light** and **dark** (default follows system, user override
  persisted). Animated transition: interpolate background/surface/primary
  over ~300ms spring — NEVER hard-cut.
- Dark theme is a first-class design, not an inversion: deep neutral surfaces
  (#0F1115 family), elevated cards slightly lighter, neon accent preserved.
- Accent palette (from OnePrep token extraction — see `assets/design/`):
  primary indigo/violet, accent pink, accent yellow, callout lime/orange/indigo.
  Subject accents: Quantitative = indigo, Verbal = pink.
- Typography: DM Sans / Inter for Latin, IBM Plex Sans Arabic / Tajawal for
  Arabic. KaTeX for math rendering (OnePrep ships KaTeX fonts — reuse approach).

## Signature components (Telegram-inspired)
- **Liquid Glass surfaces**: `backdrop-blur-xl bg-white/60 dark:bg-white/5`
  + 1px specular border (`border-white/40`) + soft shadow. Used for bottom
  nav, sheets, floating cards, HUD elements.
- **Floating bottom bar**: centered pill nav, morphs icons per section,
  spring-animated indicator (`framer-motion` `layoutId`).
- **Hovering action sheet**: slides up with blur backdrop, drag-to-dismiss.
- **Theme toggle**: animated sun↔moon morph in header.

## Layout
- Mobile-first; max content width ~1120px; generous whitespace.
- Cards: radius 20–28px, subtle border, hover lift ≤4px.
- Buttons: pill-shaped primary (filled accent), tonal secondary, ghost text.
  Min height 44px (touch), focus ring 2px accent offset 2px.

## Qiyas CBT mock UI
- Faithful to official CBT: top bar (logo, timer chip, A−/A+, palette,
  flag), question card, 4 options (A–D letter chips), prev/next bar,
  question grid modal with answered/flagged/unanswered states.
- Timer: monospace digits, turns accent→danger under 5min.
- Do NOT redesign this screen — realism is the feature.

## Gamification visuals
- TIGDR mascot: friendly tiger (tiqdr.com brand assets in `assets/mascot/`).
- Garden: SVG plots, watered = saturated green, dry = sandy; shape-morphing
  transitions between geometric forms.
- XP/streak chips, level ring, reward toasts — glass cards with spring entry.

## Accessibility
- WCAG AA contrast both themes; `prefers-reduced-motion` disables springs
  (keep fades). Arabic screen-reader labels on icon buttons.
