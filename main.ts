// One Line of Earned Pride — writes one quiet, earned moment of pride to /output/entry.txt
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "He had rebuilt that engine eleven times in a shed that leaked; tonight it started on the first turn, and he wiped his hands and closed the hood.";

const OUT_FILE = join(process.cwd(), "output", "entry.txt");

// Each gate rule names its own failure so a bad line says exactly what is wrong.
const GATE: Array<{ name: string; check: (line: string) => string | null }> = [
  { name: "non-blank", check: (l) => (l.trim().length === 0 ? "line is empty or whitespace-only" : null) },
  {
    name: "length-1-240",
    check: (l) => (l.length < 1 || l.length > 240 ? `line is ${l.length} chars, must be 1-240` : null),
  },
  { name: "single-line", check: (l) => (l.includes("\n") ? "line must be a single line" : null) },
  {
    name: "no-edge-whitespace",
    check: (l) => (l !== l.trim() ? "line has leading/trailing whitespace" : null),
  },
];

function assertGate(line: string): void {
  const failures = GATE.map((g) => g.check(line)).filter((f): f is string => f !== null);
  if (failures.length > 0) {
    throw new Error(`gate failed (${failures.length}): ${failures.join("; ")}`);
  }
}

mkdirSync(join(process.cwd(), "output"), { recursive: true });
assertGate(LINE);
writeFileSync(OUT_FILE, LINE + "\n", "utf8");
console.log(`wrote /output/entry.txt (${LINE.length} chars)`);
