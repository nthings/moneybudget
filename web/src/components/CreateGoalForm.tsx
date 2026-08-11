"use client"

import { useActionState, useEffect, useState } from "react"
import { createGoal } from "@/actions/piggyBanks"

// ─── CreateGoalForm ───────────────────────────────────────────────────────────
//
// Client component that wraps the createGoal Server Action.
// Follows the formKey-reset pattern (MEM020): success (error === "") causes the
// form to remount, clearing all inputs without a page navigation.

export function CreateGoalForm() {
  const [state, action, isPending] = useActionState(createGoal, null)
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    if (state?.error === "") {
      setFormKey((k) => k + 1)
    }
  }, [state])

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800/60 p-5">
      <h2 className="mb-4 text-base font-semibold text-zinc-100">New Savings Goal</h2>

      <form
        key={formKey}
        action={action}
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {/* Goal name */}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="goal-name" className="text-xs font-medium text-zinc-400">
            Goal Name
          </label>
          <input
            id="goal-name"
            name="name"
            type="text"
            required
            placeholder="e.g. Emergency Fund"
            className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Target amount */}
        <div className="flex flex-col gap-1">
          <label htmlFor="target-amount" className="text-xs font-medium text-zinc-400">
            Target Amount
          </label>
          <input
            id="target-amount"
            name="targetAmount"
            type="text"
            required
            placeholder="e.g. 1000.00"
            inputMode="decimal"
            pattern="^\d+(\.\d{1,2})?$"
            className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Submit row */}
        <div className="sm:col-span-3 flex items-center gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Creating…" : "Create Goal"}
          </button>

          {/* Inline feedback */}
          {state?.error && (
            <p className="text-sm text-red-400" role="alert">
              {state.error}
            </p>
          )}
          {state?.error === "" && (
            <p className="text-sm text-emerald-400" role="status">
              Goal created!
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
