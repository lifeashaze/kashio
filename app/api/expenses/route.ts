import { created, success } from "@/lib/api/responses";
import {
  parseRequestBody,
  requireRouteAuth,
  withServerErrorBoundary,
} from "@/lib/api/route-helpers";
import { createExpenseSchema } from "@/lib/expenses/schemas";
import {
  createExpenseForUser,
  listExpensesForUser,
} from "@/lib/services/expense-write";

export async function POST(req: Request) {
  return withServerErrorBoundary("create expense", async () => {
    const auth = await requireRouteAuth();
    if (!auth.ok) return auth.response;

    const body = await parseRequestBody(req, createExpenseSchema);
    if (!body.ok) return body.response;

    const result = await createExpenseForUser(auth.data.user.id, body.data);

    return created(result);
  });
}

export async function GET() {
  return withServerErrorBoundary("fetch expenses", async () => {
    const auth = await requireRouteAuth();
    if (!auth.ok) return auth.response;

    const userExpenses = await listExpensesForUser(auth.data.user.id);

    return success(userExpenses);
  });
}
