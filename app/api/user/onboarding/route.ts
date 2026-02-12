import { requireAuth } from "@/lib/api/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { eq } from "drizzle-orm";

// PATCH /api/user/onboarding - Update onboarding status
export async function PATCH(req: Request) {
  const result = await requireAuth();

  if (!result.success) {
    return result.response;
  }

  const body = await req.json();

  const { completed, step } = body;

  await db
    .update(user)
    .set({
      onboardingCompleted: completed ?? undefined,
      onboardingStep: step ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(user.id, result.session.user.id));

  return Response.json({ success: true });
}
