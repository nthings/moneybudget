import { describe, it, expect } from 'vitest';
import { computeZbbState, WARNING_THRESHOLD_PCT } from './zbb';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convenience: call with number-only args (simplest happy path). */
const zbb = (income: number, alloc: number, actuals = 0) =>
  computeZbbState(income, alloc, actuals);

/** Convenience: call with string args to verify Drizzle coercion (MEM017). */
const zbbStr = (income: string, alloc: string, actuals = '0') =>
  computeZbbState(income, alloc, actuals);

// ---------------------------------------------------------------------------
// Positive paths
// ---------------------------------------------------------------------------

describe('computeZbbState — healthy state', () => {
  it('returns healthy when allocations leave ≤10 % of income unallocated', () => {
    // 5 % remaining → healthy
    const result = zbb(4000, 3800);
    expect(result.state).toBe('healthy');
    expect(result.budgetBalance).toBeCloseTo(200);
    expect(result.remainingPct).toBeCloseTo(5);
  });

  it('returns healthy when the budget is perfectly balanced (0 remaining)', () => {
    const result = zbb(3000, 3000);
    expect(result.state).toBe('healthy');
    expect(result.budgetBalance).toBe(0);
    expect(result.remainingPct).toBe(0);
  });

  it('returns healthy exactly at the WARNING_THRESHOLD_PCT boundary', () => {
    // Exactly 10 % remaining is still healthy (not yet above threshold)
    const income = 2000;
    const alloc = income * (1 - WARNING_THRESHOLD_PCT / 100); // 1800
    const result = zbb(income, alloc);
    expect(result.state).toBe('healthy');
    expect(result.remainingPct).toBeCloseTo(WARNING_THRESHOLD_PCT);
  });
});

describe('computeZbbState — warning state', () => {
  it('returns warning when more than 10 % of income is still unallocated', () => {
    // 50 % remaining — user has barely started allocating
    const result = zbb(4000, 2000);
    expect(result.state).toBe('warning');
    expect(result.remainingPct).toBeCloseTo(50);
  });

  it('returns warning when allocations are zero (nothing assigned yet)', () => {
    const result = zbb(5000, 0);
    expect(result.state).toBe('warning');
    expect(result.budgetBalance).toBe(5000);
    expect(result.remainingPct).toBe(100);
  });

  it('returns warning just above the threshold boundary', () => {
    // 10.01 % remaining
    const result = zbb(10000, 8999);
    expect(result.state).toBe('warning');
    expect(result.remainingPct).toBeCloseTo(10.01);
  });
});

describe('computeZbbState — overspent state', () => {
  it('returns overspent when total allocations exceed income', () => {
    const result = zbb(3000, 3500);
    expect(result.state).toBe('overspent');
    expect(result.budgetBalance).toBeCloseTo(-500);
    expect(result.remainingPct).toBeCloseTo(-16.67, 1);
  });

  it('returns overspent when allocations are only $1 over income', () => {
    const result = zbb(2000, 2001);
    expect(result.state).toBe('overspent');
    expect(result.budgetBalance).toBeCloseTo(-1);
  });
});

// ---------------------------------------------------------------------------
// Drizzle string-coercion (MEM017)
// ---------------------------------------------------------------------------

describe('computeZbbState — Drizzle string inputs (MEM017)', () => {
  it('coerces string income and allocations via parseFloat before arithmetic', () => {
    const result = zbbStr('4000.00', '3800.00', '3900.00');
    expect(result.state).toBe('healthy');
    expect(result.budgetBalance).toBeCloseTo(200);
    expect(result.actualBalance).toBeCloseTo(100);
    expect(result.remainingPct).toBeCloseTo(5);
  });

  it('handles string values that represent an overspent budget', () => {
    const result = zbbStr('1000.00', '1250.00');
    expect(result.state).toBe('overspent');
    expect(result.budgetBalance).toBeCloseTo(-250);
  });

  it('handles decimal-precision strings without floating-point truncation', () => {
    const result = zbbStr('3333.33', '3000.00');
    expect(result.budgetBalance).toBeCloseTo(333.33, 2);
  });
});

// ---------------------------------------------------------------------------
// No-income edge case
// ---------------------------------------------------------------------------

describe('computeZbbState — no-income edge case', () => {
  it('returns warning with 0 remainingPct when income is 0 and allocations are 0', () => {
    const result = zbb(0, 0);
    expect(result.state).toBe('warning');
    expect(result.remainingPct).toBe(0);
    expect(result.budgetBalance).toBe(0);
  });

  it('returns overspent when income is 0 but allocations exist', () => {
    const result = zbb(0, 500);
    expect(result.state).toBe('overspent');
    expect(result.budgetBalance).toBe(-500);
    expect(result.remainingPct).toBe(0);
  });

  it('treats negative income the same as zero income', () => {
    const result = zbb(-100, 0);
    expect(result.state).toBe('warning');
    expect(result.remainingPct).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Actual-balance computation
// ---------------------------------------------------------------------------

describe('computeZbbState — actualBalance field', () => {
  it('computes actualBalance independently from budgetBalance', () => {
    // income 5000, allocations 4800 (healthy), actuals 4200 (under actual spend)
    const result = zbb(5000, 4800, 4200);
    expect(result.budgetBalance).toBeCloseTo(200);
    expect(result.actualBalance).toBeCloseTo(800);
    expect(result.state).toBe('healthy');
  });

  it('actualBalance can be negative when actuals exceed income', () => {
    const result = zbb(3000, 2900, 3100);
    expect(result.actualBalance).toBeCloseTo(-100);
    // state is driven by allocations, not actuals
    expect(result.state).toBe('healthy');
  });

  it('defaults actualBalance to income when no actuals provided', () => {
    const result = zbb(4000, 3600);
    // totalActuals defaults to 0, so actualBalance = 4000 - 0 = 4000
    expect(result.actualBalance).toBe(4000);
  });
});

// ---------------------------------------------------------------------------
// Negative / malformed inputs
// ---------------------------------------------------------------------------

describe('computeZbbState — malformed and boundary inputs', () => {
  it('treats NaN-coerced inputs as zero without throwing', () => {
    // 'abc' → parseFloat → NaN → coerced to 0
    const result = computeZbbState('abc', 'xyz');
    expect(result.state).toBe('warning');   // 0 income, 0 alloc
    expect(result.budgetBalance).toBe(0);
  });

  it('handles very large numbers without overflow', () => {
    const result = zbb(1_000_000, 950_000);
    expect(result.state).toBe('healthy');
    expect(result.remainingPct).toBeCloseTo(5);
  });

  it('handles fractional cent values without throwing', () => {
    const result = zbbStr('1000.005', '999.995');
    expect(result.budgetBalance).toBeCloseTo(0.01, 2);
    expect(result.state).toBe('healthy');
  });
});
