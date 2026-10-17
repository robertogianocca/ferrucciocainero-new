import type { MetadataRoute } from "next";

import { pagePath } from "@/lib/navigation";
import { client } from "@/sanity/lib/client";
import {
  allEventsQuery,
  allPagesQuery,
  allPostsQuery,
} from "@/sanity/lib/queries";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://ferrucciocainero.ch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, posts, events] = await Promise.all([
    client.fetch<
      { slug: string; parent?: { slug?: string } | null }[]
    >(allPagesQuery),
    client.fetch<{ slug: string }[]>(allPostsQuery),
    client.fetch<{ slug: string }[]>(allEventsQuery),
  ]);

  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    {
      url: `${siteUrl}/calendario`,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  for (const page of pages) {
    if (!page.slug || page.slug === "calendario") continue;
    const path = pagePath({
      slug: page.slug,
      parent: page.parent ? { slug: page.parent.slug } : null,
    });
    entries.push({
      url: `${siteUrl}${path}`,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const post of posts) {
    entries.push({
      url: `${siteUrl}/blog/${post.slug}`,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const event of events) {
    entries.push({
      url: `${siteUrl}/calendario/${event.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}
