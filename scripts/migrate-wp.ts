/**
 * WordPress → Sanity migration (Step 6).
 *
 * Imports:
 * - Events visible on /calendario/ only (not the full EventOn archive)
 * - The single Attualità post
 * - Pages (rendered HTML), with special handling for home/calendario/contact
 * - Media referenced by pages
 * - siteSettings singleton (nav + contact hints)
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=... npx tsx scripts/migrate-wp.ts
 *
 * Requires SANITY_API_WRITE_TOKEN (Editor) in .env.local.
 */

import { randomBytes } from "node:crypto";
import { createClient, type SanityClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";
import { JSDOM } from "jsdom";

loadEnv({ path: ".env.local" });

const WP_BASE = "https://www.ferrucciocainero.ch";
const WP_API = `${WP_BASE}/wp-json/wp/v2`;

const projectId = mustEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");
const dataset = mustEnv("NEXT_PUBLIC_SANITY_DATASET");
const token = mustEnv("SANITY_API_WRITE_TOKEN");
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

type PortableBlock = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: unknown[];
  listItem?: "bullet" | "number";
  children: { _type: "span"; _key: string; text: string; marks: string[] }[];
};

type PageBlock =
  | PortableBlock
  | {
      _type: "pageImage";
      _key: string;
      image: { _type: "image"; asset: { _type: "reference"; _ref: string } };
      alt?: string;
    }
  | {
      _type: "pageGallery";
      _key: string;
      images: {
        _type: "image";
        _key: string;
        asset: { _type: "reference"; _ref: string };
        alt?: string;
      }[];
    }
  | {
      _type: "pageVideo";
      _key: string;
      url: string;
      caption?: string;
    };

const mediaCache = new Map<number, string>();

function mustEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env.local (Sanity → API → Tokens → Editor/write).`,
    );
  }
  return value;
}

function key(prefix = "k"): string {
  return `${prefix}${randomBytes(6).toString("hex")}`;
}

function decodeEntities(input: string): string {
  return input
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(parseInt(n, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function textBlock(text: string, style = "normal"): PortableBlock | null {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  return {
    _type: "block",
    _key: key("b"),
    style,
    markDefs: [],
    children: [
      { _type: "span", _key: key("s"), text: cleaned, marks: [] },
    ],
  };
}

function htmlToBlocks(html: string): PortableBlock[] {
  const dom = new JSDOM(`<body>${html}</body>`);
  const body = dom.window.document.body;
  const blocks: PortableBlock[] = [];

  const pushFromElement = (el: Element) => {
    const tag = el.tagName.toLowerCase();
    if (["script", "style", "noscript", "svg"].includes(tag)) return;

    if (["h1", "h2", "h3", "h4"].includes(tag)) {
      const style = tag === "h1" || tag === "h2" ? "h2" : "h3";
      const block = textBlock(el.textContent || "", style);
      if (block) blocks.push(block);
      return;
    }

    if (tag === "p" || tag === "blockquote") {
      const block = textBlock(
        el.textContent || "",
        tag === "blockquote" ? "blockquote" : "normal",
      );
      if (block) blocks.push(block);
      return;
    }

    if (tag === "li") {
      const block = textBlock(el.textContent || "");
      if (block) {
        block.listItem = "bullet";
        blocks.push(block);
      }
      return;
    }

    if (tag === "br") return;

    for (const child of Array.from(el.children)) {
      pushFromElement(child);
    }

    if (el.children.length === 0) {
      const block = textBlock(el.textContent || "");
      if (block) blocks.push(block);
    }
  };

  for (const child of Array.from(body.children)) {
    pushFromElement(child);
  }

  if (blocks.length === 0) {
    const block = textBlock(body.textContent || "");
    if (block) blocks.push(block);
  }

  return blocks;
}

async function wpJson<T>(path: string): Promise<T> {
  const res = await fetch(`${WP_API}${path}`);
  if (!res.ok) {
    throw new Error(`WP ${path} → ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTML ${url} → ${res.status}`);
  return res.text();
}

async function uploadMedia(wpId: number): Promise<string | null> {
  if (mediaCache.has(wpId)) return mediaCache.get(wpId)!;

  type Media = {
    id: number;
    source_url: string;
    mime_type: string;
    alt_text?: string;
    title?: { rendered?: string };
  };

  let media: Media;
  try {
    media = await wpJson<Media>(`/media/${wpId}`);
  } catch {
    console.warn(`  media ${wpId} not found`);
    return null;
  }

  if (!media.mime_type?.startsWith("image/")) {
    console.warn(`  skip non-image media ${wpId} (${media.mime_type})`);
    return null;
  }

  const res = await fetch(media.source_url);
  if (!res.ok) {
    console.warn(`  failed download media ${wpId}`);
    return null;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename =
    media.source_url.split("/").pop()?.split("?")[0] || `wp-${wpId}.jpg`;

  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType: media.mime_type,
  });

  mediaCache.set(wpId, asset._id);
  console.log(`  uploaded media ${wpId} → ${asset._id}`);
  return asset._id;
}

function parseVenue(subtitle: string): { venue?: string; city?: string; infoUrl?: string } {
  const raw = decodeEntities(subtitle).trim();
  if (!raw || /^reserviert$/i.test(raw) || raw === "-") return {};

  const urlMatch = raw.match(/https?:\/\/[^\s)]+/i);
  const wwwMatch = !urlMatch && raw.match(/\bwww\.[^\s)]+/i);
  const infoUrl = urlMatch
    ? urlMatch[0]
    : wwwMatch
      ? `https://${wwwMatch[0]}`
      : undefined;

  let rest = raw
    .replace(urlMatch?.[0] ?? "", "")
    .replace(wwwMatch?.[0] ?? "", "")
    .replace(/\s*[;|]\s*$/, "")
    .trim();

  const comma = rest.lastIndexOf(",");
  if (comma > 0) {
    return {
      venue: rest.slice(0, comma).trim(),
      city: rest.slice(comma + 1).trim(),
      infoUrl,
    };
  }
  return { venue: rest || undefined, infoUrl };
}

