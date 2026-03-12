const RESEND_API_URL = "https://api.resend.com/emails";

type AuthEmailOptions = {
  actionLabel: string;
  actionUrl: string;
  heading: string;
  subject: string;
  text: string;
  to: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderHtmlEmail({
  actionLabel,
  actionUrl,
  heading,
  text,
}: Omit<AuthEmailOptions, "subject" | "to">) {
  const safeHeading = escapeHtml(heading);
  const safeText = escapeHtml(text);
  const safeActionLabel = escapeHtml(actionLabel);
  const safeActionUrl = escapeHtml(actionUrl);

  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f6f3eb;padding:32px 16px;font-family:Georgia,serif;color:#20150f;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;border:1px solid #d9ccbc;background:#fffdf8;">
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#7d5f44;">Kashio</p>
                <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">${safeHeading}</h1>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#4a3728;">${safeText}</p>
                <p style="margin:0 0 24px;">
                  <a href="${safeActionUrl}" style="display:inline-block;background:#20150f;color:#fffdf8;padding:12px 18px;text-decoration:none;font-size:14px;font-weight:600;">
                    ${safeActionLabel}
                  </a>
                </p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:#6a5140;">
                  If the button does not work, open this link:
                </p>
                <p style="margin:8px 0 0;font-size:13px;line-height:1.6;word-break:break-all;">
                  <a href="${safeActionUrl}" style="color:#7d5f44;">${safeActionUrl}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendWithResend(email: AuthEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_FROM_EMAIL;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[auth-email] ${email.subject}: ${email.actionUrl}`);
      return;
    }

    throw new Error(
      "Auth email delivery is not configured. Set RESEND_API_KEY and AUTH_FROM_EMAIL.",
    );
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email.to],
      subject: email.subject,
      html: renderHtmlEmail(email),
      text: `${email.heading}\n\n${email.text}\n\n${email.actionLabel}: ${email.actionUrl}`,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send auth email: ${errorText}`);
  }
}

export async function sendVerificationEmail(to: string, actionUrl: string) {
  await sendWithResend({
    to,
    actionUrl,
    subject: "Verify your Kashio account",
    heading: "Verify your email",
    text: "Confirm your email address to finish creating your account and start tracking expenses.",
    actionLabel: "Verify email",
  });
}

export async function sendResetPasswordEmail(to: string, actionUrl: string) {
  await sendWithResend({
    to,
    actionUrl,
    subject: "Reset your Kashio password",
    heading: "Reset your password",
    text: "Use the link below to choose a new password for your Kashio account.",
    actionLabel: "Reset password",
  });
}
