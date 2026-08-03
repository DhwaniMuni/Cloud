/**
 * Site-wide strings. Everything user-facing that is not week content lives here,
 * so renaming yourself or retitling the program is a one-file change.
 */
export const site = {
  author: 'Dhwani Muni',
  program: 'IGNITE 2026',
  tagline: '8 weeks in IGNITE 2026',
  /** Shown in the hero, under the tagline. One paragraph. */
  summary:
    'A record of eight weeks in the IGNITE 2026 early-career technology program — the systems I built, the problems that cost me the most time, and what I would do differently. Each week has its own page; the deep technical detail lives one click down.',
  /** Total weeks in the program. Drives the tab bar and prev/next bounds. */
  totalWeeks: 8,
  /** The week that holds the capstone, surfaced on the home page. */
  capstoneWeek: 8,
} as const;
