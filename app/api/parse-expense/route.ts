import { success } from "@/lib/api/responses";
import {
  parseRequestBody,
  requireRouteAuth,
  withServerErrorBoundary,
} from "@/lib/api/route-helpers";
import {
  parseExpenseRequestSchema,
} from "@/lib/expenses/schemas";
import { parseExpensePrompt } from "@/lib/services/expense-parser";

export async function POST(req: Request) {
  return withServerErrorBoundary("parse expense", async () => {
    const auth = await requireRouteAuth();
    if (!auth.ok) return auth.response;

    const body = await parseRequestBody(req, parseExpenseRequestSchema);
    if (!body.ok) return body.response;

    const { prompt } = body.data;

    const result = await parseExpensePrompt({ prompt });

    return success(result);
  });
}
