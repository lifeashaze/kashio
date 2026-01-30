# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kashio is a full-stack expense tracking application built with Next.js 16 (App Router), featuring natural language expense logging. The stack uses TypeScript, Tailwind CSS 4, Drizzle ORM with PostgreSQL, and Better Auth for authentication.

## Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server at http://localhost:3000

# Database
npm run db:generate      # Generate Drizzle migration from schema changes
npm run db:migrate       # Apply pending migrations to database
npm run db:push          # Push schema changes without creating migration files
npm run db:studio        # Open Drizzle Studio (visual database browser)

# Production
npm run build            # Create production build
npm run start            # Run production server
npm run lint             # Run ESLint
```

## Architecture

### Authentication Flow

The app uses Better Auth with a centralized authentication architecture:

1. **Server Config** (`lib/auth.ts`): Better Auth server instance configured with:
   - Drizzle adapter using PostgreSQL
   - Email/password authentication
   - OAuth providers (GitHub, Google)
   - Schema imported from `lib/schema.ts`

2. **Client Config** (`lib/auth-client.ts`): Better Auth React client for browser-side auth operations

3. **API Routes** (`app/api/auth/[...all]/route.ts`): Dynamic catchall route handles all auth endpoints (`/api/auth/*`)

4. **Auth Forms** (`components/auth/auth-form.tsx`): Reusable form component for both login and signup, supports email/password and OAuth

**Important**: When modifying authentication, changes typically require updates across all four layers above.

### Database Architecture

**Connection Pattern**:
- Single PostgreSQL connection pool created in `lib/db.ts` using `pg` driver
- Drizzle ORM instance exports singleton `db` with schema attached
- All queries use the same `db` instance to leverage connection pooling

**Schema Organization**:
- `lib/schema.ts` - Main schema file that re-exports auth schema and defines app models
  - `changelog` table - Changelog entries with date and content
  - `expenses` table - User expenses with amount, description, category, date, and rawInput
- `lib/auth-schema.ts` - Better Auth tables (user, session, account, verification)
- Drizzle config (`drizzle.config.ts`) points to `lib/schema.ts` for migrations

**Migration Workflow**:
1. Modify schema in `lib/schema.ts` or `lib/auth-schema.ts`
2. Run `npm run db:generate` to create migration SQL in `drizzle/`
3. Run `npm run db:migrate` to apply to database
4. Use `npm run db:push` for development-only schema sync (skips migration files)

### Component Structure

**UI Components** (`components/ui/`):
- Headless UI components styled with Tailwind CSS
- Use Class-Variance-Authority (CVA) for variant-based styling
- Import pattern: `import { Button } from "@/components/ui/button"`

**Feature Components**:
- `components/auth/` - Authentication forms
- `components/home/` - Dashboard and expense input interface
  - `home-input.tsx` - Natural language expense input with two-tier validation
  - `expense-confirmation-dialog.tsx` - Review/edit dialog for low-confidence parses
- `components/landing/` - Landing page sections (hero, features, CTA, footer)

**Client vs Server Components**:
- Components with `"use client"` directive are client components (interactive)
- Default components are server components (data fetching, static)
- Pages in `app/` default to server components unless marked with `"use client"`

### App Router Structure

```
app/
├── api/
│   ├── auth/[...all]/route.ts    # Auth API catchall (handles all Better Auth endpoints)
│   ├── changelog/route.ts         # Changelog CRUD API
│   ├── expenses/route.ts          # Expense CRUD API (GET: fetch user expenses, POST: create expense)
│   └── parse-expense/route.ts     # AI-powered natural language expense parser
├── page.tsx                       # Landing page (public, server component)
├── home/page.tsx                  # Dashboard (protected, client component)
├── login/page.tsx                 # Login page (public, client component)
├── signup/page.tsx                # Signup page (public, client component)
└── changelog/page.tsx             # Changelog display (public, server component)
```

**API Route Patterns**:
- Export named functions: `GET`, `POST`, `PUT`, `DELETE`
- Return `Response` objects or use `NextResponse.json()`
- Database queries use the singleton `db` from `lib/db.ts`

### Styling System

- **Tailwind CSS 4** with PostCSS
- Dark mode with CSS custom properties in `app/globals.css`
- Utility function `cn()` in `lib/utils.ts` combines clsx + tailwind-merge for dynamic classes
- Component variants use CVA pattern (see `components/ui/button.tsx`)

## Environment Variables

Required environment variables (create `.env.local`):

```
DATABASE_URL="postgresql://..."                      # PostgreSQL connection string
BETTER_AUTH_SECRET="random-secret-key"               # Session encryption key
BETTER_AUTH_URL="http://localhost:3000"              # Auth base URL
GROQ_API_KEY="..."                                    # Groq API key for expense parsing (gemma2-9b-it)

# OAuth (optional, for social login)
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Common Patterns

### Adding a New Database Table

1. Define schema in `lib/schema.ts`:
```typescript
export const myTable = pgTable("my_table", {
  id: uuid("id").defaultRandom().primaryKey(),
  // ... other columns
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MyTable = typeof myTable.$inferSelect;
export type NewMyTable = typeof myTable.$inferInsert;
```

2. Generate and apply migration:
```bash
npm run db:generate
npm run db:migrate
```

### Creating API Routes

Server actions aren't used; all data mutations go through API routes:

```typescript
// app/api/myroute/route.ts
import { db } from "@/lib/db";
import { myTable } from "@/lib/schema";

export async function GET() {
  const data = await db.select().from(myTable);
  return Response.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = await db.insert(myTable).values(body).returning();
  return Response.json(result[0]);
}
```

### Querying the Database

```typescript
import { db } from "@/lib/db";
import { myTable } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

// Select
const all = await db.select().from(myTable);
const one = await db.select().from(myTable).where(eq(myTable.id, id));

// Insert
await db.insert(myTable).values({ ... }).returning();

// Update
await db.update(myTable).set({ ... }).where(eq(myTable.id, id));

// Delete
await db.delete(myTable).where(eq(myTable.id, id));

// Order
await db.select().from(myTable).orderBy(desc(myTable.createdAt));
```

### Using the Auth Client

```typescript
"use client";
import { authClient } from "@/lib/auth-client";

// Sign up
await authClient.signUp.email({
  email,
  password,
  name,
});

// Sign in
await authClient.signIn.email({ email, password });

// OAuth
await authClient.signIn.social({
  provider: "github",
  callbackURL: "/home",
});

// Sign out
await authClient.signOut();
```

### AI Validation Pattern

The expense tracking feature implements a reusable two-tier validation pattern for AI-powered inputs:

**Pattern Structure**:
1. **AI returns validation metadata** (isValid, confidence, missingFields, reasoning)
2. **Frontend routes based on state**:
   - Invalid → Error message with examples
   - Missing critical fields → Error with specific guidance
   - Low/medium confidence → Confirmation dialog
   - High confidence → Auto-complete action

**Implementation Template**:
```typescript
// 1. Define schema with validation (in API route)
const schema = z.object({
  isValid: z.boolean(),
  confidence: z.enum(["high", "medium", "low"]),
  data: z.object({ /* actual data */ }).nullable(),
  missingFields: z.array(z.string()),
  reasoning: z.string(),
});

