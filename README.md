# Ferruccio Cainero — website

Next.js rebuild of [ferrucciocainero.ch](https://ferrucciocainero.ch).

Content is managed in [Sanity](https://www.sanity.io/) (free plan). The editor UI lives at `/admin`. The site is deployed on Vercel.

## Stack

- Next.js (App Router, TypeScript, Tailwind CSS)
- Sanity CMS (embedded Studio at `/admin`)
- Vercel hosting
- Resend (contact form — not yet wired)

## Getting started

```bash
npm install
cp .env.example .env.local
# Fill Sanity project id, dataset, and tokens as needed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the site, or [http://localhost:3000/admin](http://localhost:3000/admin) for the content editor.

## Docs

- [WordPress migration mapping](docs/wordpress-migration-mapping.md)
- [Client how-to (Italian)](docs/client-howto.md)
- [Vercel deploy + DNS](docs/deploy-vercel.md)

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name (`production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version date |
| `SANITY_API_READ_TOKEN` | Read token (draft / Presentation) |
| `SANITY_API_WRITE_TOKEN` | Write token (migration script only) |
| `SANITY_REVALIDATE_SECRET` | Shared secret for the publish webhook |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run migrate:wp` | Import WordPress content into Sanity |

## Roadmap status

1. Scaffold — done  
2. GitHub — done  
3. Sanity Studio at `/admin` — done  
4. Content schemas — done  
5. WordPress analysis — done  
6. Migration — done  
7. Base layout — done  
8. Home + pages — done  
9. Blog — done  
10. Calendar — done  
11. Contact form — **skipped for now** (page text still works)  
12. Vercel — see [docs/deploy-vercel.md](docs/deploy-vercel.md) (you connect the account)  
13. On-demand revalidation — done (`/api/revalidate`)  
14. Draft Mode + Presentation — done  
15. SEO + redirects — done  
16. Client handover guide — done  
17. Go-live DNS — manual (see deploy doc)  
