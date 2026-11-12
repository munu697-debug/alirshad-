import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdmin = (await verifyAdminToken(req.cookies.get(ADMIN_COOKIE)?.value)) !== null;

  if (pathname.startsWith("/dashboard")) {
    if (!isAdmin) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Admin-only API surface: any mutating method, plus uploads.
  if (pathname.startsWith("/api/")) {
    const mutating = req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS";
    const adminOnly =
      pathname.startsWith("/api/upload") ||
      (mutating &&
        (pathname.startsWith("/api/posts") ||
          pathname.startsWith("/api/issues") ||
          pathname.startsWith("/api/categories") ||
          /^\/api\/comments\/[^/]+/.test(pathname)));
    if (adminOnly && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
