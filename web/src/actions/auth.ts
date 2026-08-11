"use server"

import { AuthError } from "next-auth"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { users } from "@/db/schema"
import { hashPassword } from "@/lib/password"
import { signIn, signOut } from "@/auth"
import { seedDemoData } from "@/lib/seed"

// ─── Schemas ─────────────────────────────────────────────────────────────────

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

// ─── Server Actions ───────────────────────────────────────────────────────────

/**
 * createUser — sign-up Server Action.
 * Validates input, checks for duplicate email, inserts the user, then calls
 * signIn("credentials") which throws NEXT_REDIRECT on success (expected).
 */
export async function createUser(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { email, password } = parsed.data

  // Reject duplicate emails before hashing (cheap fast-path)
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  })
  if (existing) {
    return { error: "An account with this email already exists" }
  }

  const hash = await hashPassword(password)
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      password: hash,
      name: email.split("@")[0], // default display name from email local-part
    })
    .returning({ id: users.id })

  // Seed demo data — failures are caught inside seedDemoData and emitted as
  // console.warn; sign-up is never blocked by a seed failure.
  await seedDemoData(newUser.id)

  // signIn() throws NEXT_REDIRECT on success — Next.js intercepts it,
  // so this line is unreachable on the happy path.
  await signIn("credentials", { email, password, redirectTo: "/dashboard" })

  // Unreachable; satisfies TypeScript return type
  return { error: "" }
}

/**
 * signOutUser — sign-out Server Action.
 * Redirects to /sign-in on completion (throws NEXT_REDIRECT, as expected).
 */
export async function signOutUser(): Promise<void> {
  await signOut({ redirectTo: "/sign-in" })
}

/**
 * signInWithCredentials — sign-in Server Action.
 * Catches AuthError (bad credentials) and re-throws NEXT_REDIRECT so Next.js
 * can perform the navigation after a successful login.
 */
export async function signInWithCredentials(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { email, password } = parsed.data

  try {
    // On success this throws NEXT_REDIRECT — must NOT be caught here
    await signIn("credentials", { email, password, redirectTo: "/dashboard" })
  } catch (err) {
    if (err instanceof AuthError) {
      // CredentialsSignin or any other Auth.js-level failure
      return { error: "Invalid email or password" }
    }
    // Re-throw everything else (including NEXT_REDIRECT)
    throw err
  }

  // Unreachable; satisfies TypeScript return type
  return { error: "" }
}
