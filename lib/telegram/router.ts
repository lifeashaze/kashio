import { normalizeExpenseDescription } from "@/lib/expenses/text";
import { normalizeDateInput } from "@/lib/date";
import { EXPENSE_CATEGORIES, type ExpenseCategory } from "@/lib/constants/categories";
import { answerExpenseQuestion } from "@/lib/services/expense-assistant";
import { parseExpensePrompt } from "@/lib/services/expense-parser";
import { createExpenseForUser } from "@/lib/services/expense-write";
import {
  answerTelegramCallbackQuery,
  editTelegramMessageText,
  getTelegramBotUsername,
  sendTelegramMessage,
} from "@/lib/telegram/client";
import {
  formatPendingExpenseMessage,
  formatSavedExpenseMessage,
  formatTelegramAssistantMessage,
  getCategoryKeyboard,
  getPendingExpenseKeyboard,
} from "@/lib/telegram/format";
import {
  consumeTelegramLinkToken,
  createOrReplacePendingConfirmation,
  createTelegramConnection,
  getActivePendingConfirmation,
  getPendingConfirmationById,
  getPendingParsedExpense,
  getTelegramConnectionByChatId,
  getTelegramConnectionByTelegramUserId,
  getTelegramConnectionByUserId,
  touchTelegramConnection,
  updatePendingConfirmation,
} from "@/lib/telegram/linking";
import type {
  TelegramCallbackQuery,
  TelegramMessage,
  TelegramPendingConfirmationState,
  TelegramPendingEditField,
  TelegramUpdate,
} from "@/lib/telegram/types";

function parseCommand(text: string) {
  const match = text.match(/^\/([a-z_]+)(?:@\w+)?(?:\s+(.+))?$/i);
  if (!match) {
    return null;
  }

  return {
    command: match[1].toLowerCase(),
    arg: match[2]?.trim() ?? "",
  };
}

function getConnectionPrompt() {
  return [
    "This Telegram chat is not linked to Kashio yet.",
    "Open Kashio, go to Profile > Integrations, and tap Connect Telegram.",
  ].join("\n");
}

function getHelpMessage() {
  return [
    "Send expenses like:",
    "coffee $6",
    "uber to airport $42 yesterday",
    "",
    "Or ask questions like:",
    "How much did I spend this month?",
  ].join("\n");
}

function isPrivateMessage(message: TelegramMessage) {
  return message.chat.type === "private";
}

function makePendingExpenseState(
  parsedExpense: TelegramPendingConfirmationState
): TelegramPendingConfirmationState {
  return {
    ...parsedExpense,
    missingFields: [...parsedExpense.missingFields],
  };
}

function removeMissingField(
  state: TelegramPendingConfirmationState,
  field: "amount" | "description"
) {
  state.missingFields = state.missingFields.filter((item) => item !== field);
}

function isExpenseReadyToSave(parsedExpense: TelegramPendingConfirmationState) {
  return Boolean(
    parsedExpense.isValidExpense &&
      parsedExpense.amount != null &&
      parsedExpense.description &&
      !parsedExpense.missingFields.includes("amount") &&
      !parsedExpense.missingFields.includes("description")
  );
}

async function sendOrEditPendingSummary(
  pendingId: string,
  chatId: string,
  parsedExpense: TelegramPendingConfirmationState,
  messageId?: number | null,
  keyboard = getPendingExpenseKeyboard(pendingId)
) {
  const text = formatPendingExpenseMessage(parsedExpense);

  if (messageId) {
    await editTelegramMessageText({
      chat_id: chatId,
      message_id: messageId,
      text,
      reply_markup: keyboard,
    });

    return { messageId };
  }

  const sentMessage = await sendTelegramMessage({
    chat_id: chatId,
    text,
    reply_markup: keyboard,
  }) as { message_id: number };

  return { messageId: sentMessage.message_id };
}

async function saveConfirmedExpense(input: {
  userId: string;
  chatId: string;
  rawInput: string;
  parsedExpense: TelegramPendingConfirmationState;
}) {
  const savedExpense = await createExpenseForUser(input.userId, {
    amount: input.parsedExpense.amount!,
    description: input.parsedExpense.description!,
    category: input.parsedExpense.category,
    date: input.parsedExpense.date,
    rawInput: input.rawInput,
  });

  await sendTelegramMessage({
    chat_id: input.chatId,
    text: formatSavedExpenseMessage({
      amount: Number(savedExpense.amount),
      description: savedExpense.description,
      category: savedExpense.category,
      date: savedExpense.date,
    }),
  });

  return savedExpense;
}

