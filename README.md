# Ferruccio Cainero — website

Next.js rebuild of [ferrucciocainero.ch](https://ferrucciocainero.ch).

Content is managed in [Sanity](https://www.sanity.io/) (free plan). The editor UI will live at `/studio`. The site is deployed on Vercel.

## Stack

- Next.js (App Router, TypeScript, Tailwind CSS)
- Sanity CMS (embedded Studio)
- Vercel hosting
- Resend (contact form email)

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values as each step of the migration is completed. Never commit `.env.local`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name (`production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version date |
| `SANITY_API_READ_TOKEN` | Read token (drafts / visual editing) |
| `SANITY_REVALIDATE_SECRET` | Shared secret for the publish webhook |
| `RESEND_API_KEY` | Resend API key for the contact form |
| `CONTACT_FROM_EMAIL` | Sender address (verified in Resend) |
| `CONTACT_TO_EMAIL` | Inbox that receives form submissions |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Roadmap

1. Scaffold (this step)
2. GitHub repository
3. Sanity project + Studio at `/studio`
4. Content schemas (events, posts, pages, settings)
5. WordPress content analysis
6. Migration from WordPress
7. Base layout (header, footer, nav)
8. Home + generic pages
9. Blog
10. Calendar
11. Contact form
12. Vercel deploy
13. On-demand revalidation
14. Visual editing
15. SEO + redirects
16. Client handover
17. Go-live (DNS)
