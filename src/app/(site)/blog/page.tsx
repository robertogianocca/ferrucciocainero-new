import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/PageShell";
import { formatPostDate } from "@/lib/dates";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allPostsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Attualità",
  description: "Novità e progetti di Ferruccio Cainero",
};

type PostCard = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
};

export default async function BlogIndexPage() {
  const posts = await sanityFetch<PostCard[]>(allPostsQuery, {}, ["posts"]);

  return (
    <PageShell title="Attualità" eyebrow="BLOG">
      {posts.length === 0 ? (
        <p className="text-[var(--color-ink-muted)]">Nessun articolo ancora.</p>
      ) : (
        <ul className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
          {posts.map((post) => (
            <li key={post._id} className="py-8">
              <Link href={`/blog/${post.slug}`} className="group block">
                {post.publishedAt ? (
                  <p className="text-sm text-[var(--color-ink-muted)]">
                    {formatPostDate(post.publishedAt)}
                  </p>
                ) : null}
                <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-accent)] transition group-hover:opacity-80">
                  {post.title}
                </h2>
                {post.excerpt ? (
                  <p className="mt-3 max-w-2xl text-[var(--color-ink-muted)]">
                    {post.excerpt}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
