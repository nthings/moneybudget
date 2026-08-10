import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { eq, and } from "drizzle-orm"
import { db } from "@/db"
import { budgetPeriods, budgetItems } from "@/db/schema"
import { computeZbbState } from "@/lib/zbb"
import ZbbCounter from "@/components/ZbbCounter"
import IncomeInput from "@/components/IncomeInput"
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

  // ── Fetch current month's budget period ──────────────────────────────────
  const period = await db.query.budgetPeriods.findFirst({
    where: and(
      eq(budgetPeriods.userId, userId),
      eq(budgetPeriods.year, year),
      eq(budgetPeriods.month, month),
    ),
  })

  // ── Fetch all budget items for the current month ─────────────────────────
  const items = await db.query.budgetItems.findMany({
    where: and(
      eq(budgetItems.userId, userId),
      eq(budgetItems.year, year),
      eq(budgetItems.month, month),
    ),
  })

  // ── Compute ZBB state ────────────────────────────────────────────────────
  // income and allocatedAmount are numeric(10,2) — Drizzle returns strings
  // (MEM017). computeZbbState accepts string|number and calls parseFloat internally.
  const income = period?.income ?? "0"
  const totalAllocations = items
    .reduce((sum, item) => sum + parseFloat(item.allocatedAmount), 0)
    .toString()

  // totalActuals omitted — no per-item actual spend data in this sprint;
  // actualBalance will equal income (all spend tracked via transactions separately).
  const zbb = computeZbbState(income, totalAllocations)

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

      {/* ── Income setter ──────────────────────────────────────────────────── */}
      <div className="mb-6">
        <IncomeInput currentIncome={income} />
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
