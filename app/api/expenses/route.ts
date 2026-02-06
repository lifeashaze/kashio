import { db } from "@/lib/db";
import { expenses } from "@/lib/schema";
import { created, success } from "@/lib/api/responses";
import {
  parseRequestBody,
  requireRouteAuth,
  withServerErrorBoundary,
} from "@/lib/api/route-helpers";
import { desc, eq } from "drizzle-orm";
import { createExpenseSchema } from "@/lib/expenses/schemas";

export async function POST(req: Request) {
  return withServerErrorBoundary("create expense", async () => {
    const auth = await requireRouteAuth();
    if (!auth.ok) return auth.response;

    const body = await parseRequestBody(req, createExpenseSchema);
    if (!body.ok) return body.response;

    const result = await db
      .insert(expenses)
      .values({
        userId: auth.data.user.id,
        amount: body.data.amount.toFixed(2),
        description: body.data.description,
        category: body.data.category,
        date: body.data.date,
        rawInput: body.data.rawInput,
      })
      .returning();

    return created(result[0]);
  });
}

export async function GET() {
  return withServerErrorBoundary("fetch expenses", async () => {
    const auth = await requireRouteAuth();
    if (!auth.ok) return auth.response;

    const userExpenses = await db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, auth.data.user.id))
      .orderBy(desc(expenses.date));

    return success(userExpenses);
  });
}
