import { getCollection, type CollectionEntry } from "astro:content";

export type Essay = CollectionEntry<"essays">;

export async function getEssays() {
  const essays = await getCollection("essays");
  return essays.sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id),
  );
}

export function essayHref(essay: Essay) {
  return `/writing/${essay.id}/`;
}

export function readingMinutes(essay: Essay) {
  const words = essay.body?.match(/\S+/gu)?.length ?? 0;
  return Math.max(1, Math.ceil(words / 220));
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function essayDate(date: Date) {
  return dateFormatter.format(date);
}
