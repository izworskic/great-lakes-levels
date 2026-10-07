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
assert.ok(htmlFiles.length > 0, 'expected prerendered HTML pages');

function walk(value, onObject) {
  if (Array.isArray(value)) {
    for (const item of value) walk(item, onObject);
  } else if (value && typeof value === 'object') {
    onObject(value);
    for (const item of Object.values(value)) walk(item, onObject);
  }
}
function normalized(url) {
  return new URL(url).href.replace(/\/$/, '');
}

for (const path of htmlFiles) {
  const html = readFileSync(path, 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  assert.ok(canonical, `${path} must retain a canonical URL`);
  assert.equal(new URL(canonical).hostname, 'greatlakeslevels.org', `${path} canonical must stay on the production host`);
  assert.ok(html.includes(`<link rel="author" href="${profile}"`), `${path} must link author metadata to the canonical profile`);
  const body = html.split(/<\/head>/i)[1] ?? '';
  assert.match(body, /<a\b[^>]*href="https:\/\/chrisizworski\.com\/chris-izworski\/"[^>]*>[^<]*Chris Izworski<\/a>/i, `${path} must visibly credit the canonical profile in a body link`);

  if (path !== 'chris-izworski/index.html') {
    assert.match(body, /<a\b[^>]*href="\/chris-izworski\/?"/i, `${path} must retain a useful link to its local author biography`);
  }

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const schemas = blocks.map(([, contents]) => JSON.parse(contents));
  const definitions = [];
  const pageNodes = [];
  for (const schema of schemas) {
    walk(schema, object => {
      const types = Array.isArray(object['@type']) ? object['@type'] : [object['@type']];
      if (object['@id'] === personId && types.includes('Person')) definitions.push(object);
      if (types.some(type => ['WebPage', 'ProfilePage', 'Article', 'WebApplication'].includes(type))) pageNodes.push(object);
    });
  }
  assert.equal(definitions.length, 1, `${path} must define one canonical Person node`);
  assert.equal(definitions[0].name, 'Chris Izworski', `${path} canonical Person name must be complete`);
  assert.equal(definitions[0].url, homepage, `${path} canonical Person URL must be the homepage`);
  assert.ok(pageNodes.length > 0, `${path} must expose page-level structured data`);
  for (const node of pageNodes) {
    assert.equal(node.author?.['@id'], personId, `${path} page author must reference the canonical Person`);
    assert.equal(node.publisher?.['@id'], personId, `${path} page publisher must reference the canonical Person`);
  }

  const structuredUrls = [];
  for (const schema of schemas) {
    walk(schema, object => {
      const types = Array.isArray(object['@type']) ? object['@type'] : [object['@type']];
      if (types.some(type => ['WebPage', 'ProfilePage'].includes(type)) && typeof object.url === 'string') structuredUrls.push(object.url);
      if (types.includes('WebApplication') && typeof object.url === 'string') structuredUrls.push(object.url);
      if (types.includes('Article') && typeof object.mainEntityOfPage === 'string') structuredUrls.push(object.mainEntityOfPage);
    });
  }
  assert.ok(structuredUrls.length > 0, `${path} must expose a structured page URL`);
  assert.ok(structuredUrls.every(url => normalized(url) === normalized(canonical)), `${path} page-level structured URLs must match its canonical link`);
}
console.log(`Creator authority checks passed for ${htmlFiles.length} HTML pages.`);
