import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/PageShell";
import { PortableBody } from "@/components/PortableBody";
import { formatEventDate } from "@/lib/dates";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allEventsQuery, eventBySlugQuery } from "@/sanity/lib/queries";

type EventDoc = {
  _id: string;
  title: string;
  slug: string;
  start: string;
  end?: string;
  venue?: string;
  city?: string;
  infoUrl?: string;
  eventType?: { title?: string } | null;
  description?: Parameters<typeof PortableBody>[0]["value"];
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const events = await sanityFetch<{ slug: string }[]>(allEventsQuery, {}, [
    "events",
  ]);
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await sanityFetch<EventDoc | null>(
    eventBySlugQuery,
    { slug },
    ["events", `event:${slug}`],
  );
  if (!event) return { title: "Evento" };
  return {
    title: event.title,
    description: `${event.title} — ${formatEventDate(event.start)}`,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await sanityFetch<EventDoc | null>(
    eventBySlugQuery,
    { slug },
    ["events", `event:${slug}`],
  );
  if (!event) notFound();

  const place = [event.venue, event.city].filter(Boolean).join(", ");

  return (
    <PageShell title={event.title} eyebrow="EVENTO">
      <div className="-mt-6 mb-8 space-y-2 text-[var(--color-ink-muted)]">
        <p>{formatEventDate(event.start)}</p>
        {place ? <p>{place}</p> : null}
        {event.eventType?.title ? <p>{event.eventType.title}</p> : null}
        {event.infoUrl ? (
          <p>
            <a
              href={event.infoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Info / biglietti
            </a>
          </p>
        ) : null}
      </div>
      <PortableBody value={event.description} />
      <p className="mt-12">
        <Link
          href="/calendario"
          className="font-[family-name:var(--font-display)] text-xs tracking-[0.14em] underline underline-offset-4"
        >
          ← TORNA AL CALENDARIO
        </Link>
      </p>
    </PageShell>
  );
}
