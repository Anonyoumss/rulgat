#!/usr/bin/env python3
"""Validate question shards against docs/QUESTION_SCHEMA.md."""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QDIR = ROOT / "content" / "questions"
REQUIRED = ["id", "lang", "section", "chapter", "topic", "topic_id", "stem",
            "options", "answer_index", "answer_label", "explanation",
            "difficulty", "source", "year", "video_url", "tags"]
errors, total = [], 0

for f in sorted(QDIR.glob("*.json")):
    data = json.loads(f.read_text(encoding="utf-8"))
    for i, q in enumerate(data):
        total += 1
        for k in REQUIRED:
            if k not in q:
                errors.append(f"{f.name}[{i}] missing '{k}'")
        if len(q.get("options", [])) != 4:
            errors.append(f"{f.name}[{i}] options != 4")
        ai = q.get("answer_index")
        if not isinstance(ai, int) or not (0 <= ai <= 3):
            errors.append(f"{f.name}[{i}] bad answer_index {ai}")
        if q.get("chapter") not in (0, 1, 2, 3):
            errors.append(f"{f.name}[{i}] bad chapter {q.get('chapter')}")

print(f"validated {total} questions, {len(errors)} errors")
for e in errors[:30]:
    print(" -", e)
sys.exit(1 if errors else 0)
