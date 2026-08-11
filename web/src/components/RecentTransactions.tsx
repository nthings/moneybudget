/**
 * RecentTransactions — presentational list of up to 5 recent transaction rows.
 *
 * Pure presentational: no async data, no DB access. The parent RSC supplies
 * the pre-fetched rows. Amount is kept as string because Drizzle returns
 * numeric(10,2) Postgres columns as JS strings; formatting is done here.
 */

export interface TransactionRow {
  id: number
  merchant: string
  category: string
  /** Drizzle numeric string, e.g. "-42.50" or "1200.00" */
  amount: string
  /** ISO date string, e.g. "2024-07-15" */
  date: string
}

interface RecentTransactionsProps {
  transactions: TransactionRow[]
}

const formatCurrency = (raw: string) => {
  const n = parseFloat(raw)
  if (isNaN(n)) return raw
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Math.abs(n))
}

const formatDate = (iso: string) => {
  // "YYYY-MM-DD" → "Jul 15"  (locale-safe, no timezone shift)
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="bg-bgSurface border border-borderSubtle rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-borderSubtle">
        <h2 className="text-textPrimary text-sm font-semibold">Recent Transactions</h2>
      </div>

      {transactions.length === 0 ? (
        <p className="px-5 py-6 text-textMuted text-sm text-center">
          No transactions this month.
        </p>
      ) : (
        <ul role="list">
          {transactions.map((tx, idx) => {
            const isExpense = parseFloat(tx.amount) < 0
            return (
              <li
                key={tx.id}
                className={`flex items-center justify-between px-5 py-3 ${
                  idx < transactions.length - 1 ? 'border-b border-borderSubtle' : ''
                }`}
              >
                {/* Left: merchant + category */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-textPrimary text-sm font-medium truncate">
                    {tx.merchant}
                  </span>
                  <span className="text-textMuted text-xs capitalize">{tx.category}</span>
                </div>

                {/* Right: amount + date */}
                <div className="flex flex-col items-end gap-0.5 shrink-0 ml-4">
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      isExpense ? 'text-budgetOverspent' : 'text-budgetHealthy'
                    }`}
                  >
                    {isExpense ? '−' : '+'}
                    {formatCurrency(tx.amount)}
                  </span>
                  <span className="text-textMuted text-xs">{formatDate(tx.date)}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
