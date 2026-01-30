/**
 * Centralized expense category definitions
 * Used across API routes, components, and type definitions
 */

export const EXPENSE_CATEGORIES = [
  "food",
  "transport",
  "entertainment",
  "shopping",
  "bills",
  "health",
  "groceries",
  "travel",
  "education",
  "other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

/**
 * Category icons for UI display
 */
export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  food: "🍔",
  transport: "🚗",
  entertainment: "🎬",
  shopping: "🛍️",
  bills: "📄",
  health: "🏥",
  groceries: "🛒",
  travel: "✈️",
  education: "📚",
  other: "📦",
};

/**
 * Human-readable category labels
 */
export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: "Food",
  transport: "Transport",
  entertainment: "Entertainment",
  shopping: "Shopping",
  bills: "Bills",
  health: "Health",
  groceries: "Groceries",
  travel: "Travel",
  education: "Education",
  other: "Other",
};
