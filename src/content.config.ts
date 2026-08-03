import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Imported directly rather than re-exported from `astro:content`, which is
// deprecated in Astro 7.
import { z } from 'zod';
import { toolNames } from './data/tools';

/**
 * Topic content schema.
 *
 * The site is organised by what was learned, not when — one page per topic.
 * Bad content fails the build. In particular `tools` is an enum over the tools
 * registry (src/data/tools.ts), so referencing an unregistered tool is a build
 * error, not a silently broken chip.
 *
 * NOTE: in Astro 5+ this file lives at `src/content.config.ts` (not the older
 * `src/content/config.ts`) and each collection declares a `loader`.
 */
const topics = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/topics' }),
  schema: z.object({
    /** Sort position in the tab bar and on the home index. Must be unique. */
    order: z.number().int().min(1),
    title: z.string().min(1),
    /** Short label for the tab bar — full titles are too long for a tab. */
    tab: z.string().min(1).max(20),
    /** One line, shown on the home index. Keep it short. */
    hook: z.string().min(1).max(200),
    /** One short paragraph: what you set out to be able to do. */
    goal: z.string().min(1),
    /** Must match keys in src/data/tools.ts. */
    tools: z.array(z.enum(toolNames)).min(1),
    /**
     * Definitions rendered as a panel near the top of the page, so a reader who
     * knows nothing about the topic can start from the vocabulary.
     */
    keyTerms: z
      .array(
        z.object({
          term: z.string().min(1),
          definition: z.string().min(1),
        }),
      )
      .default([]),
    challenges: z
      .array(
        z.object({
          title: z.string().min(1),
          problem: z.string().min(1),
          solution: z.string().min(1),
        }),
      )
      .default([]),
    learned: z.array(z.string().min(1)).default([]),
    artifacts: z
      .array(
        z.object({
          label: z.string().min(1),
          url: z.string().min(1),
          kind: z.enum(['repo', 'pr', 'doc', 'demo']),
        }),
      )
      .default([]),
    images: z
      .array(
        z.object({
          src: z.string().min(1),
          /** Real alt text, not a filename. Empty strings are rejected. */
          alt: z.string().min(1),
          caption: z.string().optional(),
        }),
      )
      .default([]),
    /** Surfaced as the highlighted callout on the home page. At most one. */
    featured: z.boolean().default(false),
    /** Draft topics still render, but carry a "WIP" badge. */
    draft: z.boolean().default(true),
  }),
});

export const collections = { topics };
