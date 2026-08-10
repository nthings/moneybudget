/**
 * Dev-only seed API — inserts and removes test transactions for e2e specs.
 *
 * Guarded by NODE_ENV !== 'production'.  Never ship this to prod.
 *
 * POST  /api/test/seed
 *   Body: { email: string; rows: SeedRow[]; clearCurrentMonth?: boolean }
 *   Returns: { ids: number[]; cleared: number }
 *
 * DELETE /api/test/seed
 *   Body: { ids: number[] }
 *   Returns: { deleted: number }
 */

import { NextRequest, NextResponse } from "next/server"
import { eq, and, gte, lte, inArray } from "drizzle-orm"
import { db } from "@/db"
import { transactions, users } from "@/db/schema"

interface SeedRow {
  merchant: string
  category: string
  /** numeric string, e.g. "3000.00" or "-1500.00" */
  amount: string
  /** ISO date string "YYYY-MM-DD" */
  date: string
}

function guardEnv(): NextResponse | null {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }
  return null
}

// ── POST: seed transactions ───────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const guard = guardEnv()
  if (guard) return guard

  let body: { email?: string; rows?: SeedRow[]; clearCurrentMonth?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { email, rows, clearCurrentMonth = false } = body

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email is required" }, { status: 400 })
  }
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

  // Lookup user
  const user = await db.query.users.findFirst({ where: eq(users.email, email) })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
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

// ── DELETE: remove seeded rows by ID ─────────────────────────────────────────

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const guard = guardEnv()
  if (guard) return guard

  let body: { ids?: number[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { ids } = body

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ deleted: 0 })
  }

  await db.delete(transactions).where(inArray(transactions.id, ids))

  return NextResponse.json({ deleted: ids.length })
}
