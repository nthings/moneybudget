"use client"

import { useState } from "react"
import { deleteTransaction as _deleteTransaction } from "@/actions/transactions"
import { TRANSACTION_CATEGORIES } from "@/lib/transaction-categories"
import type { TransactionRow } from "@/components/RecentTransactions"

// Thin wrapper: <form action> expects (formData: FormData) => void | Promise<void>.
// The Server Action returns { error } for useActionState callers; we discard the
// return here so TypeScript is satisfied while the server-side delete still runs.
async function deleteTransaction(formData: FormData): Promise<void> {
  await _deleteTransaction(null, formData)
}

// Re-export so pages/other components can import the row shape from here too.
export type { TransactionRow }

interface TransactionTableProps {
  transactions: TransactionRow[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(raw: string): string {
  const n = parseFloat(raw)
  if (isNaN(n)) return raw
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Math.abs(n))
}

function formatDate(iso: string): string {
  // "YYYY-MM-DD" → "Jul 15, 2024" — no timezone shift via explicit parts
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// ─── TransactionTable ─────────────────────────────────────────────────────────

/**
 * TransactionTable — client component that owns category + search filtering.
 *
 * - Category filter: dropdown that narrows rows to a specific TRANSACTION_CATEGORIES value.
 * - Search filter: text input that matches merchant or category (case-insensitive).
 * - Delete: plain <form action={deleteTransaction}> with hidden `id` — zero-JS required.
 */
export default function TransactionTable({ transactions }: TransactionTableProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Apply filters client-side
  const filtered = transactions.filter((tx) => {
    const matchesCategory =
      categoryFilter === "all" || tx.category === categoryFilter

    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      q === "" ||
      tx.merchant.toLowerCase().includes(q) ||
      tx.category.toLowerCase().includes(q)

    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col gap-4">
      {/* ── Filter controls ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder="Search merchant or category…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search transactions"
          className="flex-1 px-3 py-2 bg-bgElevated border border-borderMedium rounded-lg
                     text-textPrimary text-sm placeholder:text-textMuted
                     focus:outline-none focus:ring-2 focus:ring-accentBlue"
        />

        {/* Category dropdown */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
          className="px-3 py-2 bg-bgElevated border border-borderMedium rounded-lg
                     text-textPrimary text-sm
                     focus:outline-none focus:ring-2 focus:ring-accentBlue"
        >
          <option value="all">All categories</option>
          {TRANSACTION_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <p className="py-8 text-textMuted text-sm text-center">
          {transactions.length === 0
            ? "No transactions yet. Add your first transaction above."
            : "No transactions match your filters."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-borderSubtle">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderSubtle bg-bgElevated">
                <th className="px-4 py-3 text-left text-textSecondary font-medium">Date</th>
                <th className="px-4 py-3 text-left text-textSecondary font-medium">Merchant</th>
                <th className="px-4 py-3 text-left text-textSecondary font-medium">Category</th>
                <th className="px-4 py-3 text-right text-textSecondary font-medium tabular-nums">
                  Amount
                </th>
                <th className="px-4 py-3 text-right text-textSecondary font-medium sr-only">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx, idx) => {
                const isExpense = parseFloat(tx.amount) < 0
                return (
                  <tr
                    key={tx.id}
                    className={`${
                      idx < filtered.length - 1 ? "border-b border-borderSubtle" : ""
                    } hover:bg-bgHover transition-colors`}
                  >
                    <td className="px-4 py-3 text-textMuted whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="px-4 py-3 text-textPrimary font-medium max-w-[200px] truncate">
                      {tx.merchant}
                    </td>
                    <td className="px-4 py-3 text-textSecondary">{tx.category}</td>
                    <td
                      className={`px-4 py-3 text-right font-semibold tabular-nums ${
                        isExpense ? "text-budgetOverspent" : "text-budgetHealthy"
                      }`}
                    >
                      {isExpense ? "−" : "+"}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {/* Delete — plain Server Action form; no JS required */}
                      <form action={deleteTransaction}>
                        <input type="hidden" name="id" value={tx.id} />
                        <button
                          type="submit"
                          aria-label={`Delete transaction at ${tx.merchant}`}
                          className="px-2 py-1 text-xs text-textMuted rounded
                                     hover:text-budgetOverspent hover:bg-bgElevated
                                     transition-colors focus:outline-none focus:ring-2 focus:ring-accentBlue"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Row count */}
      {transactions.length > 0 && (
        <p className="text-textMuted text-xs text-right">
          Showing {filtered.length} of {transactions.length} transaction
          {transactions.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}
