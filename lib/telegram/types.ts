import type { ExpenseCategory } from "@/lib/constants/categories";
import type { ParsedExpense } from "@/lib/expenses/schemas";

export type TelegramChat = {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  username?: string;
  first_name?: string;
  last_name?: string;
};

export type TelegramUser = {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
};

export type TelegramMessage = {
  message_id: number;
  text?: string;
  chat: TelegramChat;
  from?: TelegramUser;
};

export type TelegramCallbackQuery = {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
};

export type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
};

export type TelegramInlineKeyboardButton = {
  text: string;
  callback_data?: string;
  url?: string;
};

export type TelegramInlineKeyboardMarkup = {
  inline_keyboard: TelegramInlineKeyboardButton[][];
};

export type TelegramSendMessagePayload = {
  chat_id: string | number;
  text: string;
  reply_markup?: TelegramInlineKeyboardMarkup;
};

export type TelegramEditMessageTextPayload = {
  chat_id: string | number;
  message_id: number;
  text: string;
  reply_markup?: TelegramInlineKeyboardMarkup;
};

export type TelegramAnswerCallbackQueryPayload = {
  callback_query_id: string;
  text?: string;
  show_alert?: boolean;
};

export type TelegramSetWebhookPayload = {
  url: string;
  secret_token: string;
  allowed_updates: Array<"message" | "callback_query">;
};

export type TelegramPendingEditField = "amount" | "description" | "date";

export type TelegramPendingConfirmationState = ParsedExpense & {
  category: ExpenseCategory;
};

export type TelegramLinkStatusResponse = {
  connected: boolean;
  botUsername: string;
  connection: null | {
    telegramUsername: string | null;
    telegramFirstName: string | null;
    linkedAt: string;
    lastSeenAt: string | null;
  };
};
