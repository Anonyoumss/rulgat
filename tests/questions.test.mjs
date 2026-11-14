// Schema sanity test for bundled question shards (run: node tests/questions.test.mjs)
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "content", "questions");
const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
let total = 0, errors = [];

for (const f of files) {
  const data = JSON.parse(readFileSync(join(dir, f), "utf8"));
  data.forEach((q, i) => {
    total++;
    if (!q.id || !q.stem) errors.push(`${f}[${i}] missing id/stem`);
    if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(`${f}[${i}] options!=4`);
    if (![0, 1, 2, 3].includes(q.answer_index)) errors.push(`${f}[${i}] bad answer_index`);
    if (![0, 1, 2, 3].includes(q.chapter)) errors.push(`${f}[${i}] bad chapter`);
    if (q.topic_id === "needs-review") errors.push(`${f}[${i}] unmapped topic: ${q.topic}`);
  });
}

console.log(`questions: ${total} across ${files.length} shards, ${errors.length} errors`);
if (errors.length) { console.log(errors.slice(0, 20).join("\n")); process.exit(1); }
