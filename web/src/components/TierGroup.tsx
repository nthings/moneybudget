"use client"

import { useActionState, useState, useEffect } from "react"
import { addBudgetItem, updateBudgetItem, deleteBudgetItem } from "@/actions/budget"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BudgetItem {
  id: number
  label: string
  /** Drizzle returns numeric(10,2) as string at runtime (MEM017). */
  allocatedAmount: string
}

interface TierGroupProps {
  tier: "essential" | "financial" | "lifestyle"
  title: string
  items: BudgetItem[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUSD(value: string | number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(parseFloat(String(value)))
}

// ─── AddItemForm ──────────────────────────────────────────────────────────────

function AddItemForm({ tier }: { tier: string }) {
  const [formKey, setFormKey] = useState(0)
  const [state, action, pending] = useActionState(addBudgetItem, null)

  // Reset form fields after a successful submission
  useEffect(() => {
    if (state !== null && !state.error) {
      setFormKey((k) => k + 1)
    }
  }, [state])

  return (
    <div className="mt-3">
      <form key={formKey} action={action} className="flex flex-col gap-2">
        <input type="hidden" name="tier" value={tier} />

        <div className="flex gap-2">
          <input
            type="text"
            name="label"
            placeholder="Item name"
            required
            maxLength={100}
            className="flex-1 px-3 py-2 bg-bgElevated border border-borderMedium rounded-lg
                       text-textPrimary text-sm placeholder:text-textMuted
                       focus:outline-none focus:ring-2 focus:ring-accentBlue"
          />
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-textSecondary text-sm select-none">
              $
            </span>
            <input
              type="number"
              name="allocatedAmount"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="w-28 pl-6 pr-2 py-2 bg-bgElevated border border-borderMedium rounded-lg
                         text-textPrimary text-sm tabular-nums
                         focus:outline-none focus:ring-2 focus:ring-accentBlue"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="px-3 py-2 bg-accentPurple text-white text-sm font-medium rounded-lg
                       hover:bg-purple-500 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {pending ? "…" : "+ Add"}
          </button>
        </div>

        {state?.error && (
          <p role="alert" className="text-budgetOverspent text-xs">
            {state.error}
          </p>
        )}
      </form>
    </div>
  )
}

// ─── BudgetItemRow ─────────────────────────────────────────────────────────────

function BudgetItemRow({ item }: { item: BudgetItem }) {
  const [editing, setEditing] = useState(false)
  const [editState, editAction, editPending] = useActionState(updateBudgetItem, null)
  const [deleteState, deleteAction, deletePending] = useActionState(deleteBudgetItem, null)

  // Auto-close edit form after a successful save
  useEffect(() => {
    if (editState !== null && !editState.error) {
      setEditing(false)
    }
  }, [editState])

  if (editing) {
    return (
      <li className="py-2 border-b border-borderSubtle last:border-0">
        <form action={editAction} className="flex items-center gap-2">
          <input type="hidden" name="id" value={item.id} />
          <input
            type="text"
            name="label"
            defaultValue={item.label}
            required
            maxLength={100}
            autoFocus
            className="flex-1 px-2 py-1.5 bg-bgElevated border border-borderMedium rounded
                       text-textPrimary text-sm focus:outline-none focus:ring-1 focus:ring-accentBlue"
          />
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-textSecondary text-xs select-none">
              $
            </span>
            <input
              type="number"
              name="allocatedAmount"
              defaultValue={parseFloat(item.allocatedAmount).toFixed(2)}
              step="0.01"
              min="0"
              required
              className="w-24 pl-5 pr-2 py-1.5 bg-bgElevated border border-borderMedium rounded
                         text-textPrimary text-sm tabular-nums
                         focus:outline-none focus:ring-1 focus:ring-accentBlue"
            />
          </div>
          <button
            type="submit"
            disabled={editPending}
            className="px-2.5 py-1.5 bg-accentBlue text-white text-xs rounded
                       hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            {editPending ? "…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="px-2.5 py-1.5 text-textSecondary text-xs rounded
                       hover:text-textPrimary transition-colors"
          >
            Cancel
          </button>
        </form>
        {editState?.error && (
          <p role="alert" className="mt-1 text-budgetOverspent text-xs">
            {editState.error}
          </p>
        )}
      </li>
    )
  }

  return (
    <li className="flex items-center justify-between py-2 border-b border-borderSubtle last:border-0 group">
      <span className="text-textPrimary text-sm">{item.label}</span>

      <div className="flex items-center gap-2">
        <span className="text-textSecondary text-sm tabular-nums">
          {formatUSD(item.allocatedAmount)}
        </span>

        {/* Edit/delete controls — visible on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={`Edit ${item.label}`}
            className="p-1 text-textMuted hover:text-textPrimary rounded transition-colors text-xs"
          >
            ✏️
          </button>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={item.id} />
            <button
              type="submit"
              disabled={deletePending}
              aria-label={`Delete ${item.label}`}
              className="p-1 text-textMuted hover:text-budgetOverspent rounded
                         disabled:opacity-50 transition-colors text-xs"
            >
              🗑️
            </button>
          </form>
        </div>
      </div>

      {deleteState?.error && (
        <p role="alert" className="sr-only">
          {deleteState.error}
        </p>
      )}
    </li>
  )
}

// ─── TierGroup ────────────────────────────────────────────────────────────────

/**
 * TierGroup — renders one budget tier section (Essential Needs, Financial Goals,
 * or Lifestyle) with a live item list and full CRUD via Server Actions.
 */
export default function TierGroup({ tier, title, items }: TierGroupProps) {
  const totalAllocated = items.reduce(
    (sum, item) => sum + parseFloat(item.allocatedAmount),
    0,
  )

  return (
    <div className="bg-bgSurface border border-borderSubtle rounded-xl p-5">
      {/* Tier header row with total */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-textPrimary font-semibold text-sm">{title}</h2>
        <span className="text-textSecondary text-sm tabular-nums">
          {formatUSD(totalAllocated)}
        </span>
      </div>

      {/* Budget item list */}
      {items.length > 0 ? (
        <ul className="mb-1">
          {items.map((item) => (
            <BudgetItemRow key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <p className="text-textMuted text-xs mb-2 py-2">No items yet — add one below.</p>
      )}

      {/* Add item form */}
      <AddItemForm tier={tier} />
    </div>
  )
}
