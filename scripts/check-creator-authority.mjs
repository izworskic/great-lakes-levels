import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const personId = 'https://chrisizworski.com/#person';
const homepage = 'https://chrisizworski.com/';
const profile = 'https://chrisizworski.com/chris-izworski/';
const htmlFiles = [];

function collectHtml(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collectHtml(path);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(path);
  }
}
collectHtml('.');

function walk(value, onObject) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, onObject);
  } else if (value && typeof value === 'object') {
    onObject(value);
    for (const item of Object.values(value)) walk(item, onObject);
  }
}

assert.ok(htmlFiles.length > 0, 'expected prerendered HTML pages');
for (const path of htmlFiles) {
  const html = readFileSync(path, 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  assert.ok(canonical, `${path} must retain a canonical URL`);
  assert.equal(new URL(canonical).hostname, 'greatlakeslevels.org', `${path} canonical must stay on the production host`);
  assert.ok(html.includes(`<link rel="author" href="${profile}"`), `${path} must link author metadata to the canonical profile`);
  assert.ok(html.includes(`href="${profile}"`), `${path} must have a quiet visible creator profile link`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const schemas = blocks.map(([, body]) => JSON.parse(body));
  const definitions = [];
  let authorRef = false;
  let publisherRef = false;
  for (const schema of schemas) {
    walk(schema, object => {
      if (object['@id'] === personId && (object['@type'] === 'Person' || (Array.isArray(object['@type']) && object['@type'].includes('Person')))) definitions.push(object);
      if ((object['@type'] === 'WebPage' || object['@type'] === 'Article' || object['@type'] === 'WebApplication') && object.author?.['@id'] === personId) authorRef = true;
      if ((object['@type'] === 'WebPage' || object['@type'] === 'Article' || object['@type'] === 'WebApplication') && object.publisher?.['@id'] === personId) publisherRef = true;
    });
  }
  assert.equal(definitions.length, 1, `${path} must define one canonical Person node`);
  assert.equal(definitions[0].name, 'Chris Izworski', `${path} canonical Person name must be complete`);
  assert.equal(definitions[0].url, homepage, `${path} canonical Person URL must be the homepage`);
  assert.ok(authorRef, `${path} author must reference the canonical Person`);
  assert.ok(publisherRef, `${path} publisher must reference the canonical Person`);

  const pageUrl = schemas.flatMap(schema => {
    const items = [];
    walk(schema, object => { if (object['@type'] === 'WebPage' && typeof object.url === 'string') items.push(object.url); });
    return items;
  })[0];
  if (pageUrl) assert.equal(pageUrl.replace(/\/$/, ''), canonical.replace(/\/$/, ''), `${path} structured page URL must match its canonical link`);
}
console.log(`Creator authority checks passed for ${htmlFiles.length} HTML pages.`);
