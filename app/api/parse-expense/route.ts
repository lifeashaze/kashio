import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { success } from "@/lib/api/responses";
import {
  parseRequestBody,
  requireRouteAuth,
  withServerErrorBoundary,
} from "@/lib/api/route-helpers";
import { getExpenseParserPrompt } from "@/lib/prompts/expense-parser";
import { dateToDateOnlyString, normalizeDateInput } from "@/lib/date";
import { normalizeExpenseDescription } from "@/lib/expenses/text";
import {
  parsedExpenseSchema,
  parseExpenseRequestSchema,
} from "@/lib/expenses/schemas";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  return withServerErrorBoundary("parse expense", async () => {
    const auth = await requireRouteAuth();
    if (!auth.ok) return auth.response;

    const body = await parseRequestBody(req, parseExpenseRequestSchema);
    if (!body.ok) return body.response;

    const { prompt } = body.data;

    // Get current date for context (in local timezone)
    const now = new Date();
    const currentDate = dateToDateOnlyString(now);

    const result = await generateObject({
      model: groq("moonshotai/kimi-k2-instruct-0905"),
      schema: parsedExpenseSchema,
      temperature: 0,
      system: getExpenseParserPrompt({ currentDate }),
      prompt,
    });

    const normalizedDate = normalizeDateInput(result.object.date) ?? currentDate;
    const normalizedDescription = result.object.description
      ? normalizeExpenseDescription(result.object.description)
      : null;

    return success({
      ...result.object,
      description: normalizedDescription,
      date: normalizedDate,
    });
  });
}