async function handleStartCommand(message: TelegramMessage, arg: string) {
  const chatId = String(message.chat.id);
  const telegramUserId = String(message.from?.id ?? "");
  if (!arg.startsWith("link_")) {
    await sendTelegramMessage({
      chat_id: chatId,
      text: [
        "Kashio Telegram bot",
        "",
        "Link your account from Kashio Profile > Integrations to start logging expenses here.",
      ].join("\n"),
    });
    return;
  }

  const token = arg.slice("link_".length);
  const linkToken = await consumeTelegramLinkToken(token);

  if (!linkToken) {
    await sendTelegramMessage({
      chat_id: chatId,
      text: "Link expired. Reconnect from Kashio profile.",
    });
    return;
  }

  const existingForUser = await getTelegramConnectionByUserId(linkToken.userId);
  if (existingForUser) {
    await sendTelegramMessage({
      chat_id: chatId,
      text: "This Kashio account is already linked to Telegram. Disconnect it in Kashio before linking a new chat.",
    });
    return;
  }

  const existingForTelegramUser = await getTelegramConnectionByTelegramUserId(telegramUserId);
  if (existingForTelegramUser) {
    await sendTelegramMessage({
      chat_id: chatId,
      text: "This Telegram account is already linked to a Kashio account. Disconnect it first in Kashio.",
    });
    return;
  }

  await createTelegramConnection({
    userId: linkToken.userId,
    telegramUserId,
    telegramChatId: chatId,
    telegramUsername: message.from?.username ?? null,
    telegramFirstName: message.from?.first_name ?? null,
    telegramLastName: message.from?.last_name ?? null,
  });

  await sendTelegramMessage({
    chat_id: chatId,
    text: [
      "Telegram connected to Kashio.",
      "",
      "You can now send expenses like `coffee $6` or ask spending questions.",
    ].join("\n"),
  });
}

