import type {
  TelegramAnswerCallbackQueryPayload,
  TelegramEditMessageTextPayload,
  TelegramSendMessagePayload,
  TelegramSetWebhookPayload,
} from "@/lib/telegram/types";

const TELEGRAM_API_BASE = "https://api.telegram.org";

function getTelegramBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }

  return token;
}

async function telegramRequest<TResponse>(
  method: string,
  payload: Record<string, unknown>
): Promise<TResponse> {
  const response = await fetch(
    `${TELEGRAM_API_BASE}/bot${getTelegramBotToken()}/${method}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(
      data?.description || `Telegram API request failed for ${method}`
    );
  }

  return data.result as TResponse;
}

export function getTelegramBotUsername() {
  const username = process.env.TELEGRAM_BOT_USERNAME;
  if (!username) {
    throw new Error("TELEGRAM_BOT_USERNAME is not configured");
  }

  return username;
}

export async function sendTelegramMessage(payload: TelegramSendMessagePayload) {
  return telegramRequest("sendMessage", payload);
}

export async function editTelegramMessageText(
  payload: TelegramEditMessageTextPayload
) {
  return telegramRequest("editMessageText", payload);
}

export async function answerTelegramCallbackQuery(
  payload: TelegramAnswerCallbackQueryPayload
) {
  return telegramRequest("answerCallbackQuery", payload);
}

export async function setTelegramWebhook(payload: TelegramSetWebhookPayload) {
  return telegramRequest("setWebhook", payload);
}
