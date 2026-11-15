#!/usr/bin/env python3
"""Provision PocketBase collections + import RulGAT question shards.

Usage:
  python3 backend/scripts/import_questions.py [--url http://127.0.0.1:8090]
Env: PB_ADMIN_EMAIL, PB_ADMIN_PASS (admin creds), default admin@rulgat.local
"""
import json, os, sys, urllib.request
from pathlib import Path

URL = os.environ.get("PB_URL", "http://127.0.0.1:8090")
EMAIL = os.environ.get("PB_ADMIN_EMAIL", "admin@rulgat.local")
PASSWORD = os.environ.get("PB_ADMIN_PASS", "")
ROOT = Path(__file__).resolve().parent.parent.parent

def req(method, path, body=None, token=None):
    r = urllib.request.Request(
        f"{URL}/api{path}",
        data=json.dumps(body).encode() if body is not None else None,
        method=method,
        headers={"Content-Type": "application/json", **({"Authorization": token} if token else {})},
    )
    try:
        with urllib.request.urlopen(r, timeout=30) as resp:
            return json.loads(resp.read() or b"{}")
    except urllib.error.HTTPError as e:
        return {"_error": e.code, "_body": e.read()[:300].decode(errors="replace")}

def admin_token():
    d = req("POST", "/admins/auth-with-password", {"identity": EMAIL, "password": PASSWORD})
    if "token" not in d:
        sys.exit(f"admin auth failed: {d}")
    return d["token"]

def field(name, ftype, **kw):
    f = {"name": name, "type": ftype}
    if ftype == "text": f["max"] = kw.pop("max", 5000)
    f.update(kw)
    return f

def ensure_collection(tok, name, fields, rules=None):
    cols = req("GET", "/collections?perPage=100", token=tok).get("items", [])
    if any(c["name"] == name for c in cols):
        print(f"  = {name} exists")
        return
    body = {"name": name, "type": "base", "schema": fields}
    r = req("POST", "/collections", body, tok)
    if "id" not in r:
        print(f"  + {name}: FAIL {r}")
        return
    if rules:
        cid = r["id"]
        r2 = req("PATCH", f"/collections/{cid}", {
            "listRule": rules, "viewRule": rules, "createRule": rules,
            "updateRule": rules, "deleteRule": rules}, tok)
        print(f"  + {name}: {'ok' if r2.get('id') else r2}")
    else:
        print(f"  + {name}: ok")

def main():
    tok = admin_token()
    print("[*] collections")
    ensure_collection(tok, "questions", [
        field("qid", "text", max=120, required=True),
        field("lang", "text", max=4),
        field("section", "text", max=20),
        field("chapter", "number"),
        field("topic", "text", max=300),
        field("topic_id", "text", max=120),
        field("stem", "text", max=20000),
        field("stem_image", "text", max=500),
        {"name": "options", "type": "json", "options": {"maxSize": 2000000}},
        field("answer_index", "number"),
        field("answer_label", "text", max=4),
        field("explanation", "text", max=20000),
        field("difficulty", "number"),
        field("source", "text", max=60),
        field("video_url", "text", max=500),
        {"name": "tags", "type": "json", "options": {"maxSize": 200000}},
    ])
    ensure_collection(tok, "progress", [
        field("user", "text", max=120, required=True),
        field("xp", "number"), field("level", "number"), field("streak", "number"),
        field("coins", "number"), field("vehicle", "text", max=30),
        {"name": "upgrades", "type": "json", "options": {"maxSize": 5000}},
        {"name": "payload", "type": "json", "options": {"maxSize": 100000}},
    ], rules='user = @request.auth.id')
    ensure_collection(tok, "stories", [
        field("title_ar", "text"), field("title_en", "text"),
        field("topic_id", "text"), {"name": "cards", "type": "json", "options": {"maxSize": 500000}},
    ])

    # import question shards (idempotent via qid filter)
    qdir = ROOT / "content" / "questions"
    existing = set()
    page = 1
    while True:
        d = req("GET", f"/collections/questions/records?perPage=500&page={page}&fields=qid", token=tok)
        items = d.get("items", [])
        if not items: break
        existing.update(i["qid"] for i in items)
        if len(items) < 500: break
        page += 1
    print(f"[*] {len(existing)} questions already in PocketBase")

    total_new = 0
    for jf in sorted(qdir.glob("*.json")):
        qs = json.loads(jf.read_text(encoding="utf-8"))
        new = [q for q in qs if q["id"] not in existing]
        if not new: continue
        ok = 0
        for q in new:
            body = {
                "qid": q["id"], "lang": q.get("lang", "ar"),
                "section": q.get("section", "quantitative"),
                "chapter": q.get("chapter", 0), "topic": q.get("topic", ""),
                "topic_id": q.get("topic_id", ""), "stem": q.get("stem", ""),
                "stem_image": q.get("stem_image", ""),
                "options": q.get("options", []),
                "answer_index": q.get("answer_index", 0),
                "answer_label": q.get("answer_label", ""),
                "explanation": q.get("explanation", ""),
                "difficulty": q.get("difficulty", 2),
                "source": q.get("source", ""),
                "video_url": q.get("video_url", ""),
                "tags": q.get("tags", []),
            }
            r = req("POST", "/collections/questions/records", body, tok)
            if "id" in r: ok += 1
        total_new += ok
        print(f"  {jf.name}: +{ok}/{len(new)}")
    print(f"[✓] imported {total_new} new questions")

if __name__ == "__main__":
    main()
