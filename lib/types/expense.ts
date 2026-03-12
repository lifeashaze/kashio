import type { Expense, UserPreferences } from "@/lib/schema";

export type {
  CreateExpensePayload,
  MissingExpenseField,
  ParseConfidence,
  ParsedExpense,
  UpdateExpensePayload,
  ValidatedExpense,
} from "@/lib/expenses/schemas";

export type ClientExpense = Pick<
  Expense,
  "id" | "amount" | "description" | "category" | "date" | "rawInput"
>;

export type ClientUserPreferences = Pick<
  UserPreferences,
  | "monthlyBudget"
  | "currency"
  | "timezone"
  | "language"
  | "dateFormat"
  | "enabledCategories"
>;
