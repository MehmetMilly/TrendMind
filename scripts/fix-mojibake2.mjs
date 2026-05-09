/**
 * Repairs UTF-8-as-Windows-1256 mojibake using brute-force byte mapping.
 * Run once: node scripts/fix-mojibake2.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dir, "..");

const CP1256 = new TextDecoder("windows-1256");

// Build char → byte map via brute force (all 256 byte values)
const charToByteMap = new Map();
for (let b = 0; b <= 255; b++) {
  const ch = CP1256.decode(new Uint8Array([b]));
  if (!charToByteMap.has(ch)) charToByteMap.set(ch, b);
}

function repairString(s) {
  // Quick check: does it contain any high-byte Windows-1256 Arabic chars?
  const needsRepair = /[طظآأإئؤءغعخحجثتبيهونملكقفغصشسزرذدخح؀-ۿ]/u.test(s)
    || /[ÃâÂ]/.test(s);
  if (!needsRepair) return s;

  const bytes = [];
  for (const ch of s) {
    const byte = charToByteMap.get(ch);
    if (byte === undefined) return s; // can't map — not pure CP1256
    bytes.push(byte);
  }

  const utf8 = new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(bytes));
  if (utf8.includes("�") || utf8 === s) return s;

  // Make sure the result looks Arabic (sanity check)
  const arabicRatio = (utf8.match(/[؀-ۿ]/g) || []).length / utf8.length;
  if (arabicRatio < 0.1 && utf8.length > 4) return s;

  return utf8;
}

// Repair the content inside JSX attribute strings, template literals, and JSX text nodes
function repairSourceFile(src) {
  // Match JS string tokens (single / double / template) and JSX text nodes between >...</
  const TOKEN_RE = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|>([^<{]+)<)/gs;

  return src.replace(TOKEN_RE, (match, _full, jsxText) => {
    if (jsxText !== undefined) {
      // JSX text node: >CONTENT<
      const repaired = repairString(jsxText);
      if (repaired === jsxText) return match;
      return match.replace(jsxText, repaired);
    }

    // JS string literal
    const quote = match[0];
    const inner = match.slice(1, -1);
    const repaired = repairString(inner);
    if (repaired === inner) return match;
    return quote + repaired + quote;
  });
}

const TARGETS = [
  "src/components/trendmind/campaign-workspace.tsx",
  "src/components/trendmind/nav-rail.tsx",
  "src/components/trendmind/campaign-drawer.tsx",
  "src/lib/campaign-data.ts",
  "src/lib/workspace-store.tsx",
];

let fixed = 0;
for (const rel of TARGETS) {
  const file = path.join(ROOT, rel);
  const original = readFileSync(file, "utf8");
  const patched = repairSourceFile(original);
  if (patched !== original) {
    writeFileSync(file, patched, "utf8");
    fixed++;
    console.log(`✓ Fixed: ${rel}`);

    // Show what changed
    const origLines = original.split("\n");
    const patchLines = patched.split("\n");
    let changes = 0;
    for (let i = 0; i < origLines.length; i++) {
      if (origLines[i] !== patchLines[i]) {
        console.log(`  line ${i + 1}:`);
        console.log(`    was: ${origLines[i].trim().slice(0, 100)}`);
        console.log(`    now: ${patchLines[i].trim().slice(0, 100)}`);
        changes++;
      }
    }
    console.log(`  (${changes} lines changed)`);
  } else {
    console.log(`– No changes: ${rel}`);
  }
}
console.log(`\nDone. ${fixed} file(s) patched.`);
