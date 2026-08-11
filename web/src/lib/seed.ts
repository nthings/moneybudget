/**
 * seedDemoData — populate a fresh account with representative data.
 *
 * Design principles:
 *   - Pure (no auth import): accepts a userId string, performs DB writes, returns void.
 *   - Idempotent: if a budgetPeriods row already exists for this user / month the
 *     function is a no-op; calling it twice with the same userId is safe.
 *   - Never throws to the caller: any DB error is caught and logged via
 *     console.warn so that sign-up is never blocked by a seed failure.
 *
 * Data seeded:
 *   • 1  budgetPeriods row  — current month, $5,000 income
 *   • 11 budgetItems rows   — 4 essential, 4 financial, 3 lifestyle
 *   • 12 transactions rows  — spread across the current calendar month
 *   • 1  piggyBankGoals row — "Emergency Fund" $10,000 goal, $3,200 saved
 */

import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { budgetItems, budgetPeriods, piggyBankGoals, transactions } from "@/db/schema"

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns the current calendar year and 1-based month. */
function currentPeriod(): { year: number; month: number } {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() + 1 }
}

/**
 * Build an ISO date string (YYYY-MM-DD) for a given day in the current month.
 * Clamps the day to [1, 28] so it is always valid regardless of month length.
 */
function dateInCurrentMonth(day: number): string {
  const { year, month } = currentPeriod()
  const safeDay = Math.min(Math.max(day, 1), 28)
  return `${year}-${String(month).padStart(2, "0")}-${String(safeDay).padStart(2, "0")}`
}

// ─── Seed data constants ──────────────────────────────────────────────────────

const INCOME = "5000.00"

/** Budget items grouped by tier. allocatedAmount must be a valid numeric string. */
const SEED_BUDGET_ITEMS: Array<{
  tier: "essential" | "financial" | "lifestyle"
  label: string
  allocatedAmount: string
}> = [
  // Essential — housing, food, transport, utilities (covers ~$2,300)
  { tier: "essential", label: "Rent / Mortgage", allocatedAmount: "1500.00" },
  { tier: "essential", label: "Groceries", allocatedAmount: "400.00" },
  { tier: "essential", label: "Transportation", allocatedAmount: "200.00" },
  { tier: "essential", label: "Utilities & Internet", allocatedAmount: "150.00" },

  // Financial — savings and investment buckets (covers ~$1,100)
  { tier: "financial", label: "Emergency Fund", allocatedAmount: "300.00" },
  { tier: "financial", label: "Retirement (401k)", allocatedAmount: "500.00" },
  { tier: "financial", label: "Index Fund Investment", allocatedAmount: "200.00" },
  { tier: "financial", label: "Debt Repayment", allocatedAmount: "100.00" },

  // Lifestyle — discretionary spend (covers ~$500)
  { tier: "lifestyle", label: "Dining Out", allocatedAmount: "150.00" },
  { tier: "lifestyle", label: "Entertainment", allocatedAmount: "100.00" },
  { tier: "lifestyle", label: "Shopping & Personal Care", allocatedAmount: "250.00" },
]

/** Demo transactions spread across the current month. */
const SEED_TRANSACTIONS: Array<{
  merchant: string
  category: string
  amount: string
  day: number
}> = [
  // Day 1 — rent payment (expense)
  { merchant: "Sunrise Properties", category: "Housing", amount: "-1500.00", day: 1 },
  // Day 2 — weekly grocery run (expense)
  { merchant: "Whole Foods Market", category: "Groceries", amount: "-87.42", day: 2 },
  // Day 3 — streaming services (expense)
  { merchant: "Netflix", category: "Subscriptions", amount: "-15.49", day: 3 },
  // Day 5 — bus pass (expense)
  { merchant: "City Transit", category: "Transport", amount: "-55.00", day: 5 },
  // Day 7 — electricity & internet bill (expense)
  { merchant: "Power & Light Co.", category: "Utilities", amount: "-110.75", day: 7 },
  // Day 9 — lunch with a colleague (expense)
  { merchant: "The Local Bistro", category: "Dining", amount: "-28.60", day: 9 },
  // Day 12 — grocery top-up (expense)
  { merchant: "Trader Joe's", category: "Groceries", amount: "-64.13", day: 12 },
  // Day 14 — pharmacy (expense)
  { merchant: "CVS Pharmacy", category: "Healthcare", amount: "-22.99", day: 14 },
  // Day 15 — salary credit (income — positive amount)
  { merchant: "Acme Corp Payroll", category: "Savings", amount: "2500.00", day: 15 },
  // Day 17 — gym membership (expense)
  { merchant: "Planet Fitness", category: "Personal Care", amount: "-24.99", day: 17 },
  // Day 20 — online shopping (expense)
  { merchant: "Amazon", category: "Shopping", amount: "-73.85", day: 20 },
  // Day 22 — movie night (expense)
  { merchant: "AMC Theatres", category: "Entertainment", amount: "-34.50", day: 22 },
]

/** Single piggy bank goal seeded for the account. */
const SEED_PIGGY_BANK = {
  name: "Emergency Fund",
  targetAmount: "10000.00",
  currentAmount: "3200.00",
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Seed demo data for a newly created user.
 *
 * @param userId  Auth.js user id (UUID from the `user` table).
 *
 * The function is intentionally fire-and-forget safe:
 *   - It resolves to `void` on success.
 *   - Any database error is caught and emitted via console.warn (never rethrown).
 *   - If a budgetPeriods row for this userId / year / month already exists the
 *     function returns immediately without writing any rows (idempotency guard).
 */
export async function seedDemoData(userId: string): Promise<void> {
  try {
    const { year, month } = currentPeriod()

    // ── Idempotency guard ────────────────────────────────────────────────────
    // If a budget period already exists for this user this month, seed has
    // already run (or the user has created their own data). Skip entirely.
    const existing = await db.query.budgetPeriods.findFirst({
      where: and(
        eq(budgetPeriods.userId, userId),
        eq(budgetPeriods.year, year),
        eq(budgetPeriods.month, month),
      ),
    })
    if (existing) {
      return
    }

    // ── 1. Budget period ─────────────────────────────────────────────────────
    await db.insert(budgetPeriods).values({ userId, year, month, income: INCOME })

    // ── 2. Budget items ──────────────────────────────────────────────────────
    await db.insert(budgetItems).values(
      SEED_BUDGET_ITEMS.map((item) => ({
        userId,
        year,
        month,
        tier: item.tier,
        label: item.label,
        allocatedAmount: item.allocatedAmount,
      })),
    )

    // ── 3. Transactions ──────────────────────────────────────────────────────
    await db.insert(transactions).values(
      SEED_TRANSACTIONS.map((tx) => ({
        userId,
        merchant: tx.merchant,
        category: tx.category,
        amount: tx.amount,
        date: dateInCurrentMonth(tx.day),
      })),
    )

    // ── 4. Piggy bank goal ───────────────────────────────────────────────────
    await db.insert(piggyBankGoals).values({
      userId,
      name: SEED_PIGGY_BANK.name,
      targetAmount: SEED_PIGGY_BANK.targetAmount,
      currentAmount: SEED_PIGGY_BANK.currentAmount,
    })
  } catch (err) {
    // Never block sign-up; surface the failure as a warning instead.
    console.warn("[seedDemoData] Failed to seed demo data for userId=%s — %s", userId, err)
  }
}
