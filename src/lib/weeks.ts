import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../data/site';

/**
 * Week data access, shared by every route so ordering and validation happen
 * in exactly one place.
 */

/** All weeks, ordered by week number. */
export async function getWeeks(): Promise<CollectionEntry<'weeks'>[]> {
  const weeks = await getCollection('weeks');

  const seen = new Map<number, string>();
  for (const entry of weeks) {
    const existing = seen.get(entry.data.week);
    if (existing) {
      throw new Error(
        `Duplicate week number ${entry.data.week}: "${existing}" and "${entry.id}". ` +
          `Each week number must appear in exactly one content file.`,
      );
    }
    seen.set(entry.data.week, entry.id);
  }

  if (weeks.length !== site.totalWeeks) {
    // A warning, not an error — you may be mid-way through authoring.
    console.warn(
      `[weeks] Found ${weeks.length} week file(s) but site.totalWeeks is ${site.totalWeeks}. ` +
        `The tab bar will link to weeks that do not exist yet.`,
    );
  }

  return weeks.sort((a, b) => a.data.week - b.data.week);
}

/** Neighbours for the prev/next navigation on a week page. */
export function neighbours(weeks: CollectionEntry<'weeks'>[], week: number) {
  const index = weeks.findIndex((entry) => entry.data.week === week);
  const prevEntry = index > 0 ? weeks[index - 1] : undefined;
  const nextEntry = index >= 0 && index < weeks.length - 1 ? weeks[index + 1] : undefined;

  return {
    prev: prevEntry ? { week: prevEntry.data.week, title: prevEntry.data.title } : undefined,
    next: nextEntry ? { week: nextEntry.data.week, title: nextEntry.data.title } : undefined,
  };
}
