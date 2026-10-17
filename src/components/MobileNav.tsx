"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { navHref, type NavItem } from "@/lib/navigation";

type MobileNavProps = {
  items: NavItem[];
};

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded border border-[var(--color-border)] text-[var(--color-ink)]"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Chiudi menu" : "Apri menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">Menu</span>
        <span className="flex flex-col gap-1.5" aria-hidden>
          <span
            className={`block h-0.5 w-5 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </span>
      </button>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto border-t border-[var(--color-border)] bg-[var(--color-paper)] px-6 py-8"
        >
          <nav aria-label="Menu principale">
            <ul className="flex flex-col gap-1">
              {items.map((item) => (
                <li key={`${item.label}-${item.linkType}`}>
                  <Link
                    href={navHref(item)}
                    className="block py-3 font-[family-name:var(--font-display)] text-lg tracking-wide text-[var(--color-ink)]"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
