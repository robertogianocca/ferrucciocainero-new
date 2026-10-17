import type { Metadata } from "next";
import { Quicksand, Source_Sans_3 } from "next/font/google";

import "./globals.css";

const display = Quicksand({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Ferruccio Cainero",
    template: "%s · Ferruccio Cainero",
  },
  description: "Sito ufficiale di Ferruccio Cainero — attore e narratore",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
        {children}
      </body>
    </html>
  );
}
