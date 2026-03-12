import { eq } from "drizzle-orm";
import { unauthorized, success, serverError } from "@/lib/api/responses";
import { db } from "@/lib/db";
import { telegramWebhookEvents } from "@/lib/schema";
import { processTelegramUpdate } from "@/lib/telegram/router";
import { isValidTelegramWebhookSecret } from "@/lib/telegram/security";
import type { TelegramUpdate } from "@/lib/telegram/types";

function getUpdateType(update: TelegramUpdate) {
  if (update.callback_query) {
    return "callback_query";
  }

  if (update.message) {
    return "message";
  }

  return "unknown";
}

export async function POST(req: Request) {
  if (
    !isValidTelegramWebhookSecret(
      req.headers.get("x-telegram-bot-api-secret-token")
    )
  ) {
    return unauthorized("Invalid Telegram webhook secret");
  }

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return unauthorized("Invalid Telegram webhook payload");
  }

  const updateType = getUpdateType(update);
  const inserted = await db
    .insert(telegramWebhookEvents)
    .values({
      telegramUpdateId: String(update.update_id),
      updateType,
      payloadJson: update,
      status: "received",
    })
    .onConflictDoNothing()
    .returning({ id: telegramWebhookEvents.id });

  if (inserted.length === 0) {
    return success({ ok: true });
  }

  const eventId = inserted[0].id;

  try {
    if (updateType === "message" || updateType === "callback_query") {
      await processTelegramUpdate(update);
    }

    await db
      .update(telegramWebhookEvents)
      .set({
        status: "processed",
        processedAt: new Date(),
      })
      .where(eq(telegramWebhookEvents.id, eventId));

    return success({ ok: true });
  } catch (error) {
    await db
      .update(telegramWebhookEvents)
      .set({
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      })
      .where(eq(telegramWebhookEvents.id, eventId));

    return serverError("Failed to process Telegram webhook", error);
  }
}
