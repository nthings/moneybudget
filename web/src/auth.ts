import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users, accounts, sessions, verificationTokens } from "@/db/schema"
import { verifyPassword } from "@/lib/password"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: "database" },
  pages: { signIn: "/sign-in" },
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

        // Return only the safe subset — Auth.js stores this in the session
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  callbacks: {
    // Include user.id in the session so server components can query by userId
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})