function normalizeDatetime(value: string | undefined): string | undefined {
  if (!value) return undefined;
  // EventOn emits "2026-12-4T20:00+2:00" — pad month/day and timezone
  const m = value.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{2})([+-])(\d{1,2}):(\d{2})$/,
  );
  if (!m) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
  }
  const [, y, mo, da, h, mi, sign, tzH, tzM] = m;
  const iso = `${y}-${mo.padStart(2, "0")}-${da.padStart(2, "0")}T${h.padStart(2, "0")}:${mi}${sign}${tzH.padStart(2, "0")}:${tzM}`;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toISOString();
}

async function getVisibleEventIds(): Promise<number[]> {
  const html = await fetchHtml(`${WP_BASE}/calendario/`);
  const ids = [...html.matchAll(/data-event_id="(\d+)"/g)].map((m) =>
    Number(m[1]),
  );
  return [...new Set(ids)];
}

async function migrateEvents() {
  console.log("\n=== Events (visible on calendar) ===");
  const ids = await getVisibleEventIds();
  console.log(`Found ${ids.length} visible event(s): ${ids.join(", ")}`);

  for (const id of ids) {
    type WpEvent = {
      id: number;
      slug: string;
      title: { rendered: string };
      content: { rendered: string };
    };
    const event = await wpJson<WpEvent>(`/ajde_events/${id}`);
    const pageHtml = await fetchHtml(`${WP_BASE}/events/${event.slug}/`);

    const ldMatch = pageHtml.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    );
    let ld: {
      startDate?: string;
      endDate?: string;
      description?: string;
      name?: string;
    } = {};
    if (ldMatch) {
      try {
        ld = JSON.parse(ldMatch[1]);
      } catch {
        /* ignore */
      }
    }

    const subMatch = pageHtml.match(
      /evcal_event_subtitle[^>]*>([\s\S]*?)<\/span>/,
    );
    const subtitle = subMatch ? stripTags(subMatch[1]) : "";
    const { venue, city, infoUrl } = parseVenue(subtitle);

    const start = normalizeDatetime(ld.startDate);
    if (!start) {
      console.warn(`  skip event ${id}: no start date`);
      continue;
    }

    const descriptionHtml =
      event.content?.rendered?.trim() ||
      (ld.description ? `<p>${ld.description}</p>` : "");

    const doc = {
      _id: `wp-event-${id}`,
      _type: "event",
      title: decodeEntities(event.title.rendered),
      slug: { _type: "slug", current: event.slug },
      start,
      end: normalizeDatetime(ld.endDate),
      venue,
      city,
      infoUrl,
      description: descriptionHtml ? htmlToBlocks(descriptionHtml) : [],
    };

    await client.createOrReplace(doc);
    console.log(`  ✓ event ${id} ${doc.title} (${start})`);
  }
}

