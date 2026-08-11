"use server"

import { revalidatePath } from "next/cache"
import { eq, and } from "drizzle-orm"
import { z } from "zod"
import { auth } from "@/auth"
import { db } from "@/db"
import { piggyBankGoals } from "@/db/schema"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const createGoalSchema = z.object({
  name: z
    .string()
    .min(1, "Goal name is required")
    .max(200, "Goal name is too long"),
  targetAmount: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Target amount must be a positive number with up to 2 decimal places",
    )
    .refine((v) => parseFloat(v) > 0, {
      message: "Target amount must be greater than 0",
    })
    .transform((v) => parseFloat(v).toFixed(2)),
  // Optional: monthly contribution that auto-populates the Allocator
  // Financial Goals tier. Empty string is treated as null.
  monthlyContribution: z
    .string()
    .optional()
    .transform((v) => {
      if (!v || v.trim() === "") return null
      const n = parseFloat(v)
      return isNaN(n) || n < 0 ? null : n.toFixed(2)
    }),
})

const depositSchema = z.object({
  goalId: z.coerce
    .number()
    .int()
    .positive("Goal ID must be a positive integer"),
  amount: z
    .string()
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Deposit amount must be a positive number with up to 2 decimal places",
    )
    .refine((v) => parseFloat(v) > 0, {
      message: "Deposit amount must be greater than 0",
    })
    .transform((v) => parseFloat(v).toFixed(2)),
})

// ─── Server Actions ───────────────────────────────────────────────────────────

/**
 * createGoal — creates a new piggy bank savings goal for the authenticated user.
 * currentAmount starts at 0.
 */
export async function createGoal(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be signed in to create a goal" }
  }
  const userId = session.user.id

  const parsed = createGoalSchema.safeParse({
    name: formData.get("name"),
    targetAmount: formData.get("targetAmount"),
    monthlyContribution: formData.get("monthlyContribution") ?? undefined,
  })
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  await db.insert(piggyBankGoals).values({
    userId,
    name: parsed.data.name,
    targetAmount: parsed.data.targetAmount,
    ...(parsed.data.monthlyContribution !== null && {
      monthlyContribution: parsed.data.monthlyContribution,
    }),
  })

  revalidatePath("/piggy-banks")
  revalidatePath("/allocator")
  return { error: "" }
}

/**
 * deposit — adds an amount to an existing piggy bank goal.
 * Ownership guard: the goal's userId must match the authenticated user.
 * The deposit is capped so currentAmount never exceeds targetAmount.
 */
export async function deposit(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be signed in to make a deposit" }
  }
  const userId = session.user.id

  const parsed = depositSchema.safeParse({
    goalId: formData.get("goalId"),
    amount: formData.get("amount"),
  })
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  // Ownership guard: fetch goal WHERE id = ? AND userId = ?
  const [goal] = await db
    .select()
    .from(piggyBankGoals)
    .where(
      and(
        eq(piggyBankGoals.id, parsed.data.goalId),
        eq(piggyBankGoals.userId, userId),
      ),
    )
    .limit(1)

  if (!goal) {
    return { error: "Goal not found" }
  }

  // Numeric columns come back as strings from Drizzle/pg driver
  const current = parseFloat(goal.currentAmount as string)
  const target = parseFloat(goal.targetAmount as string)
  const depositAmt = parseFloat(parsed.data.amount)
  const newAmount = Math.min(current + depositAmt, target)

  await db
    .update(piggyBankGoals)
    .set({ currentAmount: newAmount.toFixed(2) })
    .where(
      and(
        eq(piggyBankGoals.id, parsed.data.goalId),
        eq(piggyBankGoals.userId, userId),
      ),
    )

  revalidatePath("/piggy-banks")
  return { error: "" }
}

/**
 * updateMonthlyContribution — sets or clears the monthly contribution
 * for an existing piggy bank goal. Passing "" or "0" clears it (sets null).
 * When set, the goal auto-appears in the Allocator Financial Goals tier.
 */
export async function updateMonthlyContribution(
  goalId: number,
  rawAmount: string,
): Promise<{ error: string }> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be signed in" }
  }
  const userId = session.user.id

  const trimmed = rawAmount.trim()
  const contribution =
    trimmed === "" || trimmed === "0"
      ? null
      : (() => {
          const n = parseFloat(trimmed)
          return isNaN(n) || n < 0 ? null : n.toFixed(2)
        })()

  // Ownership guard
  const [goal] = await db
    .select({ id: piggyBankGoals.id })
    .from(piggyBankGoals)
    .where(and(eq(piggyBankGoals.id, goalId), eq(piggyBankGoals.userId, userId)))
    .limit(1)

  if (!goal) {
    return { error: "Goal not found" }
  }

  await db
    .update(piggyBankGoals)
    .set({ monthlyContribution: contribution })
    .where(and(eq(piggyBankGoals.id, goalId), eq(piggyBankGoals.userId, userId)))

  revalidatePath("/piggy-banks")
  revalidatePath("/allocator")
  return { error: "" }
}
