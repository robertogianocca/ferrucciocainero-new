# Deploy su Vercel + go-live

## 1. Collega il repository

1. Vai su [vercel.com](https://vercel.com) e accedi
2. **Add New → Project** → importa `robertogianocca/ferrucciocainero-new`
3. Framework: Next.js (rilevato automaticamente)
4. Aggiungi le environment variables (Production + Preview):

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `4wreifu3` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2025-01-01` |
| `NEXT_PUBLIC_SITE_URL` | URL Vercel prima, poi `https://ferrucciocainero.ch` |
| `SANITY_API_READ_TOKEN` | Token Viewer/Editor (per draft mode) |
| `SANITY_REVALIDATE_SECRET` | Stringa casuale lunga (stessa usata nel webhook Sanity) |

5. Deploy

## 2. CORS Sanity

In [sanity.io/manage](https://www.sanity.io/manage) → project → API → CORS origins, aggiungi:

- `https://<tuo-progetto>.vercel.app`
- `https://ferrucciocainero.ch` (dopo DNS)
- `http://localhost:3000` (già fatto)

Consenti credentials.

## 3. Webhook revalidate

Sanity → API → Webhooks → Create:

- URL: `https://<dominio>/api/revalidate`
- Trigger: Create / Update / Delete
- Projection (opzionale): `{_type, "slug": slug.current}`
- Secret: stesso valore di `SANITY_REVALIDATE_SECRET`
- Dataset: `production`

## 4. DNS (go-live)

1. Su Vercel: Project → Domains → aggiungi `ferrucciocainero.ch` (+ `www` se serve)
2. Dal registrar del dominio, punta i record come indicato da Vercel
3. Tieni WordPress su un sottodominio di backup per qualche settimana (es. `old.ferrucciocainero.ch`)

## 5. Invita il cliente

Sanity → Project → Members → invita come **Editor**.  
Consegna [client-howto.md](./client-howto.md).
