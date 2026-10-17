import type { Metadata } from "next";
import { Suspense } from "react";

import { EventLists, type EventCard } from "@/components/EventLists";
import { PageShell } from "@/components/PageShell";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allEventsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Calendario",
  description: "Prossimi appuntamenti di Ferruccio Cainero",
};

export default async function CalendarioPage() {
  const events = await sanityFetch<EventCard[]>(allEventsQuery, {}, ["events"]);

  return (
    <PageShell title="Calendario" eyebrow="EVENTI">
      <Suspense fallback={<p className="text-[var(--color-ink-muted)]">Caricamento…</p>}>
        <EventLists events={events} />
      </Suspense>
    </PageShell>
  );
}
