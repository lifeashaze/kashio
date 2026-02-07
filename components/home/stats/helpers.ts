import type { Expense } from "@/lib/schema";
import type { ExpenseCategory } from "@/lib/constants/categories";
import { dateOnlyStringToDate, formatRelativeDateLabel } from "@/lib/date";

export const CONFIRM_TIMEOUT_MS = 3000;
export const EXPENSE_TABLE_GRID_COLUMNS =
  "grid-cols-[minmax(0,1fr)_8.5rem_6.5rem_7.5rem_5.5rem]";

export function formatExpenseCurrency(amount: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

export function formatExpenseDate(date: string | Date) {
  return formatRelativeDateLabel(date);
}

export function parseExpenseDate(date: string | Date) {
  if (typeof date === "string") {
    return dateOnlyStringToDate(date) ?? new Date();
  }

  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function parseExpenseCategory(category: string): ExpenseCategory {
  return category as ExpenseCategory;
}

export function buildEditFormState(expense: Expense) {
  return {
    amount: Number(expense.amount).toFixed(2),
    description: expense.description,
    category: parseExpenseCategory(expense.category),
    date: parseExpenseDate(expense.date),
  };
}
