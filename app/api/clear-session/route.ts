import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  // Clear Better Auth session cookie
  cookieStore.delete("better-auth.session_token");

  // Redirect to login
  return NextResponse.redirect(new URL("/login", process.env.BETTER_AUTH_URL || "http://localhost:3000"));
}
