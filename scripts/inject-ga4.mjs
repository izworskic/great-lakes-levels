#!/usr/bin/env node

import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, 'public');
const MEASUREMENT_ID = 'G-Y5D2V2W7HN';
const TAG = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${MEASUREMENT_ID}');
</script>`;
const SKIP_TOP_LEVEL = new Set(['.git', '.vercel', 'node_modules', 'public', 'scripts', 'vercel.json']);

let scanned = 0;
let injected = 0;
let alreadyTagged = 0;

async function stageStaticSite() {
  await rm(OUTPUT, { recursive: true, force: true });
  await mkdir(OUTPUT, { recursive: true });
  const entries = await readdir(ROOT, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_TOP_LEVEL.has(entry.name)) continue;
    await cp(path.join(ROOT, entry.name), path.join(OUTPUT, entry.name), { recursive: true });
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
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
      throw new Error(`Cannot inject GA4: missing </head> in ${path.relative(OUTPUT, fullPath)}`);
    }
    const next = html.replace(/<\/head>/i, `${TAG}\n</head>`);
    await writeFile(fullPath, next);
    injected += 1;
  }
}

await stageStaticSite();
await walk(OUTPUT);
console.log(JSON.stringify({ measurementId: MEASUREMENT_ID, scanned, injected, alreadyTagged, output: 'public' }));
