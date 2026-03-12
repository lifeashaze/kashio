import { cache } from "react";
import type { TelegramConnection } from "@/lib/schema";
import { getTelegramConnectionByUserId } from "@/lib/telegram/linking";
import type { TelegramLinkStatusResponse } from "@/lib/telegram/types";

export function serializeTelegramConnection(
  connection: TelegramConnection | null
): TelegramLinkStatusResponse {
  return {
    connected: Boolean(connection),
    botUsername: process.env.TELEGRAM_BOT_USERNAME ?? "",
    connection: connection
      ? {
          telegramUsername: connection.telegramUsername,
          telegramFirstName: connection.telegramFirstName,
          linkedAt: connection.linkedAt.toISOString(),
          lastSeenAt: connection.lastSeenAt?.toISOString() ?? null,
        }
      : null,
  };
}

export const getTelegramIntegrationStatus = cache(async function getTelegramIntegrationStatus(
  userId: string
) {
  const connection = await getTelegramConnectionByUserId(userId);
  return serializeTelegramConnection(connection ?? null);
});
