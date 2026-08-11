"use server"

import { revalidatePath } from "next/cache"
import { eq, and } from "drizzle-orm"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/db"
import { transactions } from "@/db/schema"
import { TRANSACTION_CATEGORIES } from "@/lib/transaction-categories"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const addTransactionSchema = z.object({
  merchant: z.string().min(1, "Merchant is required").max(200, "Merchant name is too long"),
  category: z.enum(TRANSACTION_CATEGORIES, {
    errorMap: () => ({ message: "Invalid category" }),
  }),
  amount: z
    .string()
    .regex(
      /^-?\d+(\.\d{1,2})?$/,
      "Amount must be a number with up to 2 decimal places (negative for expenses)",
    )
    .transform((v) => parseFloat(v).toFixed(2)),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
})

const deleteTransactionSchema = z.object({
  id: z.coerce.number().int().positive("Transaction ID must be a positive integer"),
})

// ─── Server Actions ───────────────────────────────────────────────────────────

/**
 * addTransaction — creates a new transaction for the authenticated user.
 * Negative amounts represent expenses; positive amounts represent income.
 */
export async function addTransaction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be signed in to add a transaction" }
  }
  const userId = session.user.id

  const parsed = addTransactionSchema.safeParse({
    merchant: formData.get("merchant"),
    category: formData.get("category"),
    amount: formData.get("amount"),
    date: formData.get("date"),
  })
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  await db.insert(transactions).values({
    userId,
    merchant: parsed.data.merchant,
    category: parsed.data.category,
    amount: parsed.data.amount,
    date: parsed.data.date,
  })

  revalidatePath("/transactions")
  revalidatePath("/allocator")
  revalidatePath("/dashboard")
  return { error: "" }
}

/**
 * deleteTransaction — removes a transaction by id.
 * The userId ownership guard ensures a user cannot delete another user's transaction.
 */
export async function deleteTransaction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be signed in to delete a transaction" }
  }
  const userId = session.user.id

  const parsed = deleteTransactionSchema.safeParse({
    id: formData.get("id"),
  })
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Ownership guard: WHERE id = ? AND userId = ?
  await db
    .delete(transactions)
    .where(
      and(
        eq(transactions.id, parsed.data.id),
        eq(transactions.userId, userId),
      ),
    )

  revalidatePath("/transactions")
  revalidatePath("/allocator")
  revalidatePath("/dashboard")
  return { error: "" }
}
