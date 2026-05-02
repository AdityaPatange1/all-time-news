import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

function jwtKey(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const key = jwtKey();
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isAuthed = async () => {
    if (!token || !key) return false;
    try {
      await jwtVerify(token, key, { algorithms: ["HS256"] });
      return true;
    } catch {
      return false;
    }
  };

  if (pathname.startsWith("/console")) {
    if (!(await isAuthed())) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/signup") {
    if (await isAuthed()) {
      return NextResponse.redirect(new URL("/console/feed", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/console/:path*", "/login", "/signup"],
};
