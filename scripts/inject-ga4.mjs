#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const MEASUREMENT_ID = 'G-Y5D2V2W7HN';
const TAG = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${MEASUREMENT_ID}');
</script>`;
const SKIP_DIRS = new Set(['.git', '.vercel', 'node_modules']);

let scanned = 0;
let injected = 0;
let alreadyTagged = 0;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.html')) continue;

    scanned += 1;
    const html = await readFile(fullPath, 'utf8');
    if (html.includes(MEASUREMENT_ID)) {
      alreadyTagged += 1;
      continue;
    }
    if (!/<\/head>/i.test(html)) {
      throw new Error(`Cannot inject GA4: missing </head> in ${path.relative(ROOT, fullPath)}`);
    }
    const next = html.replace(/<\/head>/i, `${TAG}\n</head>`);
    await writeFile(fullPath, next);
    injected += 1;
  }
}

await walk(ROOT);
console.log(JSON.stringify({ measurementId: MEASUREMENT_ID, scanned, injected, alreadyTagged }));
