import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getAppBaseUrl() {
  return process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
}

export async function GET() {
  const cookieStore = await cookies();

  cookieStore.delete("better-auth.session_token");

  return NextResponse.redirect(new URL("/login", getAppBaseUrl()));
}
