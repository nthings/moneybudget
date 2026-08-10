import type { ZbbState } from "@/lib/zbb"

interface ZbbCounterProps {
  label: string
  /** Dollar balance (may be negative when overspent) */
  balance: number
  state: ZbbState
}

const STATE_CONFIG: Record<ZbbState, { colorClass: string; stateLabel: string }> = {
  healthy: { colorClass: "text-budgetHealthy", stateLabel: "On Track" },
  warning: { colorClass: "text-budgetWarning", stateLabel: "Unallocated" },
  overspent: { colorClass: "text-budgetOverspent", stateLabel: "Over Budget" },
}

const STATE_BORDER: Record<ZbbState, string> = {
  healthy: "border-budgetHealthy/30",
  warning: "border-budgetWarning/30",
  overspent: "border-budgetOverspent/30",
}

/**
 * ZbbCounter — display card for a single Zero-Based Budgeting balance.
 * Pure presentational; state coloring is driven by the ZbbState prop.
 */
export default function ZbbCounter({ label, balance, state }: ZbbCounterProps) {
  const { colorClass, stateLabel } = STATE_CONFIG[state]
  const borderClass = STATE_BORDER[state]

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(balance)

  return (
    <div
      className={`bg-bgSurface border ${borderClass} rounded-xl p-5 flex flex-col gap-2`}
    >
      <p className="text-textSecondary text-xs uppercase tracking-widest font-medium">
        {label}
      </p>
      <p className={`text-3xl font-bold tabular-nums ${colorClass}`}>{formatted}</p>
      <span className={`text-xs font-semibold uppercase tracking-wide ${colorClass}`}>
        {stateLabel}
      </span>
    </div>
  )
}
