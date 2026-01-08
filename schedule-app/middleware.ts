import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
    "/login",
    "/api/auth",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    const hasSession =
        req.cookies.get("next-auth.session-token") ||
        req.cookies.get("__Secure-next-auth.session-token");

    if (!hasSession) {
        return NextResponse.redirect(
            new URL("/login", req.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|static).*)"],
};