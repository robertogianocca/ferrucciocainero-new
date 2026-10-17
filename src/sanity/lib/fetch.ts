import { cacheTag } from "next/cache";

import { client } from "./client";

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = ["sanity"],
): Promise<T> {
  "use cache";
  for (const tag of tags) {
    cacheTag(tag);
  }
  return client.fetch<T>(query, params);
}
