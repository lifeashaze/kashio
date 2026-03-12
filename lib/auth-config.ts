const LOCAL_TRUSTED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

export const enabledSocialProviders = {
  github: Boolean(
    process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
  ),
  google: Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  ),
} as const;

export const authSessionCookieNames = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
] as const;

function toOrigin(url?: string) {
  if (!url) {
    return null;
  }

  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export function getTrustedOrigins() {
  const origins = new Set<string>();

  if (process.env.NODE_ENV === "development") {
    for (const origin of LOCAL_TRUSTED_ORIGINS) {
      origins.add(origin);
    }
  }

  for (const origin of [
    toOrigin(process.env.BETTER_AUTH_URL),
    toOrigin(process.env.APP_BASE_URL),
  ]) {
    if (origin) {
      origins.add(origin);
    }
  }

  return [...origins];
}

export function getSocialProviders() {
  const providers = {
    ...(enabledSocialProviders.github
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          },
        }
      : {}),
    ...(enabledSocialProviders.google
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          },
        }
      : {}),
  };

  return Object.keys(providers).length > 0 ? providers : undefined;
}
