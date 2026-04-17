import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { dateToDateOnlyString, normalizeDateInput } from "@/lib/date";
import { normalizeExpenseDescription } from "@/lib/expenses/text";
import {
  parsedExpenseSchema,
  type ParsedExpense,
} from "@/lib/expenses/schemas";
import { getExpenseParserPrompt } from "@/lib/prompts/expense-parser";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export type ParseExpensePromptInput = {
  prompt: string;
  currentDate?: string;
};

export async function parseExpensePrompt({
  prompt,
  currentDate,
}: ParseExpensePromptInput): Promise<ParsedExpense> {
  const resolvedCurrentDate = currentDate ?? dateToDateOnlyString(new Date());

  const result = await generateObject({
    model: groq("openai/gpt-oss-120b"),
    schema: parsedExpenseSchema,
    temperature: 0,
    system: getExpenseParserPrompt({ currentDate: resolvedCurrentDate }),
    prompt,
  });

  const normalizedDate = normalizeDateInput(result.object.date) ?? resolvedCurrentDate;
  const normalizedDescription = result.object.description
    ? normalizeExpenseDescription(result.object.description)
    : null;

  return {
    ...result.object,
    description: normalizedDescription,
    date: normalizedDate,
  };
}
