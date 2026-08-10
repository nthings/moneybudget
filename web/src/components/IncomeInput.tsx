"use client"

import { useActionState } from "react"
import { updateIncome } from "@/actions/budget"

interface IncomeInputProps {
  /** Current income value from the DB (Drizzle returns numeric as string). */
  currentIncome: string | number
}

/**
 * IncomeInput — client form component that lets the user set their monthly
 * take-home income.  Uses useActionState so validation errors surface inline.
 */
export default function IncomeInput({ currentIncome }: IncomeInputProps) {
  const [state, action, pending] = useActionState(updateIncome, null)

  // Always render a clean 2-decimal display value
  const displayValue = parseFloat(String(currentIncome)).toFixed(2)

  return (
    <div className="bg-bgSurface border border-borderSubtle rounded-xl p-5">
      <p className="text-textSecondary text-xs uppercase tracking-widest font-medium mb-3">
        Monthly Income
      </p>

      <form action={action} className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary text-sm select-none">
            $
          </span>
          <input
            type="number"
            name="income"
            step="0.01"
            min="0"
            defaultValue={displayValue}
            required
            aria-label="Monthly income"
            className="w-full pl-7 pr-3 py-2 bg-bgElevated border border-borderMedium rounded-lg
                       text-textPrimary text-sm tabular-nums
                       focus:outline-none focus:ring-2 focus:ring-accentBlue
                       disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-accentBlue text-white text-sm font-medium rounded-lg
                     hover:bg-blue-500 disabled:opacity-50 transition-colors"
        >
          {pending ? "Saving…" : "Set Income"}
        </button>
      </form>

      {state?.error ? (
        <p role="alert" className="mt-2 text-budgetOverspent text-xs">
          {state.error}
        </p>
      ) : state !== null && !state.error ? (
        <p className="mt-2 text-budgetHealthy text-xs">Income updated.</p>
      ) : null}
    </div>
  )
}
