import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Session with user information
 */
export type AuthSession = {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

/**
 * Result of session validation
 */
export type SessionResult =
  | { success: true; session: AuthSession }
  | { success: false; response: Response };

/**
 * Validates the current session and returns either the session or an error response
 *
 * Usage in API routes:
 * ```typescript
 * const result = await requireAuth();
 * if (!result.success) return result.response;
 * const { session } = result;
 * ```
 *
 * @returns Session if authenticated, or error Response if not
 */
export async function requireAuth(): Promise<SessionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { success: true, session };
}

/**
 * Gets the current session without throwing/returning error
 * Useful for optional authentication scenarios
 *
 * @returns Session if authenticated, null if not
 */
export async function getSession(): Promise<AuthSession | null> {
  return auth.api.getSession({
    headers: await headers(),
  });
}
