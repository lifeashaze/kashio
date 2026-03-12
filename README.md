<div align="center">

<img src="./app/favicon.ico" alt="Kashio logo" width="72" />

# Kashio

**AI-native expense tracking for web, voice, and Telegram**

Type what you spent, speak it out loud, or message a bot. Kashio turns natural language into structured expenses, keeps your budget in view, and lets you ask questions about your spending history.

[Overview](#overview) | [Features](#features) | [Getting Started](#getting-started) | [Telegram](#telegram) | [Demo Data](#demo-data) | [Project Structure](#project-structure)

</div>

## Overview

Kashio is a full-stack expense tracker built with Next.js 16, React 19, Better Auth, Drizzle ORM, PostgreSQL, and Groq-powered AI workflows.

It is designed around a simple interaction model:

- Enter expenses in plain English like `coffee $6` or `uber to airport $42 yesterday`
- Use voice input for both expense logging and expense-aware chat
- Review low-confidence AI parses before saving
- Explore spending analytics, budget progress, and category breakdowns
- Ask follow-up questions like "How much did I spend on food last month?"
- Log expenses and ask the same questions from Telegram

## Features

- **Natural-language expense capture** with structured parsing for amount, category, description, and date
- **Voice transcription** for hands-free expense entry and chat input
- **AI spending assistant** with streaming answers grounded in the user's expense history
- **Analytics dashboard** with monthly, yearly, and custom date ranges
- **Budget and preferences** including currency, timezone, date format, and enabled categories
- **Authentication** with email/password plus optional GitHub and Google OAuth
- **Telegram bot integration** with secure account linking and inline confirmation flows
- **Demo data tooling** for seeding a realistic multi-month expense history

## Tech Stack

| Area | Stack |
| --- | --- |
| App | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, Radix UI, shadcn/ui, Recharts |
| Data | PostgreSQL, Drizzle ORM, Drizzle Kit |
| Auth | Better Auth |
| AI | Groq, Vercel AI SDK, Zod |
| State | TanStack Query |
| Tooling | Bun, ESLint |

## Getting Started

### Prerequisites

- Node.js 20+
- Bun 1.x recommended
- PostgreSQL
- A Groq API key

> [!NOTE]
> The app itself is a standard Next.js project, but some helper scripts in this repo (`db:reset`, `seed:demo`, `reset:demo`) run through Bun.

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kashio"
BETTER_AUTH_SECRET="replace-with-a-random-secret"
BETTER_AUTH_URL="http://localhost:3000"
GROQ_API_KEY="your-groq-api-key"
RESEND_API_KEY=""
AUTH_FROM_EMAIL="Kashio <auth@example.com>"

# Optional OAuth
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional Telegram integration
TELEGRAM_BOT_TOKEN=""
TELEGRAM_BOT_USERNAME=""
TELEGRAM_WEBHOOK_SECRET=""
APP_BASE_URL="http://localhost:3000"
```

> [!IMPORTANT]
> The standalone `telegram:webhook:set` script reads environment variables from the shell or `.env`. If you only keep secrets in `.env.local`, export them before running that script or duplicate them into `.env`.

### 3. Initialize the database

If you want to apply the checked-in migrations:

```bash
bun run db:migrate
```

For quick local schema sync during development:

```bash
bun run db:push
```

### 4. Start the app

```bash
bun run dev
```

Open `http://localhost:3000`.

## Scripts

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the local Next.js app |
| `bun run build` | Build for production |
| `bun run start` | Run the production build |
| `bun run lint` | Run ESLint |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Apply migrations |
| `bun run db:push` | Push schema changes directly to PostgreSQL |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:reset` | Clear the database after confirmation |
| `bun run seed:demo` | Create a demo account and seed realistic expenses |
| `bun run reset:demo` | Remove demo account expenses |
| `bun run telegram:webhook:set -- https://your-public-url.example.com` | Register the Telegram webhook |

## Telegram

Kashio can log expenses and answer spending questions directly from Telegram.

### Setup

1. Create a bot with `@BotFather`
2. Set `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `TELEGRAM_WEBHOOK_SECRET`, and `APP_BASE_URL`
3. Expose your app with a public URL
4. Register the webhook:

```bash
bun run telegram:webhook:set -- https://your-public-url.example.com
```

5. In Kashio, open **Profile > Integrations** and connect your Telegram account

### What the bot supports

- Logging expenses from plain text messages
- Asking spending questions using the same assistant context as the web app
- Reviewing low-confidence parses with inline confirm, edit, and category actions

## Demo Data

This repo includes scripts for spinning up a realistic demo account with roughly six months of expenses.

```bash
bun run seed:demo
```

The script will create or reuse:

- Email: `demo@kashio.app`
- Password: `demo1234!`

To clear only the demo expenses:

```bash
bun run reset:demo
```

To reseed from scratch:

```bash
bun scripts/seed-demo.ts --reset
```

> [!NOTE]
> The demo scripts expect the app to be running locally at `BETTER_AUTH_URL`, because they authenticate through the app's Better Auth endpoints before writing demo data.

## Project Structure

```text
app/         App Router pages and API routes
components/  UI, feature components, charts, forms, and landing page sections
lib/         Auth, database, hooks, AI services, Telegram logic, and shared utilities
drizzle/     SQL migrations and Drizzle metadata
scripts/     Database, demo, and Telegram helper scripts
```

For a more detailed breakdown of routes, tables, and service boundaries, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Deployment

Kashio can be deployed to any Next.js-compatible platform. The repository already includes a minimal [Vercel config](./vercel.json), and the same environment variables used locally should be configured in your hosting provider.

If you enable Telegram, make sure:

- `APP_BASE_URL` points to the public app URL
- the webhook is registered against that deployed URL
- `TELEGRAM_WEBHOOK_SECRET` matches the value used by Telegram webhook requests

If you use email/password auth in production, also configure:

- `RESEND_API_KEY` for auth email delivery
- `AUTH_FROM_EMAIL` for the sender shown on verification and reset emails

In local development, Kashio falls back to logging auth email links to the server console when those email env vars are missing.
