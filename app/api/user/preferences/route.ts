import { requireAuth } from "@/lib/api/auth";
import { db } from "@/lib/db";
import { userPreferences } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const preferencesSchema = z.object({
  monthlyBudget: z.number().positive(),
  currency: z.string().length(3),
  timezone: z.string(),
  language: z.string(),
  dateFormat: z.string(),
  enabledCategories: z.array(z.string()),
});

// GET /api/user/preferences - Fetch user preferences
export async function GET() {
  const result = await requireAuth();

  if (!result.success) {
    return result.response;
  }

  const prefs = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, result.session.user.id))
    .limit(1);

  if (prefs.length === 0) {
    return Response.json(null, { status: 404 });
  }

  return Response.json(prefs[0]);
}

// POST /api/user/preferences - Create or update preferences
export async function POST(req: Request) {
  const result = await requireAuth();

  if (!result.success) {
    return result.response;
  }

  const body = await req.json();

  const validated = preferencesSchema.parse(body);

  const savedPrefs = await db
    .insert(userPreferences)
    .values({
      userId: result.session.user.id,
      monthlyBudget: validated.monthlyBudget.toString(),
      currency: validated.currency,
      timezone: validated.timezone,
      language: validated.language,
      dateFormat: validated.dateFormat,
      enabledCategories: validated.enabledCategories,
    })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: {
        monthlyBudget: validated.monthlyBudget.toString(),
        currency: validated.currency,
        timezone: validated.timezone,
        language: validated.language,
        dateFormat: validated.dateFormat,
        enabledCategories: validated.enabledCategories,
        updatedAt: new Date(),
      },
    })
    .returning();

  return Response.json(savedPrefs[0]);
}
