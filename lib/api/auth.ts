import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

export type SessionResult =
  | { success: true; session: AuthSession }
  | { success: false; response: Response };


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

export async function getSession(): Promise<AuthSession | null> {
  return auth.api.getSession({
    headers: await headers(),
  });
}
