import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isPublic =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  // Avoid redirect loop: authenticated users visiting public auth pages go to /dashboard
  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
})

export const config = {
  // Exclude Auth.js API routes, Next.js static assets, and favicon from the auth guard
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
