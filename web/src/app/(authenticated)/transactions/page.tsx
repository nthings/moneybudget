import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { eq, desc } from "drizzle-orm"
import { db } from "@/db"
import { transactions } from "@/db/schema"
import { AddTransactionForm } from "@/components/AddTransactionForm"
import TransactionTable from "@/components/TransactionTable"
import type { TransactionRow } from "@/components/RecentTransactions"

export default async function TransactionsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  const userId = session.user.id

  // ── Fetch all transactions for this user, newest first ─────────────────
  const rows = await db
    .select({
      id: transactions.id,
      merchant: transactions.merchant,
      category: transactions.category,
      amount: transactions.amount,
      date: transactions.date,
    })
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date))

  // Drizzle returns the `date` column as a string ("YYYY-MM-DD") for Postgres
  // date types; cast to string to satisfy TransactionRow.
  const txRows: TransactionRow[] = rows.map((r) => ({
    id: r.id,
    merchant: r.merchant,
    category: r.category,
    amount: r.amount,
    date: String(r.date),
  }))

  return (
    <div className="p-8 max-w-4xl">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-textPrimary mb-1">Transactions</h1>
        <p className="text-textSecondary text-sm">
          Track your income and expenses.
        </p>
      </div>

      {/* ── Add transaction form ─────────────────────────────────────────── */}
      <div className="mb-8">
        <AddTransactionForm />
      </div>

      {/* ── Transaction table with filters ──────────────────────────────── */}
      <TransactionTable transactions={txRows} />
    </div>
  )
}
