import { CATEGORY_LABELS } from "@/lib/constants/categories";
import { formatRelativeDateLabel } from "@/lib/date";
import type {
  TelegramInlineKeyboardMarkup,
  TelegramPendingConfirmationState,
} from "@/lib/telegram/types";

const TELEGRAM_MESSAGE_LIMIT = 4096;

export function buildTelegramDeepLink(token: string) {
  const username = process.env.TELEGRAM_BOT_USERNAME;
  if (!username) {
    throw new Error("TELEGRAM_BOT_USERNAME is not configured");
  }

  return `https://t.me/${username}?start=link_${token}`;
}

export function truncateTelegramText(text: string) {
  if (text.length <= TELEGRAM_MESSAGE_LIMIT) {
    return text;
  }

  return `${text.slice(0, TELEGRAM_MESSAGE_LIMIT - 1).trimEnd()}…`;
}

export function formatSavedExpenseMessage(expense: {
  amount: number | string;
  description: string;
  category: string;
  date: string;
}) {
  return truncateTelegramText(
    [
      "Saved expense",
      `Amount: $${Number(expense.amount).toFixed(2)}`,
      `Description: ${expense.description}`,
      `Category: ${CATEGORY_LABELS[expense.category as keyof typeof CATEGORY_LABELS] ?? expense.category}`,
      `Date: ${formatRelativeDateLabel(expense.date)}`,
    ].join("\n")
  );
}

export function formatPendingExpenseMessage(
  parsedExpense: TelegramPendingConfirmationState
) {
  const missingFieldsText =
    parsedExpense.missingFields.length > 0
      ? `Missing: ${parsedExpense.missingFields.join(", ")}`
      : "Missing: none";

  return truncateTelegramText(
    [
      "Review expense",
      `Amount: ${parsedExpense.amount == null ? "Missing" : `$${parsedExpense.amount.toFixed(2)}`}`,
      `Description: ${parsedExpense.description ?? "Missing"}`,
      `Category: ${CATEGORY_LABELS[parsedExpense.category]}`,
      `Date: ${formatRelativeDateLabel(parsedExpense.date)}`,
      `Confidence: ${parsedExpense.confidence}`,
      missingFieldsText,
      parsedExpense.reasoning,
    ].join("\n")
  );
}

export function formatTelegramAssistantMessage(text: string) {
  return truncateTelegramText(text.trim());
}

export function getPendingExpenseKeyboard(
  pendingId: string
): TelegramInlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: "Confirm", callback_data: `exp:confirm:${pendingId}` },
        { text: "Cancel", callback_data: `exp:cancel:${pendingId}` },
      ],
      [
        { text: "Edit Amount", callback_data: `exp:edit_amount:${pendingId}` },
        { text: "Edit Description", callback_data: `exp:edit_desc:${pendingId}` },
      ],
      [
        { text: "Edit Category", callback_data: `exp:edit_cat:${pendingId}` },
        { text: "Edit Date", callback_data: `exp:edit_date:${pendingId}` },
      ],
    ],
  };
}

export function getCategoryKeyboard(
  pendingId: string
): TelegramInlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        { text: "Food", callback_data: `exp:edit_cat:${pendingId}:food` },
        { text: "Transport", callback_data: `exp:edit_cat:${pendingId}:transport` },
      ],
      [
        {
          text: "Entertainment",
          callback_data: `exp:edit_cat:${pendingId}:entertainment`,
        },
        { text: "Shopping", callback_data: `exp:edit_cat:${pendingId}:shopping` },
      ],
      [
        { text: "Bills", callback_data: `exp:edit_cat:${pendingId}:bills` },
        { text: "Health", callback_data: `exp:edit_cat:${pendingId}:health` },
      ],
      [
        {
          text: "Groceries",
          callback_data: `exp:edit_cat:${pendingId}:groceries`,
        },
        { text: "Travel", callback_data: `exp:edit_cat:${pendingId}:travel` },
      ],
      [
        {
          text: "Education",
          callback_data: `exp:edit_cat:${pendingId}:education`,
        },
        { text: "Other", callback_data: `exp:edit_cat:${pendingId}:other` },
      ],
      [{ text: "Back", callback_data: `exp:show:${pendingId}` }],
    ],
  };
}
