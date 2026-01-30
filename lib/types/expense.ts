import type { ExpenseCategory } from "@/lib/constants/categories";

/**
 * Confidence level for AI-parsed expenses
 */
export type ParseConfidence = "high" | "medium" | "low";

/**
 * Fields that can be missing from parsed expense input
 */
export type MissingExpenseField = "amount" | "description" | "category";

/**
 * Response from the expense parsing API with validation metadata
 * Used by both the API route and frontend components
 */
export type ParsedExpense = {
  /** Whether the input is actually an expense (not a greeting, question, etc.) */
  isValidExpense: boolean;
  /** Confidence level in the parsing accuracy */
  confidence: ParseConfidence;
  /** Parsed amount in dollars, null if not found */
  amount: number | null;
  /** Parsed description, null if unclear */
  description: string | null;
  /** Categorized expense type */
  category: ExpenseCategory;
  /** ISO 8601 date string (YYYY-MM-DDTHH:mm:ss) */
  date: string;
  /** List of fields that couldn't be extracted */
  missingFields: MissingExpenseField[];
  /** AI's explanation of parsing decisions */
  reasoning: string;
};

/**
 * Validated expense data ready to be saved
 * Used when creating a new expense in the database
 */
export type ValidatedExpense = {
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
};

/**
 * Expense creation payload with raw input
 */
export type CreateExpensePayload = ValidatedExpense & {
  rawInput: string;
};
