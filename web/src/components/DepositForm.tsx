"use client"

import { useActionState, useEffect, useState } from "react"
import { deposit } from "@/actions/piggyBanks"

// ─── DepositForm ─────────────────────────────────────────────────────────────
//
// Client component that wraps the deposit Server Action for a specific goal.
// Follows the same formKey-reset pattern as AddTransactionForm (MEM020):
// success sets error === "" → formKey increments → form remounts, clearing input.

interface DepositFormProps {
  goalId: number
  onSuccess?: () => void
}

export function DepositForm({ goalId, onSuccess }: DepositFormProps) {
  const [state, action, isPending] = useActionState(deposit, null)
  const [formKey, setFormKey] = useState(0)

  useEffect(() => {
    if (state?.error === "") {
      setFormKey((k) => k + 1)
      onSuccess?.()
    }
  }, [state, onSuccess])

  return (
    <form key={formKey} action={action} className="mt-3 flex items-end gap-2">
      {/* Hidden goal ID */}
      <input type="hidden" name="goalId" value={goalId} />

      {/* Deposit amount */}
      <div className="flex flex-col gap-1 flex-1">
        <label
          htmlFor={`deposit-amount-${goalId}`}
          className="text-xs font-medium text-zinc-400"
        >
          Amount
        </label>
        <input
          id={`deposit-amount-${goalId}`}
          name="amount"
          type="text"
          required
          placeholder="e.g. 50.00"
          inputMode="decimal"
          pattern="^\d+(\.\d{1,2})?$"
          className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Depositing…" : "Deposit"}
      </button>

      {/* Inline feedback */}
      {state?.error && (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      )}
    </form>
  )
}
