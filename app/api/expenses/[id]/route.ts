import {
  success,
  notFound,
  noContent,
} from "@/lib/api/responses";
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
import {
  deleteExpenseForUser,
  findOwnedExpense,
  updateExpenseForUser,
} from "@/lib/services/expense-write";

type RouteParams = {
  params: Promise<{ id: string }>;
};

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

    const updated = await updateExpenseForUser(
      auth.data.user.id,
      parsedId.data,
      body.data
    );

    return success(updated);
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

    await deleteExpenseForUser(auth.data.user.id, parsedId.data);

    return noContent();
  });
}
