/**
 * ZBB Counter widget for MoneyBudget Allocator.
 *
 * Creates a single counter board visualising one of three zero-based budgeting
 * (ZBB) balance states:
 *   • healthy   — positive balance (green)
 *   • warning   — within 5 % of zero (yellow)
 *   • overspent — negative balance (red)
 *
 * Usage:
 *   import { buildZbbCounter, ZBB_COUNTER } from './zbb-counter.js';
 *   const board = buildZbbCounter(penpot, COLORS, 'healthy');
 *
 * Each board has four children (in order):
 *   state-bar   — coloured left-edge rectangle
 *   label       — "ZBB Balance" caption text
 *   amount      — representative dollar amount text
 *   state-label — state name text (coloured to match state)
 *
 * @param {object} penpot  Penpot plugin API reference (or test mock)
 * @param {object} COLORS  Design-token map from colors.js
 * @param {string} state   One of: 'healthy' | 'warning' | 'overspent'
 * @returns {PenpotBoard}  Counter board with children appended
 */
import { makeHelpers } from './helpers.js';

// ── Layout constants ──────────────────────────────────────────────────────────
export const ZBB_COUNTER = {
  WIDTH:  360,
  HEIGHT:  80,

  STATE_BAR_W:  4,   // width of the left colour accent bar

  LABEL_X:    16,
  LABEL_Y:    12,
  LABEL_FONT_SIZE: 11,

  AMOUNT_X:   16,
  AMOUNT_Y:   32,
  AMOUNT_FONT_SIZE: 20,

  STATE_LABEL_X:  16,
  STATE_LABEL_Y:  58,
  STATE_LABEL_FONT_SIZE: 11,
};

// ── Per-state configuration ───────────────────────────────────────────────────
const STATE_CONFIG = {
  healthy: {
    displayLabel: 'Healthy',
    colorKey:     'BUDGET_HEALTHY',
    amount:       '$1,250.00',
  },
  warning: {
    displayLabel: 'Warning',
    colorKey:     'BUDGET_WARNING',
    amount:       '$42.00',
  },
  overspent: {
    displayLabel: 'Overspent',
    colorKey:     'BUDGET_OVERSPENT',
    amount:       '-$215.00',
  },
};

// ── Builder ───────────────────────────────────────────────────────────────────
export function buildZbbCounter(penpot, COLORS, state) {
  const cfg = STATE_CONFIG[state];
  if (!cfg) {
    throw new Error(
      `buildZbbCounter: unknown state "${state}". ` +
      `Expected one of: ${Object.keys(STATE_CONFIG).join(', ')}.`
    );
  }

  const { mkRect, mkBoard, mkText } = makeHelpers(penpot);
  const stateColor = COLORS[cfg.colorKey];

  // ── 1. Container board ───────────────────────────────────────────────────────
  const board = mkBoard({
    name:   `ZBB Counter - ${cfg.displayLabel}`,
    width:  ZBB_COUNTER.WIDTH,
    height: ZBB_COUNTER.HEIGHT,
    fills:  [{ fillColor: COLORS.BG_ELEVATED, fillOpacity: 1 }],
  });

  // ── 2. State colour bar (left edge accent) ──────────────────────────────────
  const stateBar = mkRect({
    name:   'state-bar',
    x:      0,
    y:      0,
    width:  ZBB_COUNTER.STATE_BAR_W,
    height: ZBB_COUNTER.HEIGHT,
    fills:  [{ fillColor: stateColor, fillOpacity: 1 }],
  });
  board.appendChild(stateBar);

  // ── 3. "ZBB Balance" caption ────────────────────────────────────────────────
  const label = mkText('ZBB Balance', {
    name:       'label',
    x:          ZBB_COUNTER.LABEL_X,
    y:          ZBB_COUNTER.LABEL_Y,
    fontSize:   ZBB_COUNTER.LABEL_FONT_SIZE,
    fontWeight: '400',
    fills:      [{ fillColor: COLORS.TEXT_SECONDARY, fillOpacity: 1 }],
  });
  board.appendChild(label);

  // ── 4. Amount text ──────────────────────────────────────────────────────────
  const amount = mkText(cfg.amount, {
    name:       'amount',
    x:          ZBB_COUNTER.AMOUNT_X,
    y:          ZBB_COUNTER.AMOUNT_Y,
    fontSize:   ZBB_COUNTER.AMOUNT_FONT_SIZE,
    fontWeight: '700',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  });
  board.appendChild(amount);

  // ── 5. State label (coloured to match state) ────────────────────────────────
  const stateLabel = mkText(cfg.displayLabel, {
    name:       'state-label',
    x:          ZBB_COUNTER.STATE_LABEL_X,
    y:          ZBB_COUNTER.STATE_LABEL_Y,
    fontSize:   ZBB_COUNTER.STATE_LABEL_FONT_SIZE,
    fontWeight: '500',
    fills:      [{ fillColor: stateColor, fillOpacity: 1 }],
  });
  board.appendChild(stateLabel);

  return board;
}
