#!/usr/bin/env python3
"""Ingest a Tiqdr /generate exam JSON into RulGAT question shards.

The exam PDF is image-based (no text layer), so each question is stored as
its rendered page image + answer letter + topic metadata + video link.
Question pages are the ODD pages (answers/metadata keys).

Usage: python3 scripts/ingest_tiqdr.py /tmp/gen1.json bank1
"""
import json, base64, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def slug(s: str) -> str:
    return re.sub(r"[^\wء-غف-ي]+", "-", s).strip("-")[:40] or "q"

def main(gen_path: str, bank_name: str):
    d = json.load(open(gen_path))
    meta = d["questionMetadata"]; answers = d["answers"]; links = d.get("links", {})
    pdf_bytes = base64.b64decode(d["pdfBase64"])
    pdf_path = Path(f"/tmp/{bank_name}.pdf")
    pdf_path.write_bytes(pdf_bytes)

    img_dir = ROOT / "content" / "images" / bank_name
    img_dir.mkdir(parents=True, exist_ok=True)

    # question pages = odd keys present in answers
    pages = sorted(int(p) for p in answers.keys())
    print(f"{bank_name}: {len(pages)} questions, {d.get('questionCount')} declared")

    out = []
    for p in pages:
        m = meta.get(str(p), {})
        topic_name = m.get("collectionName") or m.get("topicName") or "عام"
        vid = (links.get(str(p)) or {}).get("videoLink", "")
        ans_letter = answers[str(p)]
        # render page to PNG (150 dpi is enough for reading)
        png = img_dir / f"p{p:03d}.png"
        if not png.exists():
            subprocess.run(
                ["pdftoppm", "-f", str(p), "-l", str(p), "-r", "140", "-png", "-singlefile", str(pdf_path), str(png.with_suffix(""))],
                check=True, capture_output=True,
            )
        out.append({
            "id": f"tiqdr.{bank_name}.p{p}",
            "lang": "ar",
            "section": "quantitative",  # tiqdr bank is math-only; refine via topic map later
            "chapter": 0,               # needs law-by-law mapping pass
            "topic": topic_name,
            "topic_id": "needs-review",
            "stem": "",                  # image-based question
            "stem_image": f"/content/images/{bank_name}/p{p:03d}.png",
            "options": [],               # options are inside the page image (A-D printed)
            "answer_index": "ABCD".find(ans_letter) if ans_letter in "ABCD" else 0,
            "answer_label": ans_letter,
            "explanation": "",
            "difficulty": 2,
            "source": f"tiqdr-{bank_name}",
            "year": 2026,
            "video_url": vid,
            "tags": [slug(topic_name)],
            "pdf_page": p,
        })

    dest = ROOT / "content" / "questions" / f"tiqdr-{bank_name}.json"
    dest.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    # also copy into web bundle dir
    web_dir = ROOT / "web" / "src" / "data" / "questions"
    web_dir.mkdir(parents=True, exist_ok=True)
    (web_dir / dest.name).write_text(dest.read_text(encoding="utf-8"), encoding="utf-8")
    img_web = ROOT / "web" / "public" / "content" / "images" / bank_name
    img_web.mkdir(parents=True, exist_ok=True)
    for f in img_dir.glob("*.png"):
        (img_web / f.name).write_bytes(f.read_bytes())
    print(f"[ok] {dest} — {len(out)} questions")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "bank")
