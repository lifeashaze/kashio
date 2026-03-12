import { randomBytes, createHash } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  telegramConnections,
  telegramLinkTokens,
  telegramPendingConfirmations,
  type TelegramPendingConfirmation,
} from "@/lib/schema";
import type {
  TelegramPendingConfirmationState,
  TelegramPendingEditField,
} from "@/lib/telegram/types";

const LINK_TOKEN_TTL_MS = 15 * 60 * 1000;
const PENDING_CONFIRMATION_TTL_MS = 30 * 60 * 1000;

function getTokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getExpiryDate(ttlMs: number) {
  return new Date(Date.now() + ttlMs);
}

export async function createTelegramLinkToken(userId: string) {
  const rawToken = randomBytes(24).toString("hex");
  const expiresAt = getExpiryDate(LINK_TOKEN_TTL_MS);

  await db
    .delete(telegramLinkTokens)
    .where(and(eq(telegramLinkTokens.userId, userId), isNull(telegramLinkTokens.usedAt)));

  await db.insert(telegramLinkTokens).values({
    userId,
    tokenHash: getTokenHash(rawToken),
    expiresAt,
  });

  return {
    token: rawToken,
    expiresAt,
  };
}

export async function consumeTelegramLinkToken(token: string) {
  const tokenHash = getTokenHash(token);
  const now = new Date();

  const [linkToken] = await db
    .select()
    .from(telegramLinkTokens)
    .where(
      and(
        eq(telegramLinkTokens.tokenHash, tokenHash),
        isNull(telegramLinkTokens.usedAt),
        gt(telegramLinkTokens.expiresAt, now)
      )
    )
    .limit(1);

  if (!linkToken) {
    return null;
  }

  await db
    .update(telegramLinkTokens)
    .set({
      usedAt: now,
    })
    .where(eq(telegramLinkTokens.id, linkToken.id));

  return linkToken;
}

export function getTelegramConnectionByUserId(userId: string) {
  return db.query.telegramConnections.findFirst({
    where: eq(telegramConnections.userId, userId),
  });
}

export function getTelegramConnectionByChatId(telegramChatId: string) {
  return db.query.telegramConnections.findFirst({
    where: eq(telegramConnections.telegramChatId, telegramChatId),
  });
}

export function getTelegramConnectionByTelegramUserId(telegramUserId: string) {
  return db.query.telegramConnections.findFirst({
    where: eq(telegramConnections.telegramUserId, telegramUserId),
  });
}

export async function createTelegramConnection(input: {
  userId: string;
  telegramUserId: string;
  telegramChatId: string;
  telegramUsername?: string | null;
  telegramFirstName?: string | null;
  telegramLastName?: string | null;
}) {
  const result = await db
    .insert(telegramConnections)
    .values({
      ...input,
      linkedAt: new Date(),
      lastSeenAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return result[0];
}

export async function disconnectTelegramForUser(userId: string) {
  await db
    .delete(telegramPendingConfirmations)
    .where(eq(telegramPendingConfirmations.userId, userId));

  await db
    .delete(telegramLinkTokens)
    .where(and(eq(telegramLinkTokens.userId, userId), isNull(telegramLinkTokens.usedAt)));

  await db
    .delete(telegramConnections)
    .where(eq(telegramConnections.userId, userId));
}

export async function touchTelegramConnection(connectionId: string) {
  await db
    .update(telegramConnections)
    .set({
      lastSeenAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(telegramConnections.id, connectionId));
}

export async function getActivePendingConfirmation(userId: string, telegramChatId: string) {
  const now = new Date();

  return db.query.telegramPendingConfirmations.findFirst({
    where: and(
      eq(telegramPendingConfirmations.userId, userId),
      eq(telegramPendingConfirmations.telegramChatId, telegramChatId),
      eq(telegramPendingConfirmations.status, "pending"),
      gt(telegramPendingConfirmations.expiresAt, now)
    ),
  });
}

export async function createOrReplacePendingConfirmation(input: {
  userId: string;
  telegramChatId: string;
  rawInput: string;
  parsedExpense: TelegramPendingConfirmationState;
}) {
  await db
    .delete(telegramPendingConfirmations)
    .where(
      and(
        eq(telegramPendingConfirmations.userId, input.userId),
        eq(telegramPendingConfirmations.telegramChatId, input.telegramChatId),
        eq(telegramPendingConfirmations.status, "pending")
      )
    );

  const result = await db
    .insert(telegramPendingConfirmations)
    .values({
      userId: input.userId,
      telegramChatId: input.telegramChatId,
      rawInput: input.rawInput,
      parsedExpenseJson: input.parsedExpense,
      expiresAt: getExpiryDate(PENDING_CONFIRMATION_TTL_MS),
      updatedAt: new Date(),
    })
    .returning();

  return result[0];
}

export async function getPendingConfirmationById(pendingId: string) {
  return db.query.telegramPendingConfirmations.findFirst({
    where: eq(telegramPendingConfirmations.id, pendingId),
  });
}

export async function updatePendingConfirmation(
  pendingId: string,
  input: {
    parsedExpense?: TelegramPendingConfirmationState;
    editField?: TelegramPendingEditField | null;
    telegramMessageId?: number | null;
    status?: "pending" | "completed" | "cancelled";
  }
) {
  const result = await db
    .update(telegramPendingConfirmations)
    .set({
      parsedExpenseJson: input.parsedExpense,
      editField: input.editField,
      telegramMessageId: input.telegramMessageId,
      status: input.status,
      updatedAt: new Date(),
    })
    .where(eq(telegramPendingConfirmations.id, pendingId))
    .returning();

  return result[0];
}

export function getPendingParsedExpense(
  pending: Pick<TelegramPendingConfirmation, "parsedExpenseJson">
): TelegramPendingConfirmationState {
  return pending.parsedExpenseJson as TelegramPendingConfirmationState;
}
