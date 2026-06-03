import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGETS = ["src", "tests", "scripts", "README.md", "AGENTS.md", "docs"];
const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs", ".md"]);

const MARKERS = [
  { codePoint: 0xfffd, label: "replacement character" },
  { codePoint: 0x00e2, label: "common UTF-8 mojibake marker" },
  { codePoint: 0x00ef, label: "common replacement mojibake marker" },
  { codePoint: 0x00c3, label: "common double-encoding marker" },
];

function shouldScan(filePath: string) {
  const normalized = filePath.replace(/\\/g, "/");
  if (normalized.includes("/scripts/fix-mojibake")) return false;
  return TEXT_EXTENSIONS.has(path.extname(filePath));
}

function collectFiles(target: string, files: string[] = []) {
  const absolute = path.join(ROOT, target);
  if (!fs.existsSync(absolute)) return files;

  const stat = fs.statSync(absolute);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(absolute)) {
      collectFiles(path.join(target, entry), files);
    }
    return files;
  }

  if (shouldScan(absolute)) {
    files.push(absolute);
  }

  return files;
}

function lineForIndex(text: string, index: number) {
  return text.slice(0, index).split(/\r?\n/).length;
}

const findings: string[] = [];

for (const file of TARGETS.flatMap((target) => collectFiles(target))) {
  const text = fs.readFileSync(file, "utf8");

  for (const marker of MARKERS) {
    const character = String.fromCodePoint(marker.codePoint);
    const index = text.indexOf(character);
    if (index !== -1) {
      findings.push(
        `${path.relative(ROOT, file)}:${lineForIndex(text, index)} contains ${marker.label} U+${marker.codePoint.toString(16).toUpperCase()}`,
      );
    }
  }
}

assert.equal(
  findings.length,
  0,
  `Encoding check failed:\n${findings.join("\n")}`,
);

console.log("Encoding check passed.");
