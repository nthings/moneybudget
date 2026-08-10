"use server"

import { revalidatePath } from "next/cache"
import { eq, and } from "drizzle-orm"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/db"
import { budgetPeriods, budgetItems } from "@/db/schema"

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the current calendar month as { year, month } (month is 1-based). */
function currentPeriod(): { year: number; month: number } {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

/**
 * Resolves (or creates) the budgetPeriods row for the authenticated user in
 * the current calendar month.  Returns the row id.
 * Throws if the session is absent.
 */
async function requirePeriod(userId: string): Promise<number> {
  const { year, month } = currentPeriod()

  const existing = await db.query.budgetPeriods.findFirst({
    where: and(
      eq(budgetPeriods.userId, userId),
      eq(budgetPeriods.year, year),
      eq(budgetPeriods.month, month),
    ),
  })
  if (existing) return existing.id

  const [created] = await db
    .insert(budgetPeriods)
    .values({ userId, year, month, income: "0" })
    .returning({ id: budgetPeriods.id })
  return created.id
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const updateIncomeSchema = z.object({
  income: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Income must be a non-negative number with up to 2 decimal places")
    .transform((v) => parseFloat(v).toFixed(2)),
})

const addBudgetItemSchema = z.object({
  tier: z.enum(["essential", "financial", "lifestyle"], {
    errorMap: () => ({ message: "Tier must be essential, financial, or lifestyle" }),
  }),
  label: z.string().min(1, "Label is required").max(100, "Label is too long"),
  allocatedAmount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a non-negative number with up to 2 decimal places")
    .transform((v) => parseFloat(v).toFixed(2)),
})

const deleteBudgetItemSchema = z.object({
  id: z.coerce.number().int().positive("Budget item ID must be a positive integer"),
})

// ─── Server Actions ───────────────────────────────────────────────────────────

/**
 * updateIncome — sets the monthly income for the current calendar month.
 * Upserts the budgetPeriods row so the allocator always has a period.
 */
export async function updateIncome(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be signed in to update income" }
  }
  const userId = session.user.id

  const parsed = updateIncomeSchema.safeParse({
    income: formData.get("income"),
  })
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { year, month } = currentPeriod()

  await db
    .insert(budgetPeriods)
    .values({ userId, year, month, income: parsed.data.income })
    .onConflictDoUpdate({
      target: [budgetPeriods.userId, budgetPeriods.year, budgetPeriods.month],
      set: { income: parsed.data.income },
      // Ownership is guaranteed by the conflict target — only the matching
      // (userId, year, month) row is updated.
    })

  revalidatePath("/allocator")
  return { error: "" }
}

/**
 * addBudgetItem — creates a new budget line item for the current calendar month.
 */
export async function addBudgetItem(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be signed in to add a budget item" }
  }
  const userId = session.user.id

  const parsed = addBudgetItemSchema.safeParse({
    tier: formData.get("tier"),
    label: formData.get("label"),
    allocatedAmount: formData.get("allocatedAmount"),
  })
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Ensure the period row exists before inserting an item
  await requirePeriod(userId)

  const { year, month } = currentPeriod()

  await db.insert(budgetItems).values({
    userId,
    tier: parsed.data.tier,
    label: parsed.data.label,
    allocatedAmount: parsed.data.allocatedAmount,
    year,
    month,
  })

  revalidatePath("/allocator")
  return { error: "" }
}

/**
 * updateBudgetItem — updates the label and/or allocatedAmount of an existing
 * budget item.  The userId ownership guard prevents cross-user mutation.
 */
export async function updateBudgetItem(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be signed in to update a budget item" }
  }
  const userId = session.user.id

  const idRaw = formData.get("id")
  const parsed = z
    .object({
      id: z.coerce.number().int().positive(),
      label: z.string().min(1).max(100).optional(),
      allocatedAmount: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/)
        .transform((v) => parseFloat(v).toFixed(2))
        .optional(),
    })
    .safeParse({
      id: idRaw,
      label: formData.get("label") ?? undefined,
      allocatedAmount: formData.get("allocatedAmount") ?? undefined,
    })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { id, ...fields } = parsed.data

  if (Object.keys(fields).length === 0) {
    return { error: "No fields to update" }
  }

  // Ownership guard: WHERE id = ? AND userId = ?
  await db
    .update(budgetItems)
    .set(fields)
    .where(and(eq(budgetItems.id, id), eq(budgetItems.userId, userId)))

  revalidatePath("/allocator")
  return { error: "" }
}

/**
 * deleteBudgetItem — removes a budget line item.
 * The userId ownership guard ensures a user cannot delete another user's item.
 */
export async function deleteBudgetItem(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be signed in to delete a budget item" }
  }
  const userId = session.user.id

  const parsed = deleteBudgetItemSchema.safeParse({
    id: formData.get("id"),
  })
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Ownership guard: WHERE id = ? AND userId = ?
  await db
    .delete(budgetItems)
    .where(and(eq(budgetItems.id, parsed.data.id), eq(budgetItems.userId, userId)))

  revalidatePath("/allocator")
  return { error: "" }
}
