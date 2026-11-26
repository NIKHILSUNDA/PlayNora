import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/config/api";

/**
 * UX layer ONLY. It redirects visitors who have no session cookie away from /admin/*
 * so they land on the login page instead of a loading screen. It cannot verify the
 * cookie and is NOT a security boundary: the Spring Boot API must authorise every
 * /api/v1/admin/** request with the ADMIN role.
 */
export function middleware(req: NextRequest) {
  if (!SESSION_COOKIE) return NextResponse.next();
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login" || req.cookies.has(SESSION_COOKIE)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(url);
}
export const config = { matcher: ["/admin/:path*"] };