async function migratePost() {
  console.log("\n=== Post ===");
  type WpPost = {
    id: number;
    slug: string;
    date: string;
    title: { rendered: string };
    excerpt: { rendered: string };
    content: { rendered: string };
  };
  const posts = await wpJson<WpPost[]>(`/posts?per_page=10`);
  for (const post of posts) {
    const slug =
      post.slug === "953" || /^\d+$/.test(post.slug) ? "attualita" : post.slug;
    const doc = {
      _id: `wp-post-${post.id}`,
      _type: "post",
      title: decodeEntities(post.title.rendered),
      slug: { _type: "slug", current: slug },
      publishedAt: new Date(post.date).toISOString(),
      excerpt: stripTags(post.excerpt.rendered),
      body: htmlToBlocks(post.content.rendered),
    };
    await client.createOrReplace(doc);
    console.log(`  ✓ post ${post.id} → /blog/${slug}`);
  }
}

function extractMainHtml(pageHtml: string, slug: string): string {
  const dom = new JSDOM(pageHtml);
  const doc = dom.window.document;

  // Prefer common WP / theme content wrappers
  const candidates = [
    doc.querySelector(".wpb_wrapper"),
    doc.querySelector(".entry-content"),
    doc.querySelector("article .content"),
    doc.querySelector("#content .page"),
    doc.querySelector("main"),
  ].filter(Boolean) as Element[];

  let root = candidates[0] || doc.body;

  // For home, keep it minimal — frontend will redesign
  if (slug === "home") {
    return "<p>Ferruccio Cainero</p>";
  }

  // Calendario: no EventOn dump
  if (slug === "calendario") {
    return "<p>Calendario eventi</p>";
  }

  // Strip nav/footer leftovers if we got body
  for (const sel of [
    "header",
    "nav",
    "footer",
    "script",
    "style",
    ".menu",
    "#masthead",
    ".site-header",
    ".site-footer",
  ]) {
    root.querySelectorAll(sel).forEach((el) => el.remove());
  }

  return root.innerHTML;
}

