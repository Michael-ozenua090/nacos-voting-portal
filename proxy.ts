import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected admin route prefixes
const ADMIN_PATHS = ["/admin/dashboard", "/admin/categories"];
const LOGIN_PATH = "/admin/login";

// Cookie name — will be replaced with Supabase Auth cookie when integrating backend
const SESSION_COOKIE = "nacos-admin-session";

// Next.js 16+ uses "proxy" (renamed from "middleware")
// Structured for easy Supabase Auth migration: swap cookie check for session validation
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminProtected = ADMIN_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (!isAdminProtected) {
    return NextResponse.next();
  }

  // Server-side cookie check (NOT localStorage — cookie is readable by Next.js edge runtime)
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (!sessionToken) {
    // No session → redirect to login with return_to for post-login redirect
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("return_to", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // TODO: Supabase Auth migration — replace above with:
  //   import { createServerClient } from "@supabase/ssr";
  //   const supabase = createServerClient(...);
  //   const { data: { session } } = await supabase.auth.getSession();
  //   if (!session) return NextResponse.redirect(loginUrl);

  const response = NextResponse.next();

  // Security headers on all protected admin responses
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/categories/:path*",
  ],
};
