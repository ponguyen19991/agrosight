# AgroSight — Smart Farm Monitoring

A map-first smart farm monitoring dashboard built as a single full-stack Next.js
app: live field boundaries on an interactive map, per-field health scores,
live weather, resource allocation, a weekly activity heatmap, a yield trend,
and an optional AI farm assistant.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · shadcn/ui (Radix) · Lucide · TanStack Query · Recharts |
| Map | MapLibre GL JS ([OpenFreeMap](https://openfreemap.org) tiles — no API key) |
| Backend | Next.js Route Handlers · Zod |
| Database | PostgreSQL via Prisma ORM |
| External APIs | [Open-Meteo](https://open-meteo.com) (weather + geocoding, no API key) |
| AI | Vercel AI SDK (`ai` + `@ai-sdk/react`), pluggable Anthropic or OpenAI provider |
| Deployment | Vercel |

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in `DATABASE_URL`:

```bash
cp .env.example .env
```

You need a PostgreSQL database. The fastest free options:

- [Neon](https://neon.tech) — free serverless Postgres, copy the connection string it gives you.
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) — provision from your Vercel project's Storage tab.
- A local Postgres install — `postgresql://postgres:password@localhost:5432/agrosight`.

The AI assistant is optional — see [AI assistant](#ai-assistant-optional) below.

### 3. Create the schema and seed demo data

```bash
npm run db:migrate   # creates tables from prisma/schema.prisma
npm run db:seed       # seeds one demo farm with 5 fields, resource allocations,
                       # a week of activity logs, and 6 months of yield records
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The map, weather, and
location search all work immediately (they call Open-Meteo directly, no key
required) — the field/resource/yield panels populate once the database is
migrated and seeded.

## AI assistant (optional)

The sidebar's sparkle icon opens a chat panel backed by the Vercel AI SDK. It
reads live field data from the database and streams answers about field
health, irrigation, etc. To enable it, set in `.env`:

```bash
AI_PROVIDER="anthropic"        # or "openai"
ANTHROPIC_API_KEY="sk-ant-..."  # or OPENAI_API_KEY
```

Without a key, the chat panel stays visible but shows a clear "not
configured" message instead of erroring — the rest of the dashboard is
unaffected.

## Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm run start` | Production build / run |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Apply Prisma migrations (dev) |
| `npm run db:seed` | Re-seed demo data |
| `npm run db:studio` | Open Prisma Studio to browse the database |

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Add a Postgres integration (Vercel Postgres or Neon) or paste an existing
   `DATABASE_URL` into the project's environment variables.
3. Add `AI_PROVIDER` and the matching API key if you want the assistant live.
4. Deploy. `prisma generate` runs automatically via the `postinstall` script.
5. Run migrations against the production database once
   (`npx prisma migrate deploy`, with `DATABASE_URL` pointed at production),
   then `npx prisma db seed` if you want the demo data live too.

No map or weather API key is required in any environment — MapLibre uses
OpenFreeMap's free vector tiles and weather/geocoding go through Open-Meteo's
free, key-less API.
