import Link from "next/link";

import { PortableBody } from "@/components/PortableBody";
import { formatPostDate } from "@/lib/dates";
import { sanityFetch } from "@/sanity/lib/fetch";
import { homePageQuery, latestPostsQuery } from "@/sanity/lib/queries";

type HomePage = {
  title?: string;
  body?: Parameters<typeof PortableBody>[0]["value"];
};

type PostCard = {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  excerpt?: string;
};

export default async function HomePage() {
  const [home, posts] = await Promise.all([
    sanityFetch<HomePage | null>(homePageQuery, {}, ["pages", "page:home"]),
    sanityFetch<PostCard[]>(latestPostsQuery, {}, ["posts"]),
  ]);

  const latest = posts[0];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,43,33,0.08),transparent_55%),linear-gradient(180deg,var(--color-paper),var(--color-paper-deep))]"
        />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-5 py-20 md:px-8 md:py-28">
          <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.2em] text-[var(--color-ink-muted)]">
            ATTORE E NARRATORE
          </p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight text-[var(--color-accent)] md:text-6xl">
            Ferruccio Cainero
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-ink-muted)] md:text-xl">
            Narrazioni, teatro e radio — tra Italia e Svizzera.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/calendario"
              className="inline-flex items-center bg-[var(--color-accent)] px-5 py-3 font-[family-name:var(--font-display)] text-xs font-semibold tracking-[0.14em] text-[var(--color-paper)] transition hover:opacity-90"
            >
              CALENDARIO
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center border border-[var(--color-accent)] px-5 py-3 font-[family-name:var(--font-display)] text-xs font-semibold tracking-[0.14em] text-[var(--color-accent)] transition hover:bg-[var(--color-accent)] hover:text-[var(--color-paper)]"
            >
              ATTUALITÀ
            </Link>
          </div>
        </div>
      </section>

      {latest ? (
        <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <p className="font-[family-name:var(--font-display)] text-xs tracking-[0.18em] text-[var(--color-ink-muted)]">
            ATTUALITÀ
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--color-accent)]">
            {latest.title}
          </h2>
          {latest.publishedAt ? (
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              {formatPostDate(latest.publishedAt)}
            </p>
          ) : null}
          {latest.excerpt ? (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
              {latest.excerpt}
            </p>
          ) : null}
          <Link
            href={`/blog/${latest.slug}`}
            className="mt-6 inline-flex font-[family-name:var(--font-display)] text-xs font-semibold tracking-[0.14em] text-[var(--color-accent)] underline underline-offset-4"
          >
            LEGGI DI PIÙ
          </Link>
        </section>
      ) : null}

      {home?.body?.length ? (
        <section className="mx-auto max-w-6xl border-t border-[var(--color-border)] px-5 py-16 md:px-8">
          <PortableBody value={home.body} />
        </section>
      ) : null}
    </div>
  );
}
