import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/PageShell";
import { PortableBody } from "@/components/PortableBody";
import { formatPostDate } from "@/lib/dates";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allPostsQuery, postBySlugQuery } from "@/sanity/lib/queries";

type Post = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
  body?: Parameters<typeof PortableBody>[0]["value"];
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await sanityFetch<{ slug: string }[]>(allPostsQuery, {}, [
    "posts",
  ]);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<Post | null>(
    postBySlugQuery,
    { slug },
    ["posts", `post:${slug}`],
  );
  if (!post) return { title: "Articolo" };
  return {
    title: post.title,
    description: post.excerpt || post.title,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await sanityFetch<Post | null>(
    postBySlugQuery,
    { slug },
    ["posts", `post:${slug}`],
  );
  if (!post) notFound();

  return (
    <PageShell title={post.title} eyebrow="ATTUALITÀ">
      {post.publishedAt ? (
        <p className="-mt-6 mb-8 text-sm text-[var(--color-ink-muted)]">
          {formatPostDate(post.publishedAt)}
        </p>
      ) : null}
      <PortableBody value={post.body} />
    </PageShell>
  );
}
