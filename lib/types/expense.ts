import type { ExpenseCategory } from "@/lib/constants/categories";

export type ParseConfidence = "high" | "medium" | "low";

export type MissingExpenseField = "amount" | "description" | "category";

export type ParsedExpense = {
  isValidExpense: boolean;
  confidence: ParseConfidence;
  amount: number | null;
  description: string | null;
  category: ExpenseCategory;
  date: string;
  missingFields: MissingExpenseField[];
  reasoning: string;
};

export type ValidatedExpense = {
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
};

export type CreateExpensePayload = ValidatedExpense & {
  rawInput: string;
};
