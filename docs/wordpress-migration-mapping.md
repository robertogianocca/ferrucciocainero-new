# WordPress → Sanity migration mapping

Source: [ferrucciocainero.ch](https://ferrucciocainero.ch) REST API + rendered HTML (analyzed Oct 2026).

## Inventory

| Source | Count | Notes |
| --- | --- | --- |
| Pages (`wp/v2/pages`) | 15 | Hierarchical; Visual Composer shortcodes in REST |
| Posts (`wp/v2/posts`) | 1 | “Attualità” (`id` 953) |
| Events (`wp/v2/ajde_events`) | 99 in WP | **Import only events visible on `/calendario/`** (currently 3: `1173`, `1174`, `1179`) |
| Event types (`event_type`) | 0 | Taxonomy unused |
| Media (`wp/v2/media`) | 91 | Import on demand (images referenced by pages), not the full library |

## Critical API limitations

1. **EventOn meta is not exposed** on `wp/v2/ajde_events` (`meta: []`). Start/end and venue live in plugin post meta only.
2. **Page bodies in REST are unrendered Visual Composer shortcodes** (`[vc_row]`, `[vc_column_text]`, `[vc_single_image]`, `[vc_video]`, …), not HTML.
3. **Home page REST content is empty**; the public homepage still has content (scrape HTML).
4. **No menus REST route**; nav must be taken from the live site HTML (or hardcoded from the table below).

## Events → `event` / `eventType`

### Fetch strategy (Step 6)

**Scope: only events currently listed on the public calendar page** — not the full EventOn archive of 99.

1. Scrape `https://www.ferrucciocainero.ch/calendario/` for `data-event_id` values (currently `1173`, `1174`, `1179`).
2. For each id, `GET /wp-json/wp/v2/ajde_events/{id}` for title/slug/content.
3. `GET https://www.ferrucciocainero.ch/events/{slug}/` and parse:
   - **JSON-LD** (`application/ld+json`, `@type: Event`) → `startDate`, `endDate`, `name`, `url`, `description`
   - **Subtitle** (`.evcal_event_subtitle`) → venue/city string
   - Optional: `data-time="{unixStart}-{unixEnd}"` as a fallback for timestamps

Do **not** rely on `eventon/v1/data` or public REST `meta`. Do **not** bulk-import past events; the client adds new ones in `/admin`.

### Field map

| WordPress / scrape | Sanity `event` |
| --- | --- |
| `title.rendered` | `title` |
| `slug` | `slug.current` |
| JSON-LD `startDate` | `start` (ISO datetime; note timezone like `+2:00`) |
| JSON-LD `endDate` | `end` |
| Subtitle (full string) | `venue` (keep full string if split is ambiguous) |
| Subtitle after last `,` | `city` (best-effort parse) |
| REST `content.rendered` or JSON-LD `description` | `description` (HTML → Portable Text) |
| `featured_media` | `image` (currently **always 0** on this site) |
| — | `infoUrl` (extract first `http(s)` URL from subtitle/content if present) |
| `event_type` terms | `eventType` ref — **none in use**; skip or create later manually |

### Sample subtitle patterns

- `Urwaldhaus - Wirtschaft Bären , Rehetobel` → venue + city
- `Freulerpalast, Näfels`
- `reserviert` / empty → no location
- `Erzählfestival Graz  ;  www.storrytellingfestival.at` → venue + possible `infoUrl`

Stable Sanity document ids: `wp-event-{id}` (e.g. `wp-event-1179`).

## Posts → `post`

Only **one** published post.

| WordPress | Sanity `post` |
| --- | --- |
| `title.rendered` | `title` |
| `slug` (`953`) | `slug.current` (consider renaming to `attualita` after import) |
| `date` / `date_gmt` | `publishedAt` |
| `excerpt.rendered` | `excerpt` (strip HTML) |
| `content.rendered` | `body` (HTML → Portable Text) |
| `featured_media` | `coverImage` (0 on this post) |

URL today: `/2024/07/09/953/` → new site can use `/blog/attualita` (or `/attualita`) with a redirect.

Stable id: `wp-post-953`.

## Pages → `page`

### Hierarchy (parent WP id → slug)

| ID | Slug | Parent | Public path |
| --- | --- | --- | --- |
| 7 | home | — | `/` |
| 15 | contact | — | `/contact` |
| 110 | biography | — | `/biography` |
| 213 | recensioni | 110 | `/biography/recensioni` |
| 159 | attivita | — | `/attivita` |
| 162 | teatro | 159 | `/attivita/teatro` |
| 168 | radio | 159 | `/attivita/radio` |
| 372 | regia-regie | 159 | `/attivita/regia-regie` |
| 176 | media | — | `/media` |
| 204 | foto | 176 | `/media/foto` |
| 207 | video | 176 | `/media/video` |
| 184 | calendario | — | `/calendario` |
| 210 | premi | — | `/premi` |
| 562 | podcast | — | `/podcast` |
| 1004 | veranstalterbox | — | `/veranstalterbox` |

### Fetch strategy

- Prefer **rendered HTML** from the public URL (shortcodes already expanded).
- Fallback: parse VC shortcodes from REST for structured blocks:
  - `[vc_column_text]…[/vc_column_text]` → Portable Text
  - `[vc_single_image image="{id}"]` → `pageImage` (resolve via `wp/v2/media/{id}`)
  - `[vc_video link="{url}"]` → `pageVideo`
  - Foto page also uses `[vc_raw_html]` (base64) for download links → keep as links in text or skip downloads in v1

### Special cases

| Page | Migration approach |
| --- | --- |
| `home` | Scrape homepage; or leave minimal and design in frontend (Step 8) |
| `calendario` | **Do not** import EventOn HTML as page body; Next.js calendar route will query Sanity events |
| `contact` | Import address text into page or `siteSettings`; form is Step 11 (Resend) |
| `foto` | Import as gallery of `pageImage` / `pageGallery` from image IDs |
| `video` | Import as series of `pageVideo` from Vimeo/YouTube links |

Stable ids: `wp-page-{id}`. Set `parent` references after all pages exist.

## Media → Sanity assets

| WordPress | Sanity |
| --- | --- |
| `source_url` | Upload via `@sanity/client.assets.upload` |
| `alt_text` / `title` | Image `alt` |
| `mime_type` | Images → asset; PDFs → file asset or linked URL |

Keep a map `wpMediaId → sanityAssetId` for resolving `vc_single_image` and featured images.

## Navigation → `siteSettings`

No WP menus API. Mirror the live header:

1. HOME → `/` (or home page)
2. CALENDARIO → calendar route
3. PODCAST → page `podcast`
4. TEATRO / THEATER → page `teatro`
5. REGIA / REGIE → page `regia-regie`
6. RADIO → page `radio`
7. BIO → page `biography`
8. PREMI / AUSZEICHNUNGEN → page `premi`
9. RECENSIONI → page `recensioni`
10. FOTO → page `foto`
11. VIDEO → page `video`
12. VERANSTALTERBOX → page `veranstalterbox`
13. CONTACT → contact route / page

Also seed `siteSettings` contact fields from the contact page text (ArteCultura / phone / email when present).

## Redirects (for Step 15)

Preserve at least:

- `/events/{slug}/` → calendar event detail or `/calendario#{slug}` (decide in Step 10)
- `/2024/07/09/953/` → new blog URL
- Existing page paths above (same slugs where possible)

## Step 6 script outline

`scripts/migrate-wp.ts` should:

1. Load env (`SANITY_API_WRITE_TOKEN` + WP base URL).
2. Import media referenced by pages → asset map (not all 91).
3. Import **visible calendar events only** (scrape calendario + event HTML).
4. Import the single post.
5. Import pages (rendered HTML → Portable Text / blocks), wire `parent`.
6. Upsert `siteSettings` singleton (`documentId: siteSettings`).
7. Be idempotent via stable `_id`s (`wp-*`).

Required packages for Step 6: `@sanity/client`, `@portabletext/block-tools`, `jsdom`, `dotenv`, `tsx`.

## Sanity CORS reminder

Local Studio: allow `http://localhost:3000` (credentials) on project `4wreifu3`.
