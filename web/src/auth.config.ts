import type { NextAuthConfig } from "next-auth"

// Edge Runtime-compatible subset of Auth.js config.
// No DB or Node.js-only imports allowed here.
// Used by middleware.ts; full config (with DrizzleAdapter) lives in auth.ts.
export const authConfig: NextAuthConfig = {
  pages: { signIn: "/sign-in" },
  // Trust the Host / X-Forwarded-Host header so redirects use the real hostname
  // rather than the container-internal localhost. Required for LAN IP access and
  // reverse proxies (ngrok, Cloudflare Tunnel, Traefik, etc.).
  trustHost: true,
  providers: [], // Credentials provider added in auth.ts (requires Node.js runtime)
}
