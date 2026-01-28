# Kashio

Kashio is a full-stack expense tracking app with natural-language logging, built on Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Drizzle ORM + PostgreSQL, and Better Auth.

## Features

- Natural-language expense entry and dashboard
- Email/password and OAuth authentication (GitHub, Google)
- API-first mutations with App Router routes
- Drizzle ORM schema + migrations

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Drizzle ORM + PostgreSQL
- Better Auth

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env.local`:

```bash
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="random-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Optional OAuth providers
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Common Commands

```bash
# Development
npm run dev

# Database
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:studio

# Production
npm run build
npm run start
npm run lint
```

## Project Structure

```
app/
  api/auth/[...all]/route.ts   # Better Auth catch-all API
  api/changelog/route.ts       # Changelog API
  page.tsx                     # Landing page (public)
  home/page.tsx                # Dashboard (protected)
  login/page.tsx               # Login page
  signup/page.tsx              # Signup page
  changelog/page.tsx           # Changelog page
components/
  auth/                        # Auth UI
  home/                        # Dashboard UI
  landing/                     # Landing sections
  ui/                          # Reusable UI primitives
lib/
  auth.ts                      # Better Auth server config
  auth-client.ts               # Better Auth React client
  db.ts                        # Drizzle + pg connection
  schema.ts                    # App + auth schema
```

## Database Notes

- Update schema in `lib/schema.ts` (or `lib/auth-schema.ts`)
- Generate migrations with `npm run db:generate`
- Apply migrations with `npm run db:migrate`
- Use `npm run db:push` for development-only sync

## Authentication Notes

Auth is centralized across:

- `lib/auth.ts` (server config)
- `lib/auth-client.ts` (client)
- `app/api/auth/[...all]/route.ts` (API routes)
- `components/auth/auth-form.tsx` (UI)

## Deployment

Use any Node/Next.js-compatible host. Ensure environment variables are set in your hosting provider.

## License

MIT
