"use client"

import { useActionState, useState, useEffect } from "react"
import { addIncomeEntry, deleteIncomeEntry } from "@/actions/income"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface IncomeEntry {
  id: number
  description: string
  /** Drizzle returns numeric(10,2) as string at runtime. */
  amount: string
  receivedAt: string
}

interface IncomeLedgerProps {
  entries: IncomeEntry[]
  monthlyTotal: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUSD(value: string | number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(parseFloat(String(value)))
}

/** Returns today's date as YYYY-MM-DD in the local timezone. */
function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

// ─── IncomeEntryRow ───────────────────────────────────────────────────────────

/**
 * IncomeEntryRow — one row in the ledger with an inline delete form.
 * Each row owns its own useActionState so errors surface per-row without
 * affecting other rows.
 */
function IncomeEntryRow({ entry }: { entry: IncomeEntry }) {
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteIncomeEntry,
    null,
  )

  return (
    <li className="flex items-center justify-between py-2 border-b border-borderSubtle last:border-0 group">
      <div className="flex-1 min-w-0 mr-3">
        <p className="text-textPrimary text-sm truncate">{entry.description}</p>
        <p className="text-textMuted text-xs">{entry.receivedAt}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-textSecondary text-sm tabular-nums">
          {formatUSD(entry.amount)}
        </span>

        <form action={deleteAction}>
          <input type="hidden" name="id" value={entry.id} />
          <button
            type="submit"
            disabled={deletePending}
            aria-label={`Delete income entry: ${entry.description}`}
            className="p-1 text-textMuted hover:text-budgetOverspent rounded
                       disabled:opacity-50 transition-colors text-xs
                       opacity-0 group-hover:opacity-100"
          >
            🗑️
          </button>
        </form>
      </div>

      {deleteState?.error && (
        <p role="alert" className="sr-only">
          {deleteState.error}
        </p>
      )}
    </li>
  )
}

// ─── AddIncomeForm ────────────────────────────────────────────────────────────

/**
 * AddIncomeForm — add a new income receipt.
 * Uses formKey reset pattern (MEM020): increments key on success to unmount
 * and remount the form, clearing all controlled inputs cleanly.
 */
function AddIncomeForm() {
  const [formKey, setFormKey] = useState(0)
  const [state, action, pending] = useActionState(addIncomeEntry, null)

  // Reset form fields after a successful submission (error is empty string on success)
  useEffect(() => {
    if (state !== null && !state.error) {
      setFormKey((k) => k + 1)
    }
  }, [state])

  return (
    <div className="mt-3">
      <form key={formKey} action={action} className="flex flex-col gap-2">
        {/* Description */}
        <input
          type="text"
          name="description"
          placeholder="Description (e.g. Salary, Freelance)"
          required
          maxLength={200}
          className="w-full px-3 py-2 bg-bgElevated border border-borderMedium rounded-lg
                     text-textPrimary text-sm placeholder:text-textMuted
                     focus:outline-none focus:ring-2 focus:ring-accentBlue"
        />

        <div className="flex gap-2">
          {/* Amount */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary text-sm select-none">
              $
            </span>
            <input
              type="text"
              name="amount"
              placeholder="0.00"
              required
              pattern="^\d+(\.\d{1,2})?$"
              inputMode="decimal"
              className="w-full pl-7 pr-3 py-2 bg-bgElevated border border-borderMedium rounded-lg
                         text-textPrimary text-sm tabular-nums placeholder:text-textMuted
                         focus:outline-none focus:ring-2 focus:ring-accentBlue"
            />
          </div>

          {/* Date */}
          <input
            type="date"
            name="receivedAt"
            defaultValue={todayISO()}
            required
            className="px-3 py-2 bg-bgElevated border border-borderMedium rounded-lg
                       text-textPrimary text-sm
                       focus:outline-none focus:ring-2 focus:ring-accentBlue"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 bg-accentBlue text-white text-sm font-medium rounded-lg
                       hover:bg-blue-500 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {pending ? "Adding…" : "Add"}
          </button>
        </div>

        {state?.error ? (
          <p role="alert" className="text-budgetOverspent text-xs">
            {state.error}
          </p>
        ) : state !== null && !state.error ? (
          <p className="text-budgetHealthy text-xs">Income entry added.</p>
        ) : null}
      </form>
    </div>
  )
}

// ─── IncomeLedger ─────────────────────────────────────────────────────────────

/**
 * IncomeLedger — replaces the old flat IncomeInput field.
 * Shows all income receipts for the current calendar month, a running monthly
 * total, a delete control per row, and an add form at the bottom.
 *
 * Empty month renders a clear call-to-action rather than NaN in the counter.
 */
export default function IncomeLedger({ entries, monthlyTotal }: IncomeLedgerProps) {
  return (
    <div className="bg-bgSurface border border-borderSubtle rounded-xl p-5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-textSecondary text-xs uppercase tracking-widest font-medium">
          Income
        </p>
        <span className="text-textPrimary text-sm font-semibold tabular-nums">
          {formatUSD(monthlyTotal)}
          <span className="text-textMuted font-normal"> / mo</span>
        </span>
      </div>

      {/* Entry list */}
      {entries.length > 0 ? (
        <ul>
          {entries.map((entry) => (
            <IncomeEntryRow key={entry.id} entry={entry} />
          ))}
        </ul>
      ) : (
        <p className="text-textMuted text-xs py-2">
          No income recorded this month — add your first receipt below.
        </p>
      )}

      {/* Add form */}
      <AddIncomeForm />
    </div>
  )
}
