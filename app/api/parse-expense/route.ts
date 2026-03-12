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
    const authPromise = requireRouteAuth();
    const bodyPromise = parseRequestBody(req, parseExpenseRequestSchema);

    const auth = await authPromise;
    if (!auth.ok) return auth.response;

    const body = await bodyPromise;
    if (!body.ok) return body.response;

    const { prompt } = body.data;

    const result = await parseExpensePrompt({ prompt });

    return success(result);
  });
}
