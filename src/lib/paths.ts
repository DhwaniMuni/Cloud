/**
 * Internal link helper.
 *
 * The site deploys under a GitHub Pages `base` (e.g. `/ignite-2026`), so every
 * internal href must carry that prefix. Always build internal links with
 * `path()` — a bare `href="/skills"` breaks on Pages while working in dev.
 */
const BASE = import.meta.env.BASE_URL; // always has a trailing slash in Astro

export function path(to: string): string {
  const clean = to.replace(/^\/+/, '');
  const joined = `${BASE.replace(/\/+$/, '')}/${clean}`;
  // Collapse to '/' rather than emitting an empty href for the home page.
  return joined.replace(/\/+$/, '') || '/';
}

/** Canonical path for a week page. */
export function weekPath(week: number): string {
  return path(`week/${week}`);
}

/** Anchor on the skills page for a given tool slug. */
export function skillsAnchor(slug: string): string {
  return `${path('skills')}#${slug}`;
}

/** Resolve a path that lives in `public/` (images, favicons). */
export function asset(to: string): string {
  return path(to);
}
