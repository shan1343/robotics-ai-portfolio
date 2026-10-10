import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const seen = [];
const missing = [];
const privateTerms = [];

function crawl(folder) {
  for (const ent of fs.readdirSync(folder, { withFileTypes: true })) {
    if (ent.name === '.git' || ent.name === 'node_modules') continue;
    const full = path.join(folder, ent.name);
    if (ent.isDirectory()) { crawl(full); continue; }
    if (!ent.name.endsWith('.md')) continue;

    const md = fs.readFileSync(full, 'utf8');
    for (const match of md.matchAll(/!?\[[^\]]+\]\(([^)\s]+)\)/g)) {
      const url = match[1].replace(/^<|>$/g, '');
      if (/^(?:https?:|mailto:|#|file:|data:)/i.test(url)) continue;
      const noHash = decodeURIComponent(url.split('#')[0].split('?')[0]);
      if (!noHash) continue;
      const target = path.resolve(path.dirname(full), noHash);
      seen.push({ from: path.relative(root, full), url });
      if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) {
        missing.push({ from: path.relative(root, full), url });
      }
    }
    if (path.relative(root, full).replaceAll('\\', '/') === 'README.md') {
      for (const t of ['academic-record-public', 'g1-physical-control', 'index.html']) {
        if (md.includes(t)) privateTerms.push(t);
      }
    }
  }
}

crawl(root);
console.log(JSON.stringify({ checkedLocalLinks: seen.length, missingLocalLinks: missing, forbiddenReadmeTerms: privateTerms }, null, 2));
if (missing.length || privateTerms.length) process.exitCode = 1;
