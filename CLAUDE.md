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
- `components/landing/` - Landing page sections (hero, features, CTA, footer)

**Client vs Server Components**:
- Components with `"use client"` directive are client components (interactive)
- Default components are server components (data fetching, static)
- Pages in `app/` default to server components unless marked with `"use client"`

### App Router Structure

```
app/
├── api/auth/[...all]/route.ts    # Auth API catchall (handles all Better Auth endpoints)
├── api/changelog/route.ts         # Changelog CRUD API
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
DATABASE_URL="postgresql://..."           # PostgreSQL connection string
BETTER_AUTH_SECRET="random-secret-key"    # Session encryption key
BETTER_AUTH_URL="http://localhost:3000"   # Auth base URL

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

## Important Notes

- Path alias `@/*` maps to project root (configured in `tsconfig.json`)
- All timestamps use PostgreSQL `timestamp` type with `defaultNow()`
- Better Auth automatically handles session management and token refresh
- The auth schema must be imported in `lib/schema.ts` for Drizzle migrations to work
- Use `npm run db:studio` to visually inspect database during development