async function bodyFromPage(
  slug: string,
  path: string,
  restContent: string,
): Promise<PageBlock[]> {
  // Prefer VC shortcodes for structured media when present
  const decoded = decodeEntities(restContent);
  if (slug === "video" && /\[vc_video/.test(decoded)) {
    const blocks: PageBlock[] = [];
    for (const m of decoded.matchAll(/\[vc_video[^\]]*link="([^"]+)"[^\]]*\]/g)) {
      blocks.push({
        _type: "pageVideo",
        _key: key("v"),
        url: decodeEntities(m[1]).replace(/&amp;/g, "&"),
      });
    }
    return blocks;
  }

  if (slug === "foto" && /\[vc_single_image/.test(decoded)) {
    const ids = [
      ...decoded.matchAll(/\[vc_single_image[^\]]*image="(\d+)"/g),
    ].map((m) => Number(m[1]));
    const images: {
      _type: "image";
      _key: string;
      asset: { _type: "reference"; _ref: string };
    }[] = [];
    for (const id of ids) {
      const assetId = await uploadMedia(id);
      if (assetId) {
        images.push({
          _type: "image",
          _key: key("i"),
          asset: { _type: "reference", _ref: assetId },
        });
      }
    }
    if (images.length) {
      return [
        { _type: "pageGallery", _key: key("g"), images },
      ];
    }
  }

  const html = await fetchHtml(`${WP_BASE}${path}`);
  const main = extractMainHtml(html, slug);
  return htmlToBlocks(main);
}

async function migratePages() {
  console.log("\n=== Pages ===");
  type WpPage = {
    id: number;
    slug: string;
    parent: number;
    link: string;
    title: { rendered: string };
    content: { rendered: string };
  };
  const pages = await wpJson<WpPage[]>(
    `/pages?per_page=100&orderby=id&order=asc`,
  );

  // First pass: create without parent
  for (const page of pages) {
    const path = new URL(page.link).pathname;
    const body = await bodyFromPage(page.slug, path, page.content.rendered);
    const doc = {
      _id: `wp-page-${page.id}`,
      _type: "page",
      title: decodeEntities(page.title.rendered),
      slug: { _type: "slug", current: page.slug === "home" ? "home" : page.slug },
      body,
    };
    await client.createOrReplace(doc);
    console.log(`  ✓ page ${page.id} ${page.slug} (${body.length} blocks)`);
  }

  // Second pass: parents
  for (const page of pages) {
    if (!page.parent) continue;
    await client
      .patch(`wp-page-${page.id}`)
      .set({
        parent: {
          _type: "reference",
          _ref: `wp-page-${page.parent}`,
        },
      })
      .commit();
    console.log(`  ✓ parent ${page.slug} → wp-page-${page.parent}`);
  }
}

async function migrateSettings() {
  console.log("\n=== Site settings ===");

  const nav: {
    _type: "navItem";
    _key: string;
    label: string;
    linkType: string;
    page?: { _type: "reference"; _ref: string };
  }[] = [
    { _key: key("n"), _type: "navItem", label: "HOME", linkType: "page", page: { _type: "reference", _ref: "wp-page-7" } },
    { _key: key("n"), _type: "navItem", label: "CALENDARIO", linkType: "calendar" },
    { _key: key("n"), _type: "navItem", label: "PODCAST", linkType: "page", page: { _type: "reference", _ref: "wp-page-562" } },
    { _key: key("n"), _type: "navItem", label: "TEATRO / THEATER", linkType: "page", page: { _type: "reference", _ref: "wp-page-162" } },
    { _key: key("n"), _type: "navItem", label: "REGIA / REGIE", linkType: "page", page: { _type: "reference", _ref: "wp-page-372" } },
    { _key: key("n"), _type: "navItem", label: "RADIO", linkType: "page", page: { _type: "reference", _ref: "wp-page-168" } },
    { _key: key("n"), _type: "navItem", label: "BIO", linkType: "page", page: { _type: "reference", _ref: "wp-page-110" } },
    { _key: key("n"), _type: "navItem", label: "PREMI / AUSZEICHNUNGEN", linkType: "page", page: { _type: "reference", _ref: "wp-page-210" } },
    { _key: key("n"), _type: "navItem", label: "RECENSIONI", linkType: "page", page: { _type: "reference", _ref: "wp-page-213" } },
    { _key: key("n"), _type: "navItem", label: "FOTO", linkType: "page", page: { _type: "reference", _ref: "wp-page-204" } },
    { _key: key("n"), _type: "navItem", label: "VIDEO", linkType: "page", page: { _type: "reference", _ref: "wp-page-207" } },
    { _key: key("n"), _type: "navItem", label: "VERANSTALTERBOX", linkType: "page", page: { _type: "reference", _ref: "wp-page-1004" } },
    { _key: key("n"), _type: "navItem", label: "CONTACT", linkType: "contact" },
  ];

  // Pull contact text hints
  const contact = await wpJson<{ content: { rendered: string } }>(`/pages/15`);
  const contactText = stripTags(decodeEntities(contact.content.rendered));
  const emailMatch = contactText.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  );
  const phoneMatch = contactText.match(
    /(?:\+|00)?[\d\s().-]{8,}/,
  );

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    title: "Ferruccio Cainero",
    navigation: nav,
    footerText: "Ferruccio Cainero",
    email: emailMatch?.[0],
    phone: phoneMatch?.[0]?.trim(),
  });
  console.log("  ✓ siteSettings");
}

async function main() {
  console.log(`Migrating → Sanity project ${projectId} / ${dataset}`);
  await migrateEvents();
  await migratePost();
  await migratePages();
  await migrateSettings();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
