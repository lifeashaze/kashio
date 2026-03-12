import { requireAuth } from "@/lib/api/auth";
import { success } from "@/lib/api/responses";
import { buildTelegramDeepLink } from "@/lib/telegram/format";
import { createTelegramLinkToken } from "@/lib/telegram/linking";

export async function POST() {
  const result = await requireAuth();
  if (!result.success) {
    return result.response;
  }

  const { token, expiresAt } = await createTelegramLinkToken(result.session.user.id);

  return success({
    botUsername: process.env.TELEGRAM_BOT_USERNAME ?? "",
    deepLinkUrl: buildTelegramDeepLink(token),
    expiresAt: expiresAt.toISOString(),
  });
}
