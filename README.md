<p align="center">
  <img src="public/images/banner-non-bg.png" alt="Farm Intelligence logo" width="360" />
</p>

# 🌱 Farm Intelligence

> An interactive farm management and field intelligence platform built for modern agricultural operations.

Farm Intelligence is a frontend-focused agricultural management platform that
combines geospatial visualization, farm field management, environmental data,
and AI-assisted insights into a single dashboard.

The project is designed around a realistic farm workflow: users can locate
their farm, define field boundaries, monitor field conditions, and eventually
connect real sensor/GPS data to visualize crop health and generate actionable
recommendations.

## ✨ Preview

Farm Intelligence provides a dark, data-driven dashboard designed for
monitoring agricultural operations at a glance.

![Farm Intelligence dashboard preview](public/images/banner1.png)

### Core experience

- 🗺️ Interactive satellite farm map
- 🌾 Field boundary visualization
- 📍 Geographic field management
- 📊 Crop and field monitoring
- 🌡️ Weather and environmental conditions
- 💧 Soil moisture and resource monitoring
- 🧠 AI-assisted farm insights
- 📈 Field performance analytics
- ⚡ Responsive dashboard experience

---

## 🎯 Product Vision

Farm data is often distributed across different systems:

- GPS devices
- Satellite or drone imagery
- Weather services
- Soil sensors
- Farm management software
- Manual field records

Farm Intelligence aims to bring these data sources together into a unified
interface.

Instead of treating the map as a simple background, the application treats
each agricultural field as a geographic entity with its own data, health
status, crop information, and operational history.

### Example workflow

```text
Farm Location
      ↓
Satellite / Aerial Imagery
      ↓
Define Field Boundary
      ↓
Field + Crop Information
      ↓
Environmental / Sensor Data
      ↓
Health Visualization
      ↓
AI-assisted Analysis
      ↓
Farm Management Dashboard
```

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · shadcn/ui (Radix) · Lucide · TanStack Query · Recharts |
| Map | MapLibre GL JS + [MapTiler](https://www.maptiler.com) satellite tiles |
| Backend | Next.js Route Handlers · Zod |
| Database | PostgreSQL via Prisma ORM |
| External APIs | [Open-Meteo](https://open-meteo.com) (weather + geocoding, no API key) |
| AI | Vercel AI SDK (`ai` + `@ai-sdk/react`), pluggable Anthropic or OpenAI provider |
| Deployment | Vercel |

## 🚀 Getting Started

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

The AI assistant is optional — see **AI assistant** below.
The Farm Map needs a free MapTiler key — see **Farm Map** below.

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

Open [http://localhost:3000](http://localhost:3000). Weather and location
search work immediately (they call Open-Meteo directly, no key required) —
the field/resource/yield panels populate once the database is migrated and
seeded, and the satellite map needs a MapTiler key (below).

## 🗺️ Farm Map

The map (satellite imagery, field boundaries, hover/selection highlighting,
a health heatmap on the selected field, and field labels) is a standalone
component (`src/components/map/farm-map.tsx`) backed by
[MapLibre GL JS](https://maplibre.org) + [MapTiler](https://www.maptiler.com)
satellite tiles. It renders with built-in mock field data even with no
database configured — `DashboardShell` overrides it with real DB-backed fields.

To enable live tiles:

```bash
NEXT_PUBLIC_MAPTILER_KEY="your-key-here"
```

Get a free key at [cloud.maptiler.com/account/keys](https://cloud.maptiler.com/account/keys/)
(no credit card required). Without it, the map card shows a clear "missing
key" message instead of a broken map — the rest of the dashboard is
unaffected.

## 🧠 AI assistant (optional)

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

## 📜 Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm run start` | Production build / run |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Apply Prisma migrations (dev) |
| `npm run db:seed` | Re-seed demo data |
| `npm run db:studio` | Open Prisma Studio to browse the database |

## ☁️ Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Add a Postgres integration (Vercel Postgres or Neon) or paste an existing
   `DATABASE_URL` into the project's environment variables.
3. Add `NEXT_PUBLIC_MAPTILER_KEY` for the live satellite map, and
   `AI_PROVIDER` + the matching API key if you want the assistant live.
4. Deploy. `prisma generate` runs automatically via the `postinstall` script.
5. Run migrations against the production database once
   (`npx prisma migrate deploy`, with `DATABASE_URL` pointed at production),
   then `npx prisma db seed` if you want the demo data live too.

Weather/geocoding go through Open-Meteo's free, key-less API in every
environment — no setup needed there.
