export function getTelegramWebhookSecret() {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("TELEGRAM_WEBHOOK_SECRET is not configured");
  }

  return secret;
}

export function isValidTelegramWebhookSecret(headerValue: string | null) {
  if (!headerValue) {
    return false;
  }

  return headerValue === getTelegramWebhookSecret();
}
