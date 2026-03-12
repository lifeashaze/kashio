import { NextResponse, type NextRequest } from "next/server";
import { authSessionCookieNames } from "@/lib/auth-config";

function hasSessionCookie(request: NextRequest) {
  return authSessionCookieNames.some((cookieName) =>
    request.cookies.has(cookieName),
  );
}

function isAuthRoute(pathname: string) {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password")
  );
}

function isProtectedRoute(pathname: string) {
  return (
    pathname.startsWith("/home") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/onboarding")
  );
}

export function proxy(request: NextRequest) {
  const hasSession = hasSessionCookie(request);

  if (hasSession && isAuthRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!hasSession && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)"],
};
