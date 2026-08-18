/**
 * Dev-only seed API — inserts and removes test data for e2e specs.
 *
 * Guarded by NODE_ENV !== 'production'.  Never ship this to prod.
 *
 * POST  /api/test/seed
 *   Transactions: { type?: "transactions"; email: string; rows: SeedRow[]; clearCurrentMonth?: boolean }
 *   Goals:        { type: "goals"; email: string; goals: GoalRow[]; clearAll?: boolean }
 *   Returns: { ids: number[]; cleared: number }
 *
 * DELETE /api/test/seed
 *   Transactions: { ids: number[] }
 *   Goals:        { type: "goals"; ids: number[] }
 *   Account:      { type: "account"; email: string }  — deletes all app rows then the user row
 *   Returns: { deleted: number }
 */

// Never statically collected — requires DB at runtime
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { eq, and, gte, lte, inArray } from "drizzle-orm"
import { db } from "@/db"
import { transactions, users, piggyBankGoals, budgetItems, budgetPeriods } from "@/db/schema"

interface GoalRow {
  name: string
  /** numeric string, e.g. "500.00" */
  targetAmount: string
  /** numeric string, defaults to "0.00" */
  currentAmount?: string
}

interface SeedRow {
  merchant: string
  category: string
  /** numeric string, e.g. "3000.00" or "-1500.00" */
  amount: string
  /** ISO date string "YYYY-MM-DD" */
  date: string
}

function guardEnv(): NextResponse | null {
  if (process.env.ALLOW_TEST_SEED !== "true") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }
  return null
}

// ── POST: seed transactions or goals ─────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const guard = guardEnv()
  if (guard) return guard

  let body: {
    type?: string
    email?: string
    rows?: SeedRow[]
    clearCurrentMonth?: boolean
    goals?: GoalRow[]
    clearAll?: boolean
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { type = "transactions", email } = body

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email is required" }, { status: 400 })
  }

  // Lookup user
  const user = await db.query.users.findFirst({ where: eq(users.email, email) })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // ── Goals branch ──
  if (type === "goals") {
    const { goals, clearAll = false } = body
    if (!Array.isArray(goals) || goals.length === 0) {
      return NextResponse.json({ error: "goals must be a non-empty array" }, { status: 400 })
    }
    for (const g of goals) {
      if (!g.name || !g.targetAmount) {
        return NextResponse.json(
          { error: "Each goal needs name and targetAmount" },
          { status: 400 },
        )
      }
    }

    let cleared = 0
    if (clearAll) {
      const deleted = await db
        .delete(piggyBankGoals)
        .where(eq(piggyBankGoals.userId, user.id))
        .returning({ id: piggyBankGoals.id })
      cleared = deleted.length
    }

    const inserted = await db
      .insert(piggyBankGoals)
      .values(
        goals.map((g) => ({
          userId: user.id,
          name: g.name,
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount ?? "0.00",
        })),
      )
      .returning({ id: piggyBankGoals.id })

    return NextResponse.json({ ids: inserted.map((r) => r.id), cleared })
  }

  // ── Transactions branch (default) ──
  const { rows, clearCurrentMonth = false } = body

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "rows must be a non-empty array" }, { status: 400 })
  }

  // Validate each row
  for (const row of rows) {
    if (!row.merchant || !row.category || !row.amount || !row.date) {
      return NextResponse.json(
        { error: "Each row needs merchant, category, amount, date" },
        { status: 400 },
      )
    }
  }

  let cleared = 0

  // Optional: delete all current-month transactions for deterministic totals
  if (clearCurrentMonth) {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const mm = String(month).padStart(2, "0")
    const lastDay = new Date(year, month, 0).getDate()
    const startDate = `${year}-${mm}-01`
    const endDate = `${year}-${mm}-${String(lastDay).padStart(2, "0")}`

    const deleted = await db
      .delete(transactions)
      .where(
        and(
          eq(transactions.userId, user.id),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
      )
      .returning({ id: transactions.id })

    cleared = deleted.length
  }

  // Insert seed rows
  const inserted = await db
    .insert(transactions)
    .values(rows.map((r) => ({ userId: user.id, ...r })))
    .returning({ id: transactions.id })

  return NextResponse.json({ ids: inserted.map((r) => r.id), cleared })
}

// ── DELETE: remove seeded rows by ID, or wipe a full test account ────────────

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const guard = guardEnv()
  if (guard) return guard

  let body: { type?: string; ids?: number[]; email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { type = "transactions" } = body

  // ── Account cleanup branch ───────────────────────────────────────────────
  // Removes all app rows for the user then deletes the user row itself.
  // Auth.js `account` and `session` rows cascade via FK on delete.
  // Used by e2e specs to tear down test accounts created during a test run.
  if (type === "account") {
    const { email } = body
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "email is required for account cleanup" }, { status: 400 })
    }

    const user = await db.query.users.findFirst({ where: eq(users.email, email) })
    if (!user) {
      // User already gone — treat as success (idempotent)
      return NextResponse.json({ deleted: 0 })
    }

    const userId = user.id

    // Delete app rows first (no FK cascade defined on app tables)
    await db.delete(budgetItems).where(eq(budgetItems.userId, userId))
    await db.delete(budgetPeriods).where(eq(budgetPeriods.userId, userId))
    await db.delete(transactions).where(eq(transactions.userId, userId))
    await db.delete(piggyBankGoals).where(eq(piggyBankGoals.userId, userId))

    // Delete user row (Auth.js account + session rows cascade)
    await db.delete(users).where(eq(users.id, userId))

    return NextResponse.json({ deleted: 1 })
  }

  // ── Row-by-ID branch (transactions / goals) ──────────────────────────────
  const { ids } = body

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ deleted: 0 })
  }

  if (type === "goals") {
    await db.delete(piggyBankGoals).where(inArray(piggyBankGoals.id, ids))
    return NextResponse.json({ deleted: ids.length })
  }

  await db.delete(transactions).where(inArray(transactions.id, ids))

  return NextResponse.json({ deleted: ids.length })
}
