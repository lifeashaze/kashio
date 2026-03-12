import { requireAuth } from "@/lib/api/auth";
import { success } from "@/lib/api/responses";
import {
  disconnectTelegramForUser,
} from "@/lib/telegram/linking";
import { getTelegramIntegrationStatus, serializeTelegramConnection } from "@/lib/telegram/status";

export async function GET() {
  const result = await requireAuth();
  if (!result.success) {
    return result.response;
  }

  return success(await getTelegramIntegrationStatus(result.session.user.id));
}

export async function DELETE() {
  const result = await requireAuth();
  if (!result.success) {
    return result.response;
  }

  await disconnectTelegramForUser(result.session.user.id);

  return success(serializeTelegramConnection(null));
}
