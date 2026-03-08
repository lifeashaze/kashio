# Kashio Architecture

## AI Models (all via Groq)

| Purpose | Model | API Route |
|---|---|---|
| Voice transcription | `whisper-large-v3-turbo` | `/api/transcribe` |
| Expense parsing | `moonshotai/kimi-k2-instruct-0905` | `/api/parse-expense` |
| Chat assistant | `moonshotai/kimi-k2-instruct-0905` | `/api/chat` |

---

## Pages

```
Landing (/)              - public, server component
Home (/home)             - protected dashboard
Chat (/chat)             - AI chat with expense context
Analytics (/analytics)   - charts and spending breakdowns
Profile (/profile)       - user settings, preferences
Onboarding (/onboarding) - multi-step setup wizard
Changelog (/changelog)   - public
```

---

## API Routes

```
/api/auth/[...all]       - Better Auth catchall (OAuth, email/password)
/api/transcribe          - Groq Whisper transcription
/api/parse-expense       - AI expense parsing (structured output via Zod)
/api/expenses            - GET (list), POST (create)
/api/expenses/[id]       - PUT, DELETE
/api/chat                - Streaming chat with expense context
/api/changelog           - Changelog CRUD
/api/user/preferences    - User settings
/api/user/onboarding     - Onboarding state
```

---

## Database (PostgreSQL + Drizzle ORM)

### Tables

**`expenses`**
- `id` UUID primary key
- `userId` text (references auth user)
- `amount` numeric(10,2)
- `description` text
- `category` text (food, transport, entertainment, shopping, bills, health, groceries, travel, education, other)
- `date` date
- `rawInput` original natural language text
- `createdAt` timestamp

**`userPreferences`**
- `userId` text (primary key)
- `monthlyBudget` numeric(10,2)
- `currency` text (default: USD)
- `timezone` text (default: America/Los_Angeles)
- `language` text (default: en)
- `dateFormat` text (default: MM/DD/YYYY)
- `enabledCategories` text[]
- `createdAt`, `updatedAt` timestamps

**`changelog`**
- `id` UUID primary key
- `date` timestamp
- `content` text
- `createdAt` timestamp

**Better Auth tables**: user, session, account, verification

---

## Key Patterns

### Two-Tier Expense Validation

AI returns `isValidExpense`, `confidence`, `missingFields`, `reasoning`. Frontend routes based on result:

1. `isValidExpense: false` → error message with examples
2. `missingFields` includes `amount` → error (critical field)
3. `confidence: low/medium` or missing optional fields → confirmation dialog
4. `confidence: high` → auto-save with preview

### State Management

- **TanStack Query** for server state (caching, invalidation, toast notifications)
- Hooks: `useExpenses`, `useCreateExpense`, `useUpdateExpense`, `useDeleteExpense`
- Default stale time: 60 seconds
- Local React state for UI interactions

### Auth

Better Auth with email/password + GitHub + Google OAuth.

Rate limits:
- Default: 20 req/60s
- Sign-in: 5 req/60s
- Sign-up: 3 req/5min
- Get-session: 100 req/60s

### API Client

Centralized `lib/api/client.ts` — typed `get`, `post`, `put`, `delete`, `patch` methods with consistent error handling via `ApiError`.

### Styling

Tailwind CSS 4 + CVA (Class-Variance-Authority) for component variants + `cn()` utility (clsx + tailwind-merge).

### AI Prompts

Centralized in `lib/prompts/expense-parser.ts`.

### Voice Input

Browser `MediaRecorder` captures `audio/webm` → POST to `/api/transcribe` → Groq Whisper returns text → fed into expense input or chat.

---

## Component Tree

```
app/layout.tsx (QueryProvider, ThemeProvider, SessionContext)
├── /landing   (nav, hero, features, how-it-works, cta, footer)
├── /home      (home-content → home-input, home-stats, expense-analytics, monthly-budget-metrics)
│              └── expense-confirmation-dialog (low-confidence AI parse review)
├── /chat      (chat-interface: streaming responses + voice input)
├── /analytics (spending-chart, category-breakdown, top-categories, day-of-week-chart, spending-vs-budget)
├── /profile   (sections: account, security, preferences, notifications, privacy, integrations)
└── /onboarding (multi-step wizard)
```

---

## Directory Structure

```
app/
├── api/                          # API routes
├── home/, chat/, analytics/      # Protected pages
├── login/, signup/               # Auth pages
├── analytics/, profile/          # Feature pages
└── changelog/                    # Public page

components/
├── ui/                           # Headless UI primitives (CVA variants)
├── auth/                         # Login/signup forms
├── home/                         # Dashboard + expense input
├── chat/                         # Chat interface
├── analytics/                    # Charts and stats
├── onboarding/                   # Setup wizard
├── landing/                      # Marketing page sections
├── profile/                      # Settings sections
├── skeletons/                    # Loading skeletons
└── providers/                    # React context providers

lib/
├── auth.ts, auth-client.ts       # Better Auth server/client
├── db.ts, schema.ts              # Drizzle ORM + PostgreSQL
├── api/client.ts                 # Centralized fetch wrapper
├── api/route-helpers.ts          # Auth check, error boundary
├── hooks/                        # TanStack Query hooks + voice input
├── prompts/                      # AI system prompts
├── expenses/                     # Zod schemas + text utils
├── constants/                    # Categories, timing, budget defaults
└── utils.ts                      # cn() utility
```

---

## Dependencies

| Category | Packages |
|---|---|
| Framework | Next.js 16, React 19 |
| UI | Radix UI, Tailwind CSS 4, Recharts, Lucide |
| Database | Drizzle ORM, pg (PostgreSQL) |
| Auth | Better Auth 1.4.7 |
| AI | `@ai-sdk/groq`, `groq-sdk`, `@ai-sdk/react`, `ai` (Vercel AI SDK) |
| State | TanStack Query |
| Validation | Zod |
| Utilities | date-fns, sonner (toasts), clsx, tailwind-merge |
| Package Manager | Bun |
