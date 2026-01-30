import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/home"];
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("better-auth.session_token");
  const hasSession = !!sessionCookie;

  // Don't redirect auth routes if there's a session cookie
  // Let the page handle invalid sessions
  if (authRoutes.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (protectedRoutes.some(route => pathname.startsWith(route)) && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