// 2. Handle in frontend
if (!result.isValid) {
  showError(result.reasoning + " Try: [examples]");
} else if (result.missingFields.includes("critical-field")) {
  showError("Missing critical field...");
} else if (result.confidence !== "high" || result.missingFields.length > 0) {
  showConfirmationDialog(result);
} else {
  autoComplete(result.data);
}
```

### Expense Tracking

The app features AI-powered natural language expense parsing using Groq (Gemma 2 9B IT) with a **two-tier validation approach** that handles invalid inputs, missing fields, and uncertain parses gracefully.

#### Two-Tier Validation Flow

**Tier 1: AI-Level Validation**

The AI validates input and returns confidence metrics before any data is saved:

```typescript
// POST /api/parse-expense
const response = await fetch("/api/parse-expense", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: "lunch at chipotle $15" }),
});

// Returns validation + structured data:
// {
//   isValidExpense: true,
//   confidence: "high",  // "high" | "medium" | "low"
//   amount: 15,
//   description: "lunch at chipotle",
//   category: "food",
//   date: "2026-01-30T12:00:00",
//   missingFields: [],  // e.g., ["amount", "description"]
//   reasoning: "Clear amount and description provided..."
// }
```

**Validation Fields**:
- `isValidExpense` - `false` for greetings, questions, or non-expense text
- `confidence` - "high" (all clear), "medium" (some inference), "low" (missing critical info)
- `missingFields` - Array of fields that couldn't be extracted: `["amount", "description", "category"]`
- `amount` / `description` - Nullable (null if not found in input)
- `reasoning` - Explains confidence level and missing/inferred information

**Tier 2: Frontend Handling**

The UI handles different validation states (`components/home/home-input.tsx`):

1. **Not an expense** (`isValidExpense: false`) → Show error with examples
2. **Missing amount** → Show error (amount is critical, can't proceed)
3. **Low/medium confidence or missing fields** → Show confirmation dialog
4. **High confidence** → Auto-save with quick preview

**Parsing Features**:
- Uses Groq's Gemma 2 9B IT with structured outputs (Zod schema)
- Categorizes into: food, transport, entertainment, shopping, bills, health, groceries, travel, education, other
- Infers date/time from context (e.g., "lunch" → 12:00, "dinner" → 19:00)
- Supports relative dates ("yesterday", "last week")
- Detects invalid inputs (greetings, gibberish, questions)
- Alternative models: `llama-3.3-70b-versatile`, `llama-3.1-70b-versatile` (supports structured outputs)

#### Confirmation Dialog

When the AI has low/medium confidence or missing fields, a confirmation dialog (`components/home/expense-confirmation-dialog.tsx`) allows users to review and edit:

```typescript
<ExpenseConfirmationDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  parsedExpense={parsed}  // Contains validation metadata
  onConfirm={(expense) => saveExpense(expense, rawInput)}
  onCancel={() => setShowDialog(false)}
