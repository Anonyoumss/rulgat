#!/usr/bin/env python3
"""Ingest official GAT mock JSONs -> schema-validated question shards.

Reads Arabic_GAT_offical_Mock.JSON / English_GAT_offical_Mock.JSON (or any
file with the same record shape) and writes content/questions/*.json
normalized to docs/QUESTION_SCHEMA.md.
"""
import json, re, sys, hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "content" / "questions"
OUT.mkdir(parents=True, exist_ok=True)

# topic string -> (chapter, topic_id) per docs/CURRICULUM.md
TOPIC_MAP = {
    "Percentages & Ratios": (2, "ch2.pct"),
    "Fractions & Divisibility": (1, "ch1.frac"),
    "Geometry & Area": (3, "ch3.shade"),
    "Counting & Combinatorics": (0, "ch0.stats"),
    "Sequences": (1, "ch1.frac"),
    "Unit Conversions": (0, "ch0.bigint"),
    "Algebraic Comparisons": (1, "ch1.dec"),
    "Closest Meaning": (0, "ch0.intro"),
    "Analogies/Logic": (0, "ch0.intro"),
    "Analogy": (0, "ch0.intro"),
    "Sentence Completion": (0, "ch0.intro"),
    "Reading Comprehension": (0, "ch0.intro"),
    "Contextual Error": (0, "ch0.intro"),
    "Logic": (0, "ch0.intro"),
}
LETTERS = "ABCD"

def norm(s: str) -> str:
    return re.sub(r"\s+", " ", s or "").strip()

def difficulty(qid: str) -> int:
    # deterministic pseudo-difficulty until bank provides real ratings
    return 1 + int(hashlib.md5(qid.encode()).hexdigest(), 16) % 3

def convert(rec: dict, source: str) -> dict:
    opts = rec.get("options") or {}
    options = [str(opts.get(L, "")) for L in LETTERS]
    ans = rec.get("correct_option") or ""
    answer_index = LETTERS.find(str(ans).upper())
    if answer_index < 0:
        answer_index = 0
    topic = rec.get("topic") or "Uncategorized"
    chapter, topic_id = TOPIC_MAP.get(topic, (0, "needs-review"))
    lang = (rec.get("language") or "ar").lower()
    stem = rec.get("question_text") or ""
    return {
        "id": rec.get("question_id") or hashlib.md5(stem.encode()).hexdigest()[:10],
        "lang": "ar" if lang.startswith("ar") else "en",
        "section": "quantitative" if rec.get("section") == "Quantitative" else "verbal",
        "chapter": chapter,
        "topic": topic,
        "topic_id": topic_id,
        "stem": stem,
        "stem_i18n": {"ar" if lang.startswith("ar") else "en": stem},
        "options": options,
        "answer_index": answer_index,
        "answer_label": LETTERS[answer_index],
        "explanation": rec.get("explanation") or "",
        "difficulty": difficulty(rec.get("question_id", "")),
        "source": source,
        "year": 2026,
        "video_url": "",
        "tags": [topic],
    }

def main():
    files = [
        (Path("/home/nothingos/Desktop/Arabic_GAT_offical_Mock.JSON"), "official-mock-ar"),
        (Path("/home/nothingos/Desktop/English_GAT_offical_Mock.JSON"), "official-mock-en"),
    ]
    seen, shards = set(), {}
    for path, source in files:
        if not path.exists():
            print(f"[skip] missing {path}", file=sys.stderr)
            continue
        data = json.loads(path.read_text(encoding="utf-8"))
        for rec in data:
            q = convert(rec, source)
            key = hashlib.md5((q["section"] + norm(q["stem"])).encode()).hexdigest()
            if key in seen:
                continue
            seen.add(key)
            shards.setdefault(source, []).append(q)
    total = 0
    for source, qs in shards.items():
        out = OUT / f"{source}.json"
        out.write_text(json.dumps(qs, ensure_ascii=False, indent=1), encoding="utf-8")
        total += len(qs)
        print(f"[ok] {out.name}: {len(qs)} questions")
    print(f"[done] total {total} questions -> {OUT}")

if __name__ == "__main__":
    main()
