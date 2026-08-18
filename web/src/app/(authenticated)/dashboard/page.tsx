import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { eq, and, gte, lte, desc } from "drizzle-orm"
import { db } from "@/db"
import { transactions } from "@/db/schema"
import StatCard from "@/components/StatCard"
import RecentTransactions from "@/components/RecentTransactions"
import type { TransactionRow } from "@/components/RecentTransactions"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const userId = session.user.id
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 1-based

  // Build ISO date strings for the current calendar-month window
  const mm = String(month).padStart(2, "0")
  const lastDay = new Date(year, month, 0).getDate() // day 0 of next month = last day of this month
  const startDate = `${year}-${mm}-01`
  const endDate = `${year}-${mm}-${String(lastDay).padStart(2, "0")}`

  // ── Fetch current-month transactions for stat aggregation ─────────────────
  // amount is numeric(10,2) — Drizzle returns it as string; use parseFloat (MEM017).
  const monthlyTxs = await db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, userId),
      gte(transactions.date, startDate),
      lte(transactions.date, endDate),
    ),
  })

  // ── Aggregate totals ──────────────────────────────────────────────────────
  let totalIncome = 0
  let totalSpent = 0
  for (const tx of monthlyTxs) {
    const amt = parseFloat(tx.amount)
    if (amt > 0) {
      totalIncome += amt
    } else {
      totalSpent += Math.abs(amt)
    }
  }
  const remaining = totalIncome - totalSpent

  // ── Fetch last 5 transactions across all time for the recent list ─────────
  const recentRaw = await db.query.transactions.findMany({
    where: eq(transactions.userId, userId),
    orderBy: [desc(transactions.date), desc(transactions.createdAt)],
    limit: 5,
  })

  const recentTxs: TransactionRow[] = recentRaw.map((tx) => ({
    id: tx.id,
    merchant: tx.merchant,
    category: tx.category,
    amount: tx.amount,
    date: tx.date,
  }))

  const monthLabel = new Date(year, month - 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-textPrimary mb-1">Dashboard</h1>
        <p className="text-textSecondary text-sm">{monthLabel}</p>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Income" amount={totalIncome} accent="income" />
        <StatCard label="Total Spent" amount={totalSpent} accent="spent" />
        <StatCard label="Remaining" amount={remaining} accent="remaining" />
      </div>

      {/* ── Recent transactions ───────────────────────────────────────────── */}
      <RecentTransactions transactions={recentTxs} />
    </div>
  )
}
