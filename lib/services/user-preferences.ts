import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { userPreferences } from "@/lib/schema";
import type { ClientUserPreferences } from "@/lib/types/expense";

export const getUserPreferencesForUser = cache(async function getUserPreferencesForUser(
  userId: string
): Promise<ClientUserPreferences | null> {
  const [preferences] = await db
    .select({
      monthlyBudget: userPreferences.monthlyBudget,
      currency: userPreferences.currency,
      timezone: userPreferences.timezone,
      language: userPreferences.language,
      dateFormat: userPreferences.dateFormat,
      enabledCategories: userPreferences.enabledCategories,
    })
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  return preferences ?? null;
});
