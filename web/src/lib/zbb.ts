/**
 * Zero-Based Budgeting (ZBB) computation library.
 *
 * All inputs accept string | number because Drizzle ORM returns numeric(10,2)
 * Postgres columns as JS strings at runtime. Every value is coerced through
 * parseFloat() before arithmetic to prevent silent NaN propagation.
 */

export type ZbbState = 'healthy' | 'warning' | 'overspent';

export interface ZbbResult {
  /** income − totalAllocations (negative when over-budget) */
  budgetBalance: number;
  /** income − totalActuals (negative when actuals exceed income) */
  actualBalance: number;
  /**
   * (budgetBalance / income) × 100.
   * 0 when income ≤ 0 (edge case guard).
   */
  remainingPct: number;
  /** Visual state used to drive counter card colour. */
  state: ZbbState;
}

/**
 * Percentage of income that may remain unallocated and still be considered
 * "on target". At or below this threshold the budget is healthy (green).
 * Above it the user still has meaningful dollars to assign (yellow / warning).
 */
export const WARNING_THRESHOLD_PCT = 10;

/**
 * Derive ZBB counter state from income, planned allocations, and (optionally)
 * actual spend figures.
 *
 * @param income           Monthly take-home income (string or number).
 * @param totalAllocations Sum of all budget-item allocated amounts.
 * @param totalActuals     Sum of all budget-item actual-spend amounts (default 0).
 */
export function computeZbbState(
  income: string | number,
  totalAllocations: string | number,
  totalActuals: string | number = 0,
): ZbbResult {
  const inc = parseFloat(String(income));
  const alloc = parseFloat(String(totalAllocations));
  const actuals = parseFloat(String(totalActuals));

  // Graceful NaN guard — treat unparseable inputs as zero
  const safeInc = isNaN(inc) ? 0 : inc;
  const safeAlloc = isNaN(alloc) ? 0 : alloc;
  const safeActuals = isNaN(actuals) ? 0 : actuals;

  const budgetBalance = safeInc - safeAlloc;
  const actualBalance = safeInc - safeActuals;

  // No-income edge case: percentage is undefined; classify conservatively.
  if (safeInc <= 0) {
    return {
      budgetBalance,
      actualBalance,
      remainingPct: 0,
      state: safeAlloc > 0 ? 'overspent' : 'warning',
    };
  }

  const remainingPct = (budgetBalance / safeInc) * 100;

  let state: ZbbState;
  if (budgetBalance < 0) {
    // Allocated more than income
    state = 'overspent';
  } else if (remainingPct > WARNING_THRESHOLD_PCT) {
    // More than 10 % of income still unallocated
    state = 'warning';
  } else {
    // 0–10 % remaining: well-balanced
    state = 'healthy';
  }

  return { budgetBalance, actualBalance, remainingPct, state };
}
