import "dotenv/config";

export {};

async function main() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const appBaseUrl = process.argv[2] ?? process.env.APP_BASE_URL;

  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is required");
  }

  if (!webhookSecret) {
    throw new Error("TELEGRAM_WEBHOOK_SECRET is required");
  }

  if (!appBaseUrl) {
    throw new Error("APP_BASE_URL or a URL argument is required");
  }

  const normalizedBaseUrl = appBaseUrl.replace(/\/$/, "");
  const webhookUrl = `${normalizedBaseUrl}/api/integrations/telegram/webhook`;

  const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: webhookSecret,
      allowed_updates: ["message", "callback_query"],
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    console.error(data);
    throw new Error(`Failed to set Telegram webhook for ${webhookUrl}`);
  }

  console.log(`Telegram webhook configured: ${webhookUrl}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
