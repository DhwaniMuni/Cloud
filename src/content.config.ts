import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Imported directly rather than re-exported from `astro:content`, which is
// deprecated in Astro 7.
import { z } from 'zod';
import { toolNames } from './data/tools';

/**
 * Week content schema.
 *
 * Bad content fails the build. In particular `tools` is an enum over the tools
 * registry (src/data/tools.ts), so referencing an unregistered tool is a build
 * error, not a silently broken chip.
 *
 * NOTE: in Astro 5+ this file lives at `src/content.config.ts` (not the older
 * `src/content/config.ts`) and each collection declares a `loader`.
 */
const weeks = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/weeks' }),
  schema: z
    .object({
      week: z.number().int().min(1).max(8),
      title: z.string().min(1),
      /** One line. Shown on the home timeline — keep it short. */
      hook: z.string().min(1).max(200),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      /** One short paragraph: what this week was for. */
      goal: z.string().min(1),
      /** Must match keys in src/data/tools.ts. */
      tools: z.array(z.enum(toolNames)).min(1),
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
      /** Draft weeks still render, but carry a "WIP" badge. */
      draft: z.boolean().default(true),
    })
    .refine((data) => data.endDate >= data.startDate, {
      message: 'endDate must be on or after startDate',
      path: ['endDate'],
    }),
});

export const collections = { weeks };
