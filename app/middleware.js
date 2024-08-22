// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Allow the request if:
  // 1) It's a request for the NextAuth session or provider fetching
  // 2) The token exists
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Redirect them to login if they don't have a valid token and are requesting a protected route
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
