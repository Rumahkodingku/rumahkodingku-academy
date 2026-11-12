import { NextResponse, type NextRequest } from "next/server";
import { env } from "@rumahkodingku-academy/env/web";

import { DEFAULT_LOCALE, isLocale, isProtectedPath, localizedPath } from "@/lib/i18n/routing";

const PUBLIC_FILE = /\.[^/]+$/;

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const segments = normalizedPath.split("/").filter(Boolean);
  const firstSegment = segments[0];
  const hasLocale = firstSegment !== undefined && isLocale(firstSegment);
  const locale = hasLocale ? firstSegment : DEFAULT_LOCALE;
  const routePath = hasLocale ? `/${segments.slice(1).join("/")}` : normalizedPath;

  if (isProtectedPath(routePath) && !request.cookies.get(env.AUTH_SESSION_COOKIE)?.value) {
    const loginPath = localizedPath(locale, "/login");
    const nextPath = `${normalizedPath}${search}`;
    const loginUrl = new URL(loginPath, request.url);
    loginUrl.searchParams.set("next", nextPath);

    return NextResponse.redirect(loginUrl);
  }

  if (!hasLocale) {
    const localeUrl = new URL(request.url);
    localeUrl.pathname = `/${DEFAULT_LOCALE}${normalizedPath === "/" ? "" : normalizedPath}`;
    return NextResponse.rewrite(localeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
