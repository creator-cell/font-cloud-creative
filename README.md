# Front Cloud Creative

A full-stack, multi-provider AI content platform. One workspace unlocks OpenAI, Anthropic, Google Gemini, and Ollama with plan-based gating, Stripe billing, and brand-voice aware prompting.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn-inspired UI primitives, React Hook Form, Zod.
- **Backend**: Express + TypeScript, Mongoose (MongoDB), Redis (rate limiting), Stripe billing.
- **Auth**: NextAuth (Email magic link + Google OAuth) with JWT bridge to the API service.
- **LLM Providers**: OpenAI adapter implemented, stubs for Anthropic & Google, Ollama via HTTP.

## Repo Layout

```
apps/
  api/      # Express service
  web/      # Next.js application
```

## Getting Started

### Prerequisites

- Node.js 18.17+
- pnpm 8.15+
- Docker (for MongoDB, Redis, optional service containers)
- Stripe CLI (for webhook forwarding during development)

### Setup

```bash
pnpm install
cp apps/api/.env.example apps/api/.env.local
cp apps/web/.env.example apps/web/.env.local
```


To bootstrap plan definitions and an initial owner account set `SEED_OWNER_EMAIL` and run:

```bash
SEED_OWNER_EMAIL=founder@example.com pnpm --filter front-cloud-creative-api seed
```

Populate the `.env.local` files with real secrets:

- `apps/api/.env.local`: database URLs, provider keys, Stripe keys, JWT secret.
- `apps/web/.env.local`: NextAuth secret, email SMTP server, Google OAuth, Stripe publishable key.

### Local Services

```bash
docker-compose up -d mongo redis
```

Run the API and web apps in separate terminals:

```bash
pnpm --filter front-cloud-creative-api dev
pnpm --filter front-cloud-creative-web dev
```

The API listens on `http://localhost:4000`, the web app on `http://localhost:3000`.

### Stripe Webhooks

Forward webhooks so subscriptions stay in sync:

```bash
stripe listen --forward-to localhost:4000/webhooks/stripe
```

### Tests

```bash
pnpm --filter front-cloud-creative-api test
```

The API ship includes Vitest coverage for the prompt builder and usage counter logic.

### Docker

Each app ships a Dockerfile. To build the full stack (API + web + dependencies):

```bash
docker-compose up --build
```

## Key Features

- Runtime provider selection with plan-aware gating and defaults cascade.
- Plan enforcement: token quotas, watermarks for free tier, Stripe upgrades.
- Brand voice builder that converts samples into reusable style cards.
- Generation pipeline: prompt templating, JSON validation, safety checks, persistence.
- Usage insights in both API and dashboard with upgrade nudges.


### Admin Portal

- Role-based access with owner/admin/analyst/support/billing scopes.
- Metrics dashboard with DAU/WAU/MAU, revenue KPIs, token burn visualisations.
- User management tools (plan upgrades, token grants, throttling).
- Feature flags, plan editor, provider registry viewer, announcements, and support ticket inbox.

## Development Notes

- Provider stubs (Anthropic, Google) throw until configured—OpenAI + Ollama work out of the box.
- Update `env.defaults` in `apps/api/.env.local` to change the system default provider/model.
- The Next.js app expects the API JWT from `/auth/token`; ensure NextAuth sign-in completes before using the dashboard.

Happy shipping!
