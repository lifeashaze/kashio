import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";
import { EXPENSE_CATEGORIES } from "@/lib/constants/categories";
import { badRequest, success, serverError } from "@/lib/api/responses";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Expense schema for structured output
const expenseSchema = z.object({
  isValidExpense: z
    .boolean()
    .describe(
      "Is this input actually an expense? False for greetings, questions, unrelated text, or gibberish"
    ),
  confidence: z
    .enum(["high", "medium", "low"])
    .describe(
      "Confidence level: high=all info clear, medium=some inference needed, low=missing critical info or very ambiguous"
    ),
  amount: z
    .number()
    .nullable()
    .describe("The expense amount in dollars, null if not found"),
  description: z
    .string()
    .nullable()
    .describe("A brief description of the expense, null if unclear"),
  category: z
    .enum(EXPENSE_CATEGORIES)
    .describe("The category that best fits this expense"),
  date: z
    .string()
    .describe(
      "The date and time of the expense in ISO format (YYYY-MM-DDTHH:mm:ss). If no time specified, infer based on context (e.g., 'lunch' = 12:00, 'dinner' = 19:00, 'coffee' = current time or morning time)"
    ),
  missingFields: z
    .array(z.enum(["amount", "description", "category"]))
    .describe(
      "List of critical fields that couldn't be extracted from input. Empty array if all fields present."
    ),
  reasoning: z
    .string()
    .describe(
      "Brief explanation of the categorization, confidence level, and any missing/inferred information"
    ),
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return badRequest("Prompt is required and must be a string");
    }

    // Get current date and time for context (in local timezone)
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const currentISO = localDate.toISOString().slice(0, 19);

    const currentDateTime = now.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const result = await generateObject({
      model: groq("moonshotai/kimi-k2-instruct-0905"),
      schema: expenseSchema,
      temperature: 0,
      system: `Parse expense to JSON with validation. Current datetime: ${currentDateTime} (${currentISO} in ISO format).

VALIDATION RULES:
1. Set isValidExpense=false if input is:
   - A greeting ("hello", "hi", "hey")
   - A question ("how are you?", "what's the weather?")
   - Random text/gibberish
   - Not related to expenses at all

2. Set confidence level:
   - "high": Amount, description clearly stated, minimal inference
   - "medium": Some inference needed (e.g., guessing meal type, category)
   - "low": Missing amount OR description is very vague/unclear

3. Missing fields tracking:
   - Add "amount" to missingFields if no amount found
   - Add "description" to missingFields if what was purchased is unclear
   - Add "category" to missingFields if impossible to categorize (should be rare)

4. Handle null values:
   - Set amount=null if not found in input
   - Set description=null if what was purchased is unclear

EXAMPLES:
- "hello" → isValidExpense=false, reasoning="This is a greeting, not an expense"
- "spent money" → isValidExpense=true, confidence="low", amount=null, description=null, missingFields=["amount","description"]
- "$50" → isValidExpense=true, confidence="low", amount=50, description=null, missingFields=["description"]
- "$15 chipotle" → isValidExpense=true, confidence="high", amount=15, description="chipotle", missingFields=[]

DATE HANDLING (YYYY-MM-DDTHH:mm:ss format):
- DEFAULT: If NO time mentioned in input, use EXACT current time: ${currentISO}
- ONLY infer different times if explicitly mentioned:
  - "lunch" → same date at 12:00:00
  - "dinner" → same date at 19:00:00
  - "breakfast" → same date at 08:00:00
- If "yesterday" or relative date, adjust date but use current time unless time is specified

Categories: food, transport, entertainment, shopping, bills, health, groceries, travel, education, other.`,
      prompt,
    });

    return success(result.object);
  } catch (error) {
    return serverError("Failed to parse expense", error);
  }
}
