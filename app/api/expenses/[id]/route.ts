import { db } from "@/lib/db";
import { expenses } from "@/lib/schema";
import {
  success,
  notFound,
  noContent,
} from "@/lib/api/responses";
import { eq, and } from "drizzle-orm";
import {
  parseRequestBody,
  parseRouteParam,
  requireRouteAuth,
  withServerErrorBoundary,
} from "@/lib/api/route-helpers";
import {
  expenseIdSchema,
  updateExpenseSchema,
} from "@/lib/expenses/schemas";

type RouteParams = {
  params: Promise<{ id: string }>;
};

async function findOwnedExpense(id: string, userId: string) {
  const [expense] = await db
    .select()
    .from(expenses)
    .where(and(eq(expenses.id, id), eq(expenses.userId, userId)))
    .limit(1);

  return expense;
}

export async function PUT(
  req: Request,
  { params }: RouteParams
) {
  return withServerErrorBoundary("update expense", async () => {
    const auth = await requireRouteAuth();
    if (!auth.ok) return auth.response;

    const resolvedParams = await params;
    const parsedId = parseRouteParam(resolvedParams.id, expenseIdSchema);
    if (!parsedId.ok) return parsedId.response;

    const body = await parseRequestBody(req, updateExpenseSchema);
    if (!body.ok) return body.response;

    const existingExpense = await findOwnedExpense(parsedId.data, auth.data.user.id);
    if (!existingExpense) {
      return notFound("Expense not found");
    }

    const updated = await db
      .update(expenses)
      .set({
        amount: body.data.amount,
        description: body.data.description,
        category: body.data.category,
        date: body.data.date,
      })
      .where(
        and(
          eq(expenses.id, parsedId.data),
          eq(expenses.userId, auth.data.user.id)
        )
      )
      .returning();

    return success(updated[0]);
  });
}

export async function DELETE(
  req: Request,
  { params }: RouteParams
) {
  void req;
  return withServerErrorBoundary("delete expense", async () => {
    const auth = await requireRouteAuth();
    if (!auth.ok) return auth.response;

    const resolvedParams = await params;
    const parsedId = parseRouteParam(resolvedParams.id, expenseIdSchema);
    if (!parsedId.ok) return parsedId.response;

    const existingExpense = await findOwnedExpense(parsedId.data, auth.data.user.id);
    if (!existingExpense) {
      return notFound("Expense not found");
    }

    await db
      .delete(expenses)
      .where(
        and(
          eq(expenses.id, parsedId.data),
          eq(expenses.userId, auth.data.user.id)
        )
      );

    return noContent();
  });
}
