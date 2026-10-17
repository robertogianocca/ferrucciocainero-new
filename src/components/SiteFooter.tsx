type SiteFooterProps = {
  title: string;
  footerText?: string;
  email?: string;
  phone?: string;
  socialLinks?: { label: string; url: string }[];
};

export function SiteFooter({
  title,
  footerText,
  email,
  phone,
  socialLinks,
}: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-paper-deep)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-[family-name:var(--font-display)] text-sm tracking-[0.14em] text-[var(--color-ink)]">
            {title}
          </p>
          {footerText ? (
            <p className="mt-2 max-w-md text-sm text-[var(--color-ink-muted)]">
              {footerText}
            </p>
          ) : null}
          <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
            © {title}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-[var(--color-ink-muted)] md:items-end">
          {email ? (
            <a
              href={`mailto:${email}`}
              className="transition-colors hover:text-[var(--color-ink)]"
            >
              {email}
            </a>
          ) : null}
          {phone ? <p>{phone}</p> : null}
          {socialLinks?.length ? (
            <ul className="mt-1 flex flex-wrap gap-3 md:justify-end">
              {socialLinks.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-[var(--color-ink)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
