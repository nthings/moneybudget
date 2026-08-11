/**
 * StatCard — flat accent-strip card for a single dashboard aggregate number.
 *
 * Pure presentational: no ZBB state logic, no async data. The parent RSC
 * supplies label, amount, and an optional accent variant.
 */

export type StatCardAccent = 'income' | 'spent' | 'remaining'

interface StatCardProps {
  label: string
  /** Pre-computed dollar amount (number for clean formatting). */
  amount: number
  accent?: StatCardAccent
}

const ACCENT_CONFIG: Record<StatCardAccent, { strip: string; value: string }> = {
  income:    { strip: 'bg-budgetHealthy',   value: 'text-budgetHealthy' },
  spent:     { strip: 'bg-budgetOverspent', value: 'text-budgetOverspent' },
  remaining: { strip: 'bg-accentBlue',      value: 'text-accentBlue' },
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n)

export default function StatCard({ label, amount, accent = 'remaining' }: StatCardProps) {
  const { strip, value } = ACCENT_CONFIG[accent]

  return (
    <div className="bg-bgSurface border border-borderSubtle rounded-xl overflow-hidden flex flex-col">
      {/* Accent strip along the top */}
      <div className={`h-1 w-full ${strip}`} aria-hidden="true" />

      <div className="p-5 flex flex-col gap-2">
        <p className="text-textSecondary text-xs uppercase tracking-widest font-medium">
          {label}
        </p>
        <p className={`text-2xl font-bold tabular-nums ${value}`}>
          {formatCurrency(amount)}
        </p>
      </div>
    </div>
  )
}
