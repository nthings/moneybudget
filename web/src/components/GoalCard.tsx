"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DepositForm } from "@/components/DepositForm"
import {
  updateMonthlyContribution,
  updateGoal,
  deleteGoal,
} from "@/actions/piggyBanks"

// ─── GoalCard ─────────────────────────────────────────────────────────────────
//
// Renders a single savings goal card with:
//   • Goal name, current / target amounts, progress bar
//   • Inline goal edit (name + target amount)
//   • Inline delete with confirmation
//   • "Monthly: $X" badge with inline editor
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
  const router = useRouter()

  // ── Optimistic display state ─────────────────────────────────────────────
  const [displayName, setDisplayName] = useState(goal.name)

  // ── Deposit form ─────────────────────────────────────────────────────────
  const [depositOpen, setDepositOpen] = useState(false)

  // ── Monthly contribution editor ──────────────────────────────────────────
  const [editingMonthly, setEditingMonthly] = useState(false)
  const [monthlyInput, setMonthlyInput] = useState(
    goal.monthlyContribution
      ? parseFloat(goal.monthlyContribution).toFixed(2)
      : "",
  )
  const [savingMonthly, setSavingMonthly] = useState(false)
  const [monthlyError, setMonthlyError] = useState("")

  // ── Goal edit (name + target) ────────────────────────────────────────────
  const [editingGoal, setEditingGoal] = useState(false)
  const [nameInput, setNameInput] = useState(goal.name)
  const [targetInput, setTargetInput] = useState(
    parseFloat(goal.targetAmount).toFixed(2),
  )
  const [savingGoal, setSavingGoal] = useState(false)
  const [goalError, setGoalError] = useState("")

  // ── Delete confirm ───────────────────────────────────────────────────────
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  // ── Derived values ───────────────────────────────────────────────────────
  const current = parseFloat(goal.currentAmount)
  const target = parseFloat(goal.targetAmount)
  const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0
  const isComplete = pct >= 100
  const monthly = goal.monthlyContribution
    ? parseFloat(goal.monthlyContribution)
    : null

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" })

  // ── Handlers ─────────────────────────────────────────────────────────────

  async function saveMonthly() {
    setSavingMonthly(true)
    setMonthlyError("")
    const result = await updateMonthlyContribution(goal.id, monthlyInput)
    setSavingMonthly(false)
    if (result.error) {
      setMonthlyError(result.error)
    } else {
      setEditingMonthly(false)
      router.refresh()
    }
  }

  async function saveGoal() {
    setSavingGoal(true)
    setGoalError("")
    const result = await updateGoal(goal.id, {
      name: nameInput,
      targetAmount: targetInput,
    })
    setSavingGoal(false)
    if (result.error) {
      setGoalError(result.error)
    } else {
      setDisplayName(nameInput)
      setEditingGoal(false)
      router.refresh()
    }
  }

  async function handleDelete() {
    setDeleting(true)
    setDeleteError("")
    const result = await deleteGoal(goal.id)
    setDeleting(false)
    if (result.error) {
      setDeleteError(result.error)
      setConfirmDelete(false)
    } else {
      router.refresh()
    }
  }

  // ─── Edit mode — replaces the header ────────────────────────────────────
  if (editingGoal) {
    return (
      <div className="rounded-lg border border-indigo-700/60 bg-zinc-800/60 p-5">
        <p className="text-xs text-zinc-500 mb-3">Edit goal</p>

        <div className="flex flex-col gap-2">
          {/* Name */}
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Goal name"
            maxLength={200}
            autoFocus
            className="w-full rounded border border-zinc-600 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
          />

          {/* Target amount */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-400 shrink-0">Target: $</span>
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="0.00"
              inputMode="decimal"
              className="w-32 rounded border border-zinc-600 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {goalError && (
            <p className="text-xs text-red-400">{goalError}</p>
          )}

          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={saveGoal}
              disabled={savingGoal}
              className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {savingGoal ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingGoal(false)
                setNameInput(displayName)
                setTargetInput(parseFloat(goal.targetAmount).toFixed(2))
                setGoalError("")
              }}
              className="rounded px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Normal card ─────────────────────────────────────────────────────────
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800/60 p-5">
      {/* Header row */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-zinc-100">
            {displayName}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-400">
            {fmt(current)}{" "}
            <span className="text-zinc-500">of</span>{" "}
            {fmt(target)}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isComplete
                ? "bg-emerald-900/50 text-emerald-400"
                : "bg-zinc-700 text-zinc-300"
            }`}
          >
            {pct}%
          </span>

          {/* Edit goal button */}
          <button
            type="button"
            onClick={() => setEditingGoal(true)}
            className="rounded p-1 text-zinc-500 hover:text-indigo-400 transition-colors"
            aria-label={`Edit ${goal.name}`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 013.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>

          {/* Delete goal button */}
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="rounded p-1 text-zinc-500 hover:text-red-400 transition-colors"
            aria-label={`Delete ${goal.name}`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Delete confirmation inline */}
      {confirmDelete && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md bg-red-950/40 border border-red-800/50 px-3 py-2">
          <span className="text-xs text-red-300 flex-1">Delete this goal?</span>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded bg-red-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
          <button
            type="button"
            onClick={() => { setConfirmDelete(false); setDeleteError("") }}
            className="text-xs text-zinc-400 hover:text-zinc-200"
          >
            Cancel
          </button>
          {deleteError && (
            <span className="w-full text-xs text-red-400">{deleteError}</span>
          )}
        </div>
      )}

      {/* Progress bar */}
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
              onClick={() => {
                setEditingMonthly(false)
                setMonthlyError("")
              }}
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
