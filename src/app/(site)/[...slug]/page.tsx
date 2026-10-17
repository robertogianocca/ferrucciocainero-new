import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { PageShell } from "@/components/PageShell";
import { PortableBody } from "@/components/PortableBody";
import { pagePath } from "@/lib/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allPagesQuery, pageByPathQuery } from "@/sanity/lib/queries";

type PageDoc = {
  _id: string;
  title: string;
  slug: string;
  parent?: { title?: string; slug?: string } | null;
  body?: Parameters<typeof PortableBody>[0]["value"];
};

const RESERVED = new Set(["blog", "admin", "api"]);

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const pages = await sanityFetch<
    { slug: string; parent?: { slug?: string } | null }[]
  >(allPagesQuery, {}, ["pages"]);

  return pages
    .filter((p) => p.slug && !RESERVED.has(p.slug) && p.slug !== "calendario")
    .map((p) => {
      const path = pagePath({
        slug: p.slug,
        parent: p.parent ? { slug: p.parent.slug } : null,
      });
      const segments = path.replace(/^\//, "").split("/").filter(Boolean);
      return { slug: segments.length ? segments : ["home"] };
    })
    .filter((p) => p.slug[0] !== "home");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const leaf = slug[slug.length - 1];
  const page = await sanityFetch<PageDoc | null>(
    pageByPathQuery,
    { slug: leaf },
    ["pages", `page:${leaf}`],
  );
  if (!page) return { title: "Pagina" };
  return {
    title: page.title,
    description: `${page.title} — Ferruccio Cainero`,
  };
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  if (!slug?.length || RESERVED.has(slug[0])) notFound();

  // Dedicated routes handle these
  if (slug[0] === "calendario" && slug.length === 1) {
    redirect("/calendario");
  }
  if (slug[0] === "blog") redirect("/blog");

  const leaf = slug[slug.length - 1];
  const page = await sanityFetch<PageDoc | null>(
    pageByPathQuery,
    { slug: leaf },
    ["pages", `page:${leaf}`],
  );

  if (!page) notFound();

  const expected = pagePath({
    slug: page.slug,
    parent: page.parent ? { slug: page.parent.slug } : null,
  });
  const actual = `/${slug.join("/")}`;
  if (expected !== actual && expected !== "/") {
    redirect(expected);
  }

  return (
    <PageShell
      title={page.title}
      eyebrow={page.parent?.title?.toUpperCase()}
    >
      <PortableBody value={page.body} />
    </PageShell>
  );
}
