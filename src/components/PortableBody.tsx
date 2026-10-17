import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import Image from "next/image";

import { urlForImage } from "@/sanity/lib/image";

type PortableBodyProps = {
  value?: PortableTextBlock[] | null;
};

function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
  } catch {
    return null;
  }
  return null;
}

function vimeoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("vimeo.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    return parts[0] || null;
  } catch {
    return null;
  }
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-[var(--color-accent)] md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-accent)]">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mt-4 text-base leading-relaxed text-[var(--color-ink)] md:text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-[var(--color-accent)] pl-4 text-[var(--color-ink-muted)] italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--color-ink)]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-[var(--color-ink)]">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className="underline decoration-[var(--color-border)] underline-offset-4 transition hover:decoration-[var(--color-accent)]"
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlForImage(value).width(1200).height(800).url();
      return (
        <figure className="mt-8">
          <Image
            src={src}
            alt={value.alt || ""}
            width={1200}
            height={800}
            className="h-auto w-full object-cover"
          />
          {value.caption ? (
            <figcaption className="mt-2 text-sm text-[var(--color-ink-muted)]">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    pageImage: ({ value }) => {
      const image = value?.image;
      if (!image?.asset) return null;
      const src = urlForImage(image).width(1200).height(800).url();
      return (
        <figure className="mt-8">
          <Image
            src={src}
            alt={value.alt || ""}
            width={1200}
            height={800}
            className="h-auto w-full object-cover"
          />
          {value.caption ? (
            <figcaption className="mt-2 text-sm text-[var(--color-ink-muted)]">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    pageGallery: ({ value }) => {
      const images = value?.images || [];
      if (!images.length) return null;
      return (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img: { _key?: string; asset?: unknown; alt?: string }, i: number) => {
            if (!img?.asset) return null;
            const src = urlForImage(img).width(800).height(800).url();
            return (
              <Image
                key={img._key || i}
                src={src}
                alt={img.alt || ""}
                width={800}
                height={800}
                className="aspect-square h-auto w-full object-cover"
              />
            );
          })}
        </div>
      );
    },
    pageVideo: ({ value }) => {
      const url = value?.url as string | undefined;
      if (!url) return null;
      const yt = youtubeId(url);
      const vim = vimeoId(url);
      const embed = yt
        ? `https://www.youtube.com/embed/${yt}`
        : vim
          ? `https://player.vimeo.com/video/${vim}`
          : null;
      if (!embed) {
        return (
          <p className="mt-6">
            <a href={url} className="underline" target="_blank" rel="noopener noreferrer">
              {value.caption || url}
            </a>
          </p>
        );
      }
      return (
        <figure className="mt-8">
          <div className="aspect-video overflow-hidden bg-black">
            <iframe
              src={embed}
              title={value.caption || "Video"}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value.caption ? (
            <figcaption className="mt-2 text-sm text-[var(--color-ink-muted)]">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function PortableBody({ value }: PortableBodyProps) {
  if (!value?.length) return null;
  return (
    <div className="portable-body max-w-3xl">
      <PortableText value={value} components={components} />
    </div>
  );
}
