"use client"

import { useState } from "react"
import { DepositForm } from "@/components/DepositForm"
import { updateMonthlyContribution } from "@/actions/piggyBanks"

// ─── GoalCard ─────────────────────────────────────────────────────────────────
//
// Renders a single savings goal card with:
//   • Goal name, current / target amounts, progress bar
//   • "Monthly: $X" badge when a monthly contribution is set
//   • Inline monthly-contribution editor (click pencil → input + save)
//   • Deposit form toggle

// Numeric columns from Drizzle/pg come back as strings at runtime (MEM017).
export interface Goal {
  id: number
  name: string
  targetAmount: string
  currentAmount: string
  monthlyContribution: string | null
}

interface GoalCardProps {
  goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
  const [depositOpen, setDepositOpen] = useState(false)
  const [editingMonthly, setEditingMonthly] = useState(false)
  const [monthlyInput, setMonthlyInput] = useState(
    goal.monthlyContribution ? parseFloat(goal.monthlyContribution).toFixed(2) : ""
  )
  const [savingMonthly, setSavingMonthly] = useState(false)
  const [monthlyError, setMonthlyError] = useState("")

  const current = parseFloat(goal.currentAmount)
  const target = parseFloat(goal.targetAmount)
  const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0
  const isComplete = pct >= 100
  const monthly = goal.monthlyContribution ? parseFloat(goal.monthlyContribution) : null

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" })

  async function saveMonthly() {
    setSavingMonthly(true)
    setMonthlyError("")
    const result = await updateMonthlyContribution(goal.id, monthlyInput)
    setSavingMonthly(false)
    if (result.error) {
      setMonthlyError(result.error)
    } else {
      setEditingMonthly(false)
    }
  }

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800/60 p-5">
      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-zinc-100">
            {goal.name}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-400">
            {fmt(current)}{" "}
            <span className="text-zinc-500">of</span>{" "}
            {fmt(target)}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isComplete
              ? "bg-emerald-900/50 text-emerald-400"
              : "bg-zinc-700 text-zinc-300"
          }`}
        >
          {pct}%
        </span>
      </div>

      {/* Progress bar — two-rect pattern (MEM005) */}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-zinc-700"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${goal.name} progress`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isComplete ? "bg-emerald-500" : "bg-indigo-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Monthly contribution row */}
      <div className="mt-3 flex items-center gap-2 min-h-[24px]">
        {editingMonthly ? (
          <>
            <span className="text-xs text-zinc-400">Monthly:</span>
            <span className="text-xs text-zinc-400">$</span>
            <input
              type="text"
              value={monthlyInput}
              onChange={(e) => setMonthlyInput(e.target.value)}
              placeholder="0.00"
              inputMode="decimal"
              className="w-24 rounded border border-zinc-600 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={saveMonthly}
              disabled={savingMonthly}
              className="rounded bg-indigo-600 px-2 py-0.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {savingMonthly ? "…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => { setEditingMonthly(false); setMonthlyError("") }}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Cancel
            </button>
            {monthlyError && (
              <span className="text-xs text-red-400">{monthlyError}</span>
            )}
          </>
        ) : (
          <>
            {monthly !== null && monthly > 0 ? (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-indigo-900/40 px-2.5 py-0.5 text-xs font-medium text-indigo-300"
                title="Monthly contribution — appears in Allocator Financial Goals"
              >
                Monthly: {fmt(monthly)}
              </span>
            ) : (
              <span className="text-xs text-zinc-600">No monthly target</span>
            )}
            <button
              type="button"
              onClick={() => setEditingMonthly(true)}
              className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
              aria-label="Edit monthly contribution"
            >
              ✏️
            </button>
          </>
        )}
      </div>

      {/* Deposit toggle / complete badge */}
      <div className="mt-4">
        {isComplete ? (
          <p className="text-xs font-medium text-emerald-400">🎉 Goal reached!</p>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setDepositOpen((o) => !o)}
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {depositOpen ? "Cancel" : "Deposit"}
            </button>

            {depositOpen && (
              <DepositForm
                goalId={goal.id}
                onSuccess={() => setDepositOpen(false)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
