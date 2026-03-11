/**
 * Reset Demo Script — clears all data for the demo account
 *
 * Usage:
 *   bun scripts/reset-demo.ts
 */

import * as dotenv from "dotenv";
import { db } from "../lib/db";
import { expenses } from "../lib/schema";
import { eq } from "drizzle-orm";

dotenv.config({ path: ".env.local" });

const BASE_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const DEMO_EMAIL = "demo@kashio.app";
const DEMO_PASSWORD = "demo1234!";

async function main() {
  console.log("🗑️  Kashio Demo Reset\n");

  const signInRes = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
    redirect: "manual",
  });

  if (!signInRes.ok) {
    console.error(`❌ Sign-in failed (${signInRes.status}) — is the dev server running and demo account created?`);
    process.exit(1);
  }

  const cookie = signInRes.headers.get("set-cookie")?.match(/better-auth\.session_token=([^;,\s]+)/)?.[0];
  if (!cookie) {
    console.error("❌ Could not extract session cookie");
    process.exit(1);
  }

  const sessionRes = await fetch(`${BASE_URL}/api/auth/get-session`, { headers: { Cookie: cookie } });
  const session = (await sessionRes.json()) as { user?: { id: string } };
  const userId = session.user?.id;
  if (!userId) {
    console.error("❌ Could not get user ID");
    process.exit(1);
  }

  const result = await db.delete(expenses).where(eq(expenses.userId, userId)).returning();
  console.log(`✅ Deleted ${result.length} expenses for ${DEMO_EMAIL}\n`);

  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Reset failed:", err.message);
  process.exit(1);
});