async function handlePendingFieldEdit(input: {
  pendingId: string;
  userId: string;
  chatId: string;
  field: TelegramPendingEditField;
  value: string;
  messageId?: number | null;
}) {
  const pending = await getPendingConfirmationById(input.pendingId);
  if (!pending || pending.status !== "pending") {
    await sendTelegramMessage({
      chat_id: input.chatId,
      text: "That pending expense expired. Please resend it.",
    });
    return;
  }

  const parsedExpense = makePendingExpenseState(getPendingParsedExpense(pending));

  if (input.field === "amount") {
    const amount = Number(input.value.replace(/[$,\s]/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) {
      await sendTelegramMessage({
        chat_id: input.chatId,
        text: "Please send a valid amount like `12.50` or `$12.50`.",
      });
      return;
    }
    parsedExpense.amount = amount;
    removeMissingField(parsedExpense, "amount");
  }

  if (input.field === "description") {
    const description = normalizeExpenseDescription(input.value.trim());
    if (!description) {
      await sendTelegramMessage({
        chat_id: input.chatId,
        text: "Please send a short description like `Chipotle - Burrito Bowl`.",
      });
      return;
    }
    parsedExpense.description = description;
    removeMissingField(parsedExpense, "description");
  }

  if (input.field === "date") {
    const normalizedDate =
      input.value.trim().toLowerCase() === "today"
        ? new Date().toISOString().split("T")[0]
        : input.value.trim().toLowerCase() === "yesterday"
          ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          : normalizeDateInput(input.value);

    if (!normalizedDate) {
      await sendTelegramMessage({
        chat_id: input.chatId,
        text: "Please send `today`, `yesterday`, or a date in YYYY-MM-DD format.",
      });
      return;
    }

    parsedExpense.date = normalizedDate;
  }

  parsedExpense.reasoning = "Updated in Telegram before saving.";

  const updatedPending = await updatePendingConfirmation(input.pendingId, {
    parsedExpense,
    editField: null,
  });

  await sendOrEditPendingSummary(
    input.pendingId,
    input.chatId,
    parsedExpense,
    updatedPending.telegramMessageId
  );
}

async function handleLinkedMessage(
  message: TelegramMessage,
  userId: string
) {
  const chatId = String(message.chat.id);
  const text = message.text?.trim();
  if (!text) {
    return;
  }

  const command = parseCommand(text);
  if (command) {
    if (command.command === "help") {
      await sendTelegramMessage({
        chat_id: chatId,
        text: getHelpMessage(),
      });
      return;
    }

    if (command.command === "start") {
      await sendTelegramMessage({
        chat_id: chatId,
        text: getHelpMessage(),
      });
      return;
    }
  }

  const activePending = await getActivePendingConfirmation(userId, chatId);
  if (activePending?.editField) {
    await handlePendingFieldEdit({
      pendingId: activePending.id,
      userId,
      chatId,
      field: activePending.editField as TelegramPendingEditField,
      value: text,
      messageId: activePending.telegramMessageId,
    });
    return;
  }

  const parsedExpense = makePendingExpenseState(await parseExpensePrompt({ prompt: text }));

  if (parsedExpense.isValidExpense) {
    const needsReview =
      parsedExpense.confidence !== "high" ||
      parsedExpense.missingFields.length > 0;

    if (!needsReview && isExpenseReadyToSave(parsedExpense)) {
      await saveConfirmedExpense({
        userId,
        chatId,
        rawInput: text,
        parsedExpense,
      });
      return;
    }

    const pending = await createOrReplacePendingConfirmation({
      userId,
      telegramChatId: chatId,
      rawInput: text,
      parsedExpense,
    });

    const summaryMessage = await sendOrEditPendingSummary(
      pending.id,
      chatId,
      parsedExpense
    );

    await updatePendingConfirmation(pending.id, {
      telegramMessageId: summaryMessage.messageId,
      parsedExpense,
      editField: null,
    });
    return;
  }

  const assistantReply = await answerExpenseQuestion({
    userId,
    prompt: text,
  });

  await sendTelegramMessage({
    chat_id: chatId,
    text: formatTelegramAssistantMessage(assistantReply.text),
  });
}

type ExpenseCallbackAction =
  | { kind: "confirm"; pendingId: string }
  | { kind: "cancel"; pendingId: string }
  | { kind: "edit_amount"; pendingId: string }
  | { kind: "edit_desc"; pendingId: string }
  | { kind: "edit_date"; pendingId: string }
  | { kind: "show"; pendingId: string }
  | { kind: "edit_cat"; pendingId: string; category?: ExpenseCategory };

function parseExpenseCallback(data: string): ExpenseCallbackAction | null {
  const parts = data.split(":");
  if (parts[0] !== "exp" || parts.length < 3) {
    return null;
  }

  const action = parts[1];
  const pendingId = parts[2];

  if (action === "confirm") return { kind: "confirm", pendingId };
  if (action === "cancel") return { kind: "cancel", pendingId };
  if (action === "edit_amount") return { kind: "edit_amount", pendingId };
  if (action === "edit_desc") return { kind: "edit_desc", pendingId };
  if (action === "edit_date") return { kind: "edit_date", pendingId };
  if (action === "show") return { kind: "show", pendingId };
  if (action === "edit_cat") {
    const maybeCategory = parts[3];
    if (maybeCategory && EXPENSE_CATEGORIES.includes(maybeCategory as ExpenseCategory)) {
      return {
        kind: "edit_cat",
        pendingId,
        category: maybeCategory as ExpenseCategory,
      };
    }

    return { kind: "edit_cat", pendingId };
  }

  return null;
}

async function handleCallbackQuery(callbackQuery: TelegramCallbackQuery) {
  const message = callbackQuery.message;
  if (!message || !isPrivateMessage(message)) {
    return;
  }

  const connection = await getTelegramConnectionByChatId(String(message.chat.id));
  if (!connection) {
    await answerTelegramCallbackQuery({
      callback_query_id: callbackQuery.id,
      text: "Connect Telegram from Kashio first.",
      show_alert: true,
    });
    return;
  }

  await touchTelegramConnection(connection.id);

  const action = callbackQuery.data ? parseExpenseCallback(callbackQuery.data) : null;
  if (!action) {
    await answerTelegramCallbackQuery({
      callback_query_id: callbackQuery.id,
      text: "Unknown action.",
    });
    return;
  }

  const pending = await getPendingConfirmationById(action.pendingId);
  if (!pending || pending.userId !== connection.userId || pending.status !== "pending") {
    await answerTelegramCallbackQuery({
      callback_query_id: callbackQuery.id,
      text: "That pending expense expired.",
      show_alert: true,
    });
    return;
  }

  const parsedExpense = makePendingExpenseState(getPendingParsedExpense(pending));
  const chatId = String(message.chat.id);

  if (action.kind === "confirm") {
    if (!isExpenseReadyToSave(parsedExpense)) {
      await answerTelegramCallbackQuery({
        callback_query_id: callbackQuery.id,
        text: "Please finish the missing fields before saving.",
        show_alert: true,
      });
      return;
    }

    await saveConfirmedExpense({
      userId: connection.userId,
      chatId,
      rawInput: pending.rawInput,
      parsedExpense,
    });

    await updatePendingConfirmation(pending.id, {
      status: "completed",
      editField: null,
      parsedExpense,
    });

    await editTelegramMessageText({
      chat_id: chatId,
      message_id: message.message_id,
      text: "Expense confirmed and saved.",
    });

    await answerTelegramCallbackQuery({
      callback_query_id: callbackQuery.id,
      text: "Saved",
    });
    return;
  }

  if (action.kind === "cancel") {
    await updatePendingConfirmation(pending.id, {
      status: "cancelled",
      editField: null,
      parsedExpense,
    });

    await editTelegramMessageText({
      chat_id: chatId,
      message_id: message.message_id,
      text: "Expense cancelled.",
    });

    await answerTelegramCallbackQuery({
      callback_query_id: callbackQuery.id,
      text: "Cancelled",
    });
    return;
  }

  if (action.kind === "edit_amount" || action.kind === "edit_desc" || action.kind === "edit_date") {
    const editFieldMap: Record<
      "edit_amount" | "edit_desc" | "edit_date",
      TelegramPendingEditField
    > = {
      edit_amount: "amount",
      edit_desc: "description",
      edit_date: "date",
    };

    await updatePendingConfirmation(pending.id, {
      editField: editFieldMap[action.kind],
      parsedExpense,
    });

    const promptByField: Record<TelegramPendingEditField, string> = {
      amount: "Send a new amount like `12.50` or `$12.50`.",
      description: "Send a new description.",
      date: "Send `today`, `yesterday`, or a date in YYYY-MM-DD format.",
    };

    await sendTelegramMessage({
      chat_id: chatId,
      text: promptByField[editFieldMap[action.kind]],
    });

    await answerTelegramCallbackQuery({
      callback_query_id: callbackQuery.id,
      text: "Okay",
    });
    return;
  }

  if (action.kind === "show") {
    await sendOrEditPendingSummary(
      pending.id,
      chatId,
      parsedExpense,
      message.message_id
    );
    await answerTelegramCallbackQuery({
      callback_query_id: callbackQuery.id,
      text: "Updated",
    });
    return;
  }

  if (action.kind === "edit_cat") {
    if (!action.category) {
      await editTelegramMessageText({
        chat_id: chatId,
        message_id: message.message_id,
        text: formatPendingExpenseMessage(parsedExpense),
        reply_markup: getCategoryKeyboard(pending.id),
      });

      await answerTelegramCallbackQuery({
        callback_query_id: callbackQuery.id,
        text: "Choose a category",
      });
      return;
    }

    parsedExpense.category = action.category;
    parsedExpense.reasoning = "Updated in Telegram before saving.";

    await updatePendingConfirmation(pending.id, {
      parsedExpense,
      editField: null,
    });

    await sendOrEditPendingSummary(
      pending.id,
      chatId,
      parsedExpense,
      message.message_id
    );

    await answerTelegramCallbackQuery({
      callback_query_id: callbackQuery.id,
      text: "Category updated",
    });
  }
}

export async function processTelegramUpdate(update: TelegramUpdate) {
  if (update.callback_query) {
    await handleCallbackQuery(update.callback_query);
    return;
  }

  if (!update.message || !isPrivateMessage(update.message)) {
    return;
  }

  const message = update.message;
  const text = message.text?.trim();

  if (!text) {
    return;
  }

  const command = parseCommand(text);
  if (command?.command === "start") {
    await handleStartCommand(message, command.arg);
    return;
  }

  const connection = await getTelegramConnectionByChatId(String(message.chat.id));
  if (!connection) {
    await sendTelegramMessage({
      chat_id: String(message.chat.id),
      text: getConnectionPrompt(),
    });
    return;
  }

  await touchTelegramConnection(connection.id);
  await handleLinkedMessage(message, connection.userId);
}

export function getTelegramBotUrl() {
  return `https://t.me/${getTelegramBotUsername()}`;
}
