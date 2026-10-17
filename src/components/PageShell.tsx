type PageShellProps = {
  title: string;
  children: React.ReactNode;
  eyebrow?: string;
};

export function PageShell({ title, children, eyebrow }: PageShellProps) {
  return (
    <article className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      {eyebrow ? (
        <p className="font-[family-name:var(--font-display)] text-xs tracking-[0.18em] text-[var(--color-ink-muted)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--color-accent)] md:text-5xl">
        {title}
      </h1>
      <div className="mt-10">{children}</div>
    </article>
  );
}
