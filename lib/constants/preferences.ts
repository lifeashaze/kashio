import { DEFAULT_MONTHLY_BUDGET } from "@/lib/constants/budget";
import {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
} from "@/lib/constants/categories";

export const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "EUR" },
  { code: "GBP", name: "British Pound", symbol: "GBP" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CAD" },
  { code: "AUD", name: "Australian Dollar", symbol: "AUD" },
  { code: "JPY", name: "Japanese Yen", symbol: "JPY" },
  { code: "CNY", name: "Chinese Yuan", symbol: "CNY" },
  { code: "INR", name: "Indian Rupee", symbol: "INR" },
] as const;

export const DEFAULT_CURRENCY = "USD";
export const DEFAULT_TIMEZONE = "America/Los_Angeles";
export const DEFAULT_LANGUAGE = "en";
export const DEFAULT_DATE_FORMAT = "MM/DD/YYYY";

type DefaultUserPreferences = {
  monthlyBudget: number;
  currency: string;
  timezone: string;
  language: string;
  dateFormat: string;
  enabledCategories: ExpenseCategory[];
};

export function createDefaultUserPreferences(
  timezone = DEFAULT_TIMEZONE
): DefaultUserPreferences {
  return {
    monthlyBudget: DEFAULT_MONTHLY_BUDGET,
    currency: DEFAULT_CURRENCY,
    timezone,
    language: DEFAULT_LANGUAGE,
    dateFormat: DEFAULT_DATE_FORMAT,
    enabledCategories: [...EXPENSE_CATEGORIES],
  };
}
