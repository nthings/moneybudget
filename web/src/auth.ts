import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users, accounts, sessions, verificationTokens } from "@/db/schema"
import { verifyPassword } from "@/lib/password"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  // JWT strategy: session token is a signed cookie — no DB round-trip needed in middleware.
  // DrizzleAdapter is still used for user/account creation; the sessions table is created
  // but not used for session storage in this mode.
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        })

        if (!user?.password) return null

        const valid = await verifyPassword(
          credentials.password as string,
          user.password,
        )
        if (!valid) return null

        // Return only the safe subset — stored in the JWT
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  callbacks: {
    // Persist user.id into the JWT on first sign-in
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    // Expose user.id to server components via session.user.id
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
})
