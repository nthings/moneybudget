/**
 * Shared transaction category list.
 *
 * Placed in lib/ (not actions/) so it can be imported by both:
 *   - Server files: actions/transactions.ts (for Zod enum validation)
 *   - Client components: AddTransactionForm, TransactionTable
 *
 * Must NOT be in a "use server" file — Next.js does not serialize non-function
 * exports from server action files to the client (they arrive as undefined).
 */

export const TRANSACTION_CATEGORIES = [
  "Groceries",
  "Dining",
  "Transport",
  "Utilities",
  "Housing",
  "Healthcare",
  "Entertainment",
  "Shopping",
  "Travel",
  "Education",
  "Personal Care",
  "Subscriptions",
  "Savings",
  "Income",
  "Other",
] as const

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number]
