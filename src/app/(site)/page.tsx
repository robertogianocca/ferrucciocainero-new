import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,43,33,0.08),transparent_55%),linear-gradient(180deg,var(--color-paper),var(--color-paper-deep))]"
      />
      <section className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-5 py-20 md:px-8 md:py-28">
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
      </section>
    </div>
  );
}
