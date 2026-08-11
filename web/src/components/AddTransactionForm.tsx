"use client"

import { useActionState, useEffect, useState } from "react"
import { addTransaction } from "@/actions/transactions"
import { TRANSACTION_CATEGORIES } from "@/lib/transaction-categories"

// ─── AddTransactionForm ───────────────────────────────────────────────────────
//
// Client component that wraps the addTransaction Server Action.
//
// Pattern (MEM020): formKey counter is incremented on every successful
// submission, causing React to unmount + remount the <form> element which
// resets all inputs — without a full page navigation.
//
// Error display: useActionState surfaces the last action result inline so the
// user sees validation failures without losing their other inputs.

export function AddTransactionForm() {
  const [state, action, isPending] = useActionState(addTransaction, null)
  const [formKey, setFormKey] = useState(0)

  // When the server action returns an empty error string it signals success.
  // Increment formKey to unmount + remount the form, resetting all inputs.
  useEffect(() => {
    if (state?.error === "") {
      setFormKey((k) => k + 1)
    }
  }, [state])

  // Default date to today in YYYY-MM-DD format (what <input type="date"> expects)
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-800/60 p-5">
      <h2 className="mb-4 text-base font-semibold text-zinc-100">Add Transaction</h2>

      <form key={formKey} action={action} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Merchant */}
        <div className="flex flex-col gap-1">
          <label htmlFor="merchant" className="text-xs font-medium text-zinc-400">
            Merchant
          </label>
          <input
            id="merchant"
            name="merchant"
            type="text"
            required
            placeholder="e.g. Whole Foods"
            className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-xs font-medium text-zinc-400">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue=""
            className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="" disabled>
              Select category…
            </option>
            {TRANSACTION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1">
          <label htmlFor="amount" className="text-xs font-medium text-zinc-400">
            Amount <span className="text-zinc-500">(negative = expense)</span>
          </label>
          <input
            id="amount"
            name="amount"
            type="text"
            required
            placeholder="e.g. -42.50"
            inputMode="decimal"
            pattern="^-?\d+(\.\d{1,2})?$"
            className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1">
          <label htmlFor="date" className="text-xs font-medium text-zinc-400">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={today}
            className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
          />
        </div>

        {/* Submit row — spans full width */}
        <div className="sm:col-span-2 lg:col-span-4 flex items-center gap-4">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Adding…" : "Add Transaction"}
          </button>

          {/* Inline feedback */}
          {state?.error && (
            <p className="text-sm text-red-400" role="alert">
              {state.error}
            </p>
          )}
          {state?.error === "" && (
            <p className="text-sm text-emerald-400" role="status">
              Transaction added!
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
