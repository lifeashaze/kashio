import { requireAuth } from "@/lib/api/auth";
import { success } from "@/lib/api/responses";
import { type TelegramConnection } from "@/lib/schema";
import {
  disconnectTelegramForUser,
  getTelegramConnectionByUserId,
} from "@/lib/telegram/linking";
import type { TelegramLinkStatusResponse } from "@/lib/telegram/types";

function serializeConnection(connection: TelegramConnection | null): TelegramLinkStatusResponse {
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

export async function GET() {
  const result = await requireAuth();
  if (!result.success) {
    return result.response;
  }

  const connection = await getTelegramConnectionByUserId(result.session.user.id);
  return success(serializeConnection(connection ?? null));
}

export async function DELETE() {
  const result = await requireAuth();
  if (!result.success) {
    return result.response;
  }

  await disconnectTelegramForUser(result.session.user.id);

  return success(serializeConnection(null));
}
