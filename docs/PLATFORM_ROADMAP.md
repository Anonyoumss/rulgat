# Platform Roadmap — RulGAT

| Phase | Platform | Tech | Status |
|---|---|---|---|
| 1 | Web app | Next.js 14 + Tailwind | 🚧 building |
| 1 | Android + Linux desktop | Flutter (Material 3) | scaffold |
| 2 | macOS | SwiftUI + Liquid Glass | planned |
| 3 | Windows | C++ / WinUI 3 | planned |
| — | Backend | PocketBase (self-hosted) | scripted |

## Deploy targets
- Web → Vercel (primary) + GitHub Pages (static export mirror).
- Android → debug APK via GitHub Actions artifact (release signing later).
- Linux → Flutter Linux build / PWA install.

## Offline strategy
- Web: question packs cached in IndexedDB; PWA manifest; works offline
  after first pack download.
- Flutter: SQLite (drift) as source of truth + sync queue to PocketBase.
