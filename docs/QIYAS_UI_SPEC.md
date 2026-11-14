# Qiyas / E-TEC CBT UI Spec — محاكاة الاختبار المحوسب

Pixel-faithful replica of the official computer-based test. Realism IS the
feature — do not "improve" this screen.

## Layout (top → bottom)
1. **Top bar** (sticky):
   - Left/Start: exam logo + name "قياس / capabilities" + candidate line
     (اسم تجريبي / Demo Candidate).
   - Center: section name + question counter "س ١٢ من ٩٦".
   - Right/End: **timer chip** (mm:ss, monospace; accent→danger <5:00),
     **font-size controls A− / A+** (3 steps), **question palette** button,
     **flag** toggle for current question.
2. **Question card**: stem text (RTL, sized by A±), optional figure area
   (SVG/PNG, centered, max-h 40vh), four options stacked vertically —
   each a full-width row: letter chip (A–D in circle) + option text.
   Selected = accent border + tinted bg; in review mode correct=green,
   wrong=red, missed=amber outline.
3. **Bottom bar**: `Previous` (ghost) · progress dots · `Next`/`Finish`
   (primary). Finish → confirmation sheet (answered/unanswered/flagged
   counts) → submit.
4. **Question palette modal** (glass sheet): grid of numbered cells —
   default=surface, answered=accent-soft, flagged=amber dot, current=
   accent ring. Tap to jump.

## Behavior
- Timer counts down from configured duration; auto-submit at 0 with
  unanswered = blank (Qiyas convention: no penalty shown, score computed
  on correct only).
- Answers saved per-session in state + localStorage (resume support).
- Flag is per-question toggle, independent of answer.
- Font size: 3 steps (0.9×/1×/1.15×) persisted per user.

## Results screen
- Score banner (x/y, percentage ring), time used vs allowed,
- Per-question review list: stem, your answer vs correct, explanation
  (when present), "practice this topic" deep link.
- Topic-wise accuracy bars → feeds planner recommendations.
