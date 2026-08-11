import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { eq, and, gte, lt } from "drizzle-orm"
import { db } from "@/db"
import { budgetItems, transactions, incomeEntries } from "@/db/schema"
import { computeZbbState } from "@/lib/zbb"
import ZbbCounter from "@/components/ZbbCounter"
import IncomeLedger, { type IncomeEntry } from "@/components/IncomeLedger"
import TierGroup, { type BudgetItem } from "@/components/TierGroup"

// The three fixed ZBB tiers displayed on this screen
const TIERS: Array<{
  tier: "essential" | "financial" | "lifestyle"
  title: string
}> = [
  { tier: "essential", title: "Essential Needs" },
  { tier: "financial", title: "Financial Goals" },
  { tier: "lifestyle", title: "Lifestyle" },
]

export default async function AllocatorPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const userId = session.user.id
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 1-based

  // ── Month boundary strings (ISO date, used for both income and transactions) ──
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`
  const nextMonthNum = month === 12 ? 1 : month + 1
  const nextMonthYear = month === 12 ? year + 1 : year
  const monthEnd = `${nextMonthYear}-${String(nextMonthNum).padStart(2, "0")}-01`

  // ── Fetch income entries for the current calendar month ──────────────────
  // receivedAt is a Postgres `date` column returned as ISO string (YYYY-MM-DD).
  const rawIncomeEntries = await db.query.incomeEntries.findMany({
    where: and(
      eq(incomeEntries.userId, userId),
      gte(incomeEntries.receivedAt, monthStart),
      lt(incomeEntries.receivedAt, monthEnd),
    ),
    orderBy: (t, { asc }) => [asc(t.receivedAt), asc(t.id)],
  })

  // Compute monthly income total from entries (replaces budgetPeriods.income for ZBB).
  // parseFloat is safe here: amount is numeric(10,2) returned as string by Drizzle.
  const monthlyIncome = rawIncomeEntries.reduce(
    (sum, e) => sum + parseFloat(e.amount),
    0,
  )

  // Shape entries for IncomeLedger props
  const incomeEntryList: IncomeEntry[] = rawIncomeEntries.map((e) => ({
    id: e.id,
    description: e.description,
    amount: e.amount,
    receivedAt: e.receivedAt,
  }))

  // ── Fetch all budget items for the current month ─────────────────────────
  const items = await db.query.budgetItems.findMany({
    where: and(
      eq(budgetItems.userId, userId),
      eq(budgetItems.year, year),
      eq(budgetItems.month, month),
    ),
  })

  // ── Compute ZBB state ────────────────────────────────────────────────────
  // monthlyIncome is already a JS number; computeZbbState accepts string|number.
  const totalAllocations = items
    .reduce((sum, item) => sum + parseFloat(item.allocatedAmount), 0)
    .toString()

  // ── Sum current-month expense transactions ─────────────────────────────
  // Transactions with a negative amount represent expenses.
  const monthlyTransactions = await db.query.transactions.findMany({
    where: and(
      eq(transactions.userId, userId),
      gte(transactions.date, monthStart),
      lt(transactions.date, monthEnd),
    ),
  })

  // Sum absolute values of expense rows (negative amount = expense)
  const totalSpend = monthlyTransactions
    .filter((t) => parseFloat(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0)
    .toString()

  const totalActuals = totalSpend
  const zbb = computeZbbState(monthlyIncome, totalAllocations, totalActuals)

  // ── Group items by tier ──────────────────────────────────────────────────
  function itemsForTier(tier: "essential" | "financial" | "lifestyle"): BudgetItem[] {
    return items
      .filter((item) => item.tier === tier)
      .map((item) => ({
        id: item.id,
        label: item.label,
        allocatedAmount: item.allocatedAmount,
      }))
  }

  const monthLabel = new Date(year, month - 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="p-8 max-w-4xl">
      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-textPrimary mb-1">The Allocator</h1>
        <p className="text-textSecondary text-sm">{monthLabel}</p>
      </div>

      {/* ── ZBB Counter Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ZbbCounter
          label="Budget Balance"
          balance={zbb.budgetBalance}
          state={zbb.state}
        />
        <ZbbCounter
          label="Actual Balance"
          balance={zbb.actualBalance}
          state={zbb.state}
        />
      </div>

      {/* ── Income ledger ──────────────────────────────────────────────────── */}
      <div className="mb-6">
        <IncomeLedger entries={incomeEntryList} monthlyTotal={monthlyIncome} />
      </div>

      {/* ── Tier groups ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {TIERS.map(({ tier, title }) => (
          <TierGroup
            key={tier}
            tier={tier}
            title={title}
            items={itemsForTier(tier)}
          />
        ))}
      </div>
    </div>
  )
}
