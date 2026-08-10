import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

// Build a middleware-only NextAuth instance from the Edge-safe config.
// This avoids bundling pg (which uses Node.js crypto) into the Edge Runtime.
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isPublic =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/api/auth")

  // Use the Host header so redirects work regardless of which hostname the browser used
  // (localhost, LAN IP, etc.) — Next.js dev mode normalizes req.url to its internal address.
  const host = req.headers.get("host") ?? req.nextUrl.host
  const origin = `${req.nextUrl.protocol}//${host}`

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/sign-in", origin))
  }

  // Avoid redirect loop: authenticated users visiting public auth pages go to /dashboard
  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", origin))
  }
})

export const config = {
  // Exclude Auth.js API routes, Next.js static assets, and favicon from the auth guard
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