/>
```

The dialog:
- Pre-fills fields with parsed values (empty for null values)
- Highlights missing fields in red with asterisks
- Auto-focuses first missing field
- Shows AI reasoning at the top
- Validates before allowing save (amount > 0, description non-empty)
- Allows editing all fields (amount, description, category, date/time)

#### Example Validation Flows

```typescript
// 1. Invalid input
"hello" → { isValidExpense: false } → Error message

// 2. Missing amount (critical field)
"bought coffee" → { missingFields: ["amount"] } → Error message

// 3. Missing description
"$15" → { amount: 15, description: null, confidence: "low" } → Confirmation dialog

// 4. Medium confidence (inference needed)
"lunch $12" → { confidence: "medium" } → Confirmation dialog

// 5. High confidence (clear input)
"$15 chipotle lunch" → { confidence: "high" } → Auto-save with preview
```

**2. Save Expense** (`/api/expenses`):
```typescript
// POST /api/expenses (authenticated)
await fetch("/api/expenses", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: 15,
    description: "lunch at chipotle",
    category: "food",
    date: "2026-01-30T12:00:00",
    rawInput: "lunch at chipotle $15",
  }),
});

// GET /api/expenses (authenticated)
const expenses = await fetch("/api/expenses").then(r => r.json());
// Returns array of user's expenses, ordered by date descending
```

**Database Schema** (`expenses` table):
- `id` - UUID primary key
- `userId` - User ID (text, links to auth user)
- `amount` - Numeric(10, 2) for currency precision
- `description` - Text description of expense
- `category` - Text category (food, transport, etc.)
- `date` - Timestamp of when expense occurred
- `rawInput` - Original natural language input
- `createdAt` - Timestamp of record creation

## Important Notes

- Path alias `@/*` maps to project root (configured in `tsconfig.json`)
- All timestamps use PostgreSQL `timestamp` type with `defaultNow()`
- Better Auth automatically handles session management and token refresh
- The auth schema must be imported in `lib/schema.ts` for Drizzle migrations to work
- Use `npm run db:studio` to visually inspect database during development
