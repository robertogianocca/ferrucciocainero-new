"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { formatEventDate } from "@/lib/dates";

export type EventCard = {
  _id: string;
  title: string;
  slug: string;
  start: string;
  end?: string;
  venue?: string;
  city?: string;
  infoUrl?: string;
  eventType?: { title?: string } | null;
};

type EventListsProps = {
  events: EventCard[];
};

function subscribe() {
  return () => {};
}

function EventItem({ event }: { event: EventCard }) {
  const place = [event.venue, event.city].filter(Boolean).join(", ");
  return (
    <li className="border-t border-[var(--color-border)] py-6">
      <p className="text-sm text-[var(--color-ink-muted)]">
        {formatEventDate(event.start)}
        {event.eventType?.title ? ` · ${event.eventType.title}` : ""}
      </p>
      <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-accent)] md:text-2xl">
        <Link href={`/calendario/${event.slug}`} className="hover:opacity-80">
          {event.title}
        </Link>
      </h3>
      {place ? (
        <p className="mt-2 text-[var(--color-ink-muted)]">{place}</p>
      ) : null}
      {event.infoUrl ? (
        <a
          href={event.infoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm underline underline-offset-4"
        >
          Info / biglietti
        </a>
      ) : null}
    </li>
  );
}

export function EventLists({ events }: EventListsProps) {
  // Client clock only (server snapshot avoids prerender Date.now issues)
  const now = useSyncExternalStore(
    subscribe,
    () => Date.now(),
    () => 0,
  );

  const upcoming = events.filter((e) => new Date(e.start).getTime() >= now);
  const past = events
    .filter((e) => new Date(e.start).getTime() < now)
    .slice()
    .reverse();

  // During SSR/prerender (now === 0), show a flat list; hydrate into sections.
  if (now === 0) {
    return (
      <ul>
        {events.map((e) => (
          <EventItem key={e._id} event={e} />
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-14">
      <section>
        <h2 className="font-[family-name:var(--font-display)] text-sm tracking-[0.16em] text-[var(--color-ink-muted)]">
          PROSSIMI APPUNTAMENTI
        </h2>
        {upcoming.length === 0 ? (
          <p className="mt-4 text-[var(--color-ink-muted)]">
            Nessun evento in programma al momento.
          </p>
        ) : (
          <ul className="mt-2">
            {upcoming.map((e) => (
              <EventItem key={e._id} event={e} />
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 ? (
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-sm tracking-[0.16em] text-[var(--color-ink-muted)]">
            ARCHIVIO
          </h2>
          <ul className="mt-2">
            {past.map((e) => (
              <EventItem key={e._id} event={e} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
