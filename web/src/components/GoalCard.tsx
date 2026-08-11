"use client"

import { useState } from "react"
import { DepositForm } from "@/components/DepositForm"

// ─── GoalCard ─────────────────────────────────────────────────────────────────
//
// Renders a single savings goal card with:
//   • Goal name and current / target amounts
//   • Two-rect progress bar (track + proportional fill — same pattern as MEM005)
//   • Toggle button to show/hide the inline DepositForm
//   • Success callback collapses the deposit form after a deposit lands

// Numeric columns from Drizzle/pg come back as strings at runtime (MEM017).
export interface Goal {
  id: number
  name: string
  targetAmount: string
  currentAmount: string
}

interface GoalCardProps {
  goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
  const [depositOpen, setDepositOpen] = useState(false)

  const current = parseFloat(goal.currentAmount)
  const target = parseFloat(goal.targetAmount)
  // Guard against division-by-zero and clamp at 100
  const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0
  const isComplete = pct >= 100

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" })

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
