import { z } from "zod";
import { EXPENSE_CATEGORIES } from "@/lib/constants/categories";
import { normalizeDateInput } from "@/lib/date";

const amountSchema = z.coerce
  .number({
    error: "Amount is required",
  })
  .finite("Amount must be a valid number")
  .gt(0, "Amount must be greater than 0");

const normalizedDateSchema = z
  .string({
    error: "Date is required",
  })
  .trim()
  .superRefine((value, ctx) => {
    if (!normalizeDateInput(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid date format. Expected YYYY-MM-DD",
      });
    }
  })
  .transform((value) => normalizeDateInput(value)!);

export const expenseIdSchema = z.uuid("Invalid expense id");

export const createExpenseSchema = z.object({
  amount: amountSchema,
  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(1, "Description is required"),
  category: z.enum(EXPENSE_CATEGORIES, {
    error: "Invalid category",
  }),
  date: normalizedDateSchema,
  rawInput: z
    .string({ error: "Raw input is required" })
    .trim()
    .min(1, "Raw input is required"),
});

export const updateExpenseSchema = createExpenseSchema.omit({
  rawInput: true,
});

export const parseExpenseRequestSchema = z.object({
  prompt: z
    .string({ error: "Prompt is required and must be a string" })
    .trim()
    .min(1, "Prompt is required and must be a string"),
});

export const parseConfidenceSchema = z.enum(["high", "medium", "low"]);
export const missingExpenseFieldSchema = z.enum([
  "amount",
  "description",
  "category",
]);

// Structured schema used by generateObject for the expense parser route.
export const parsedExpenseSchema = z.object({
  isValidExpense: z
    .boolean()
    .describe(
      "Is this input actually an expense? False for greetings, questions, unrelated text, or gibberish"
    ),
  confidence: parseConfidenceSchema.describe(
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
      "The date of the expense in YYYY-MM-DD format. Do not include time."
    ),
  missingFields: z
    .array(missingExpenseFieldSchema)
    .describe(
      "List of critical fields that couldn't be extracted from input. Empty array if all fields present."
    ),
  reasoning: z
    .string()
    .describe(
      "Brief explanation of the categorization, confidence level, and any missing/inferred information"
    ),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ParseExpenseRequest = z.infer<typeof parseExpenseRequestSchema>;
export type ParsedExpense = z.infer<typeof parsedExpenseSchema>;
export type ParseConfidence = z.infer<typeof parseConfidenceSchema>;
export type MissingExpenseField = z.infer<typeof missingExpenseFieldSchema>;

export type ValidatedExpense = Pick<
  CreateExpenseInput,
  "amount" | "description" | "category" | "date"
>;

export type CreateExpensePayload = CreateExpenseInput;

export type UpdateExpensePayload = {
  id: string;
} & UpdateExpenseInput;
