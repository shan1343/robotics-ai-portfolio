import { readFile } from "node:fs/promises";
import { evaluateCanaryEvidence } from "../src/lived-canary-evidence.js";

const path = process.argv[2];
if (!path || process.argv.length !== 3) {
  console.error("usage: node scripts/validate-lived-canary-evidence.mjs <sanitized-evidence.json>");
  process.exitCode = 64;
} else {
  try {
    const report = JSON.parse(await readFile(path, "utf8"));
    const result = evaluateCanaryEvidence(report);
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = !result.schemaValid ? 1 : result.verdict === "PASS" ? 0 : 2;
  } catch {
    console.error("INVALID: evidence file could not be read as JSON.");
    process.exitCode = 1;
  }
}
