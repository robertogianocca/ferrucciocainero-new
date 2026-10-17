import Image from "next/image";
import Link from "next/link";

import { MobileNav } from "@/components/MobileNav";
import { navHref, type NavItem } from "@/lib/navigation";

type SiteHeaderProps = {
  title: string;
  navigation: NavItem[];
};

export function SiteHeader({ title, navigation }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-paper)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="shrink-0" aria-label={title}>
          <Image
            src="/logo.png"
            alt={title}
            width={220}
            height={25}
            className="h-6 w-auto md:h-7"
            priority
          />
        </Link>

        <nav className="hidden md:block" aria-label="Menu principale">
          <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 lg:gap-x-5">
            {navigation.map((item) => (
              <li key={`${item.label}-${item.linkType}`}>
                <Link
                  href={navHref(item)}
                  className="font-[family-name:var(--font-display)] text-[0.7rem] font-medium tracking-[0.12em] text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)] lg:text-xs"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav items={navigation} />
      </div>
    </header>
  );
}
