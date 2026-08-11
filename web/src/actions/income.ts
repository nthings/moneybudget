"use server"

import { revalidatePath } from "next/cache"
import { eq, and } from "drizzle-orm"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/db"
import { incomeEntries } from "@/db/schema"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const addIncomeEntrySchema = z.object({
  description: z.string().min(1, "Description is required").max(200, "Description is too long"),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a non-negative number with up to 2 decimal places")
    .transform((v) => parseFloat(v).toFixed(2)),
  receivedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
})

const deleteIncomeEntrySchema = z.object({
  id: z.coerce.number().int().positive("Income entry ID must be a positive integer"),
})

// ─── Server Actions ───────────────────────────────────────────────────────────

/**
 * addIncomeEntry — records a new income receipt for the authenticated user.
 * The receivedAt date determines which calendar month the entry belongs to.
 */
export async function addIncomeEntry(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be signed in to add an income entry" }
  }
  const userId = session.user.id

  const parsed = addIncomeEntrySchema.safeParse({
    description: formData.get("description"),
    amount: formData.get("amount"),
    receivedAt: formData.get("receivedAt"),
  })
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  await db.insert(incomeEntries).values({
    userId,
    description: parsed.data.description,
    amount: parsed.data.amount,
    receivedAt: parsed.data.receivedAt,
  })

  revalidatePath("/allocator")
  return { error: "" }
}

/**
 * deleteIncomeEntry — removes an income entry.
 * The userId ownership guard ensures a user cannot delete another user's entry.
 */
export async function deleteIncomeEntry(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be signed in to delete an income entry" }
  }
  const userId = session.user.id

  const parsed = deleteIncomeEntrySchema.safeParse({
    id: formData.get("id"),
  })
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Ownership guard: WHERE id = ? AND userId = ?
  await db
    .delete(incomeEntries)
    .where(and(eq(incomeEntries.id, parsed.data.id), eq(incomeEntries.userId, userId)))

  revalidatePath("/allocator")
  return { error: "" }
}
