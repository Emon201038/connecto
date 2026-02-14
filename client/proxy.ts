import { NextResponse } from "next/server";
import { auth } from "./auth";
import {
  API_AUTH_PREFIX,
  AUTH_ROUTES,
  PUBLIC_ROUTES,
} from "./constants/routes";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  const pathname = nextUrl.pathname;

  const isApiRoute = pathname.startsWith(API_AUTH_PREFIX);
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // --- 1. Skip API routes
  if (isApiRoute) return null;

  // --- 2. If user is logged in but tries to access login/register → send home
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // --- 3. If user is NOT logged in and route is protected → send login
  if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // --- 4. Otherwise → allow
  return NextResponse.next();
});

export const config = {
  matcher: [
    /**
     * Run middleware on all routes except:
     * - /api (API routes)
     * - /_next/static (Next.js internals)
     * - /_next/image (Next.js image optimizer)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Any file with an extension (.png, .jpg, .svg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)).*)",
  ],
};
