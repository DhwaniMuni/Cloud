import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Topic data access, shared by every route so ordering and validation happen in
 * exactly one place.
 */

export type Topic = CollectionEntry<'topics'>;

/** All topics, ordered by their `order` field. */
export async function getTopics(): Promise<Topic[]> {
  const topics = await getCollection('topics');

  const seen = new Map<number, string>();
  for (const entry of topics) {
    const existing = seen.get(entry.data.order);
    if (existing) {
      throw new Error(
        `Duplicate topic order ${entry.data.order}: "${existing}" and "${entry.id}". ` +
          `Each topic needs a unique \`order\` so the tab bar is deterministic.`,
      );
    }
    seen.set(entry.data.order, entry.id);
  }

  const featured = topics.filter((entry) => entry.data.featured);
  if (featured.length > 1) {
    throw new Error(
      `More than one topic is marked \`featured: true\` (${featured
        .map((entry) => entry.id)
        .join(', ')}). The home page highlights exactly one.`,
    );
  }

  return topics.sort((a, b) => a.data.order - b.data.order);
}

/** Neighbours for the prev/next navigation on a topic page. */
export function neighbours(topics: Topic[], id: string) {
  const index = topics.findIndex((entry) => entry.id === id);
  const prevEntry = index > 0 ? topics[index - 1] : undefined;
  const nextEntry = index >= 0 && index < topics.length - 1 ? topics[index + 1] : undefined;

  return {
    prev: prevEntry ? { slug: prevEntry.id, title: prevEntry.data.title } : undefined,
    next: nextEntry ? { slug: nextEntry.id, title: nextEntry.data.title } : undefined,
  };
}
