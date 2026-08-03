#!/usr/bin/env node
/**
 * Internal link checker for the built site.
 *
 * Walks `dist/`, collects every internal href and every element id, then reports
 * links that point at a page or anchor that does not exist. External links
 * (http/https/mailto) are deliberately NOT fetched — CI should not fail because
 * someone else's server is down.
 *
 * Written with only Node built-ins so it adds no dependency to the project.
 *
 * Usage: node scripts/check-links.mjs [distDir]
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, relative, posix } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = process.argv[2] ?? 'dist';

/**
 * Built hrefs are prefixed with Astro's `base` (e.g. `/ignite-2026/skills`) while
 * paths derived from `dist/` are not, so the base has to come off before the two
 * can be compared.
 *
 * The config is imported and its resolved `base` read, rather than pattern-matched
 * out of the source. `base` may be computed (e.g. conditional on CI), so anything
 * that reads the literal text would silently fall back to '/' and stop catching
 * broken links entirely.
 */
const BASE = await readBase();

async function readBase() {
  try {
    const url = pathToFileURL(join(process.cwd(), 'astro.config.mjs')).href;
    const config = (await import(url)).default;
    return normalise(config?.base ?? '/');
  } catch (error) {
    console.error(`Could not read \`base\` from astro.config.mjs: ${error.message}`);
    process.exit(1);
  }
}

/** Strip the configured base prefix from a root-relative pathname. */
function stripBase(pathname) {
  if (BASE === '/') return pathname;
  if (pathname === BASE) return '/';
  return pathname.startsWith(`${BASE}/`) ? pathname.slice(BASE.length) : pathname;
}

/** Recursively list every .html file under a directory. */
async function htmlFiles(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) found.push(full);
  }
  return found;
}

/**
 * The route a built file serves. `dist/topic/foo/index.html` → `/topic/foo`.
 * Trailing slashes and `index.html` are normalised away so both spellings match.
 */
function routeFor(file) {
  const rel = posix.normalize(relative(DIST, file).split(/[\\/]/).join('/'));
  const withoutIndex = rel.replace(/(^|\/)index\.html$/, '');
  const withoutExt = withoutIndex.replace(/\.html$/, '');
  return normalise(`/${withoutExt}`);
}

function normalise(pathname) {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

const files = await htmlFiles(DIST);
if (files.length === 0) {
  console.error(`No HTML files found in ${DIST}/. Run \`npm run build\` first.`);
  process.exit(1);
}

/** route -> Set of element ids on that page */
const pages = new Map();
/** { from, href } for every internal link found */
const links = [];

const HREF = /\shref="([^"]*)"/g;
const ID = /\sid="([^"]*)"/g;

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const route = routeFor(file);

  const ids = new Set();
  for (const [, id] of html.matchAll(ID)) ids.add(id);
  pages.set(route, ids);

  for (const [, href] of html.matchAll(HREF)) {
    if (!href || href.startsWith('#')) {
      // Same-page anchor: record it against this page.
      if (href.length > 1) links.push({ from: route, href, target: route, hash: href.slice(1) });
      continue;
    }
    // Skip anything that leaves the site or is not a document link.
    if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(href)) continue;

    const [pathPart, hash] = href.split('#');
    // Root-relative only; the site never emits relative document links.
    if (!pathPart.startsWith('/')) continue;

    links.push({ from: route, href, target: normalise(stripBase(pathPart)), hash });
  }
}

// Asset requests (CSS/JS/images) resolve to files, not routes — they are not
// in `pages`, so exclude them from route checking by extension.
const ASSET = /\.(css|js|mjs|map|png|jpe?g|svg|webp|avif|gif|ico|woff2?|txt|xml|json|pdf)$/i;

// A Set, because the same broken link usually appears on several pages (nav,
// chips) and the reported count should match the number of lines printed.
const problems = new Set();

for (const link of links) {
  if (ASSET.test(link.target)) continue;

  const ids = pages.get(link.target);
  if (!ids) {
    problems.add(`${link.from} → ${link.href}  (no such page)`);
    continue;
  }
  if (link.hash && !ids.has(link.hash)) {
    problems.add(`${link.from} → ${link.href}  (no element with id "${link.hash}")`);
  }
}

const checked = links.filter((l) => !ASSET.test(l.target)).length;
console.log(`Checked ${checked} internal link(s) across ${pages.size} page(s).`);

if (problems.size > 0) {
  console.error(`\n${problems.size} broken internal link(s):\n`);
  for (const problem of [...problems].sort()) console.error(`  ${problem}`);
  process.exit(1);
}

console.log('No broken internal links.');
