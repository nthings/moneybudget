/**
 * Piggy Banks screen assembler for MoneyBudget Penpot prototype.
 *
 * Exports:
 *   buildPiggyBanks(penpot, COLORS) → { sidebar, content }
 *     sidebar — 240×960 sidebar board with 'Piggy Banks' active nav item
 *     content — 1200×960 content board (x:240) with header, savings-goal
 *               cards (title, amount fraction, percentage, two-rect progress
 *               bar), and five transaction rows
 *   PIGGYBANKS      — layout constants
 *   SAVINGS_GOALS   — savings goal definitions (exported for testing)
 *   PB_TRANSACTIONS — transaction sample data (exported for testing)
 *
 * Content board children (12):
 *   header-title          text  (x:24,  y:24)
 *   header-date           text  (x:1000, y:28)
 *   goals-section-title   text  (x:24,  y:72)
 *   goal-vacation         board (x:24,  y:104) — 368×120
 *   goal-emergency        board (x:408, y:104) — 368×120
 *   goal-laptop           board (x:792, y:104) — 368×120
 *   history-section-title text  (x:24,  y:256)
 *   tx-row-0              board (x:24,  y:296) — 1152×52
 *   tx-row-1              board (x:24,  y:356) — 1152×52
 *   tx-row-2              board (x:24,  y:416) — 1152×52
 *   tx-row-3              board (x:24,  y:476) — 1152×52
 *   tx-row-4              board (x:24,  y:536) — 1152×52
 *
 * Each goal card children (6):
 *   goal-bg    rect  — 368×120, borderRadius:8, fill:BG_SURFACE
 *   goal-title text  — x:16, y:16, title of the goal
 *   goal-pct   text  — x:(GOAL_W−GOAL_PCT_X_OFFSET), y:16, "N%" in colorKey
 *   goal-amount text — x:16, y:44, "$current / $target"
 *   bar-bg     rect  — x:16, y:88, 336×8, fill:BG_ELEVATED
 *   bar-fill   rect  — x:16, y:88, computed×8, fill:COLORS[colorKey]
 *
 * Each tx-row children (6):
 *   row-bg, merchant, category-pill, category-label, amount, date
 */
import { makeHelpers } from './helpers.js';
import { buildSidebar } from './sidebar.js';

// ── Layout constants ──────────────────────────────────────────────────────────
export const PIGGYBANKS = {
  // Sidebar (shared width reference)
  SIDEBAR_W: 240,

  // Content board
  CONTENT_X: 240,
  CONTENT_W: 1200,
  CONTENT_H: 960,

  // Shared spacing
  PADDING: 24,
  GAP:     16,

  // Header bar
  HEADER_TITLE_Y:    24,
  HEADER_TITLE_FONT: 22,
  HEADER_DATE_FONT:  13,

  // Goals section title
  GOALS_SECTION_Y:    72,
  GOALS_SECTION_FONT: 16,

  // Savings goal cards
  GOALS_Y:          104,
  GOAL_W:           368,
  GOAL_H:           120,
  GOAL_R:             8,   // border-radius
  GOAL_PAD:          16,   // internal card padding
  GOAL_TITLE_FONT:   14,
  GOAL_AMOUNT_FONT:  12,
  GOAL_PCT_FONT:     16,
  GOAL_PCT_X_OFFSET: 56,   // pct text x = GOAL_W − GOAL_PCT_X_OFFSET

  // Progress bar (inside goal card)
  BAR_Y: 88,
  BAR_H:  8,
  BAR_R:  4,

  // History section title
  HISTORY_SECTION_Y:    256,
  HISTORY_SECTION_FONT:  16,

  // Transaction rows
  TX_Y_START:           296,
  TX_ROW_H:              52,
  TX_ROW_R:               6,
  TX_GAP:                 8,
  TX_FONT:               13,
  TX_FONT_SMALL:         11,
  TX_AMOUNT_X_OFFSET:   120,
  TX_DATE_X_OFFSET:      60,

  // Category pill badge
  PILL_W: 80,
  PILL_H: 20,
  PILL_R: 10,
};

// ── Sample data ───────────────────────────────────────────────────────────────
/** Savings goal definitions (exported so tests can reference them directly). */
export const SAVINGS_GOALS = [
  { name: 'goal-vacation',  title: 'Vacation Fund',  current:  800, target: 1000, colorKey: 'ACCENT_BLUE'    },
  { name: 'goal-emergency', title: 'Emergency Fund', current: 3200, target: 5000, colorKey: 'BUDGET_HEALTHY' },
  { name: 'goal-laptop',    title: 'New Laptop',     current:  450, target: 1200, colorKey: 'ACCENT_PURPLE'  },
];

/** Piggy Banks transaction history rows (exported so tests can reference them directly). */
export const PB_TRANSACTIONS = [
  { merchant: 'Transfer to Vacation Fund',  category: 'Savings',  amount: '+$200.00', date: 'Aug 9' },
  { merchant: 'Transfer to Emergency Fund', category: 'Savings',  amount: '+$500.00', date: 'Aug 7' },
  { merchant: 'ATM Withdrawal',             category: 'Cash',     amount: '-$60.00',  date: 'Aug 6' },
  { merchant: 'Transfer to Laptop Fund',    category: 'Savings',  amount: '+$150.00', date: 'Aug 4' },
  { merchant: 'Interest Earned',            category: 'Interest', amount: '+$3.24',   date: 'Aug 1' },
];

// ── Private helpers ───────────────────────────────────────────────────────────

/**
 * Build a single savings-goal card board (GOAL_W × GOAL_H).
 *
 * Children (6):
 *   goal-bg    — rect, full card background
 *   goal-title — text, goal name top-left
 *   goal-pct   — text, "N%" top-right, coloured by colorKey
 *   goal-amount — text, "$current / $target" below title
 *   bar-bg     — rect, full-width progress track at y:88
 *   bar-fill   — rect, filled portion derived from current/target ratio
 *
 * @param {object} penpot
 * @param {object} COLORS
 * @param {{ name, title, current, target, colorKey }} goal
 * @returns {PenpotBoard}
 */
function buildGoalCard(penpot, COLORS, goal) {
  const { mkRect, mkBoard, mkText } = makeHelpers(penpot);
  const D = PIGGYBANKS;

  const pct       = Math.round(goal.current / goal.target * 100);
  const barInnerW = D.GOAL_W - D.GOAL_PAD * 2;           // 336
  const fillW     = Math.round(pct / 100 * barInnerW);

  const amountText =
    `$${goal.current.toLocaleString('en-US')} / $${goal.target.toLocaleString('en-US')}`;

  const card = mkBoard({
    name:   goal.name,
    width:  D.GOAL_W,
    height: D.GOAL_H,
    fills:  [{ fillColor: COLORS.BG_SURFACE, fillOpacity: 1 }],
  });

  // ── Card background (provides border-radius visual) ───────────────────────
  card.appendChild(mkRect({
    name:         'goal-bg',
    x:            0,
    y:            0,
    width:        D.GOAL_W,
    height:       D.GOAL_H,
    fills:        [{ fillColor: COLORS.BG_SURFACE, fillOpacity: 1 }],
    borderRadius: D.GOAL_R,
  }));

  // ── Goal title (top-left) ─────────────────────────────────────────────────
  card.appendChild(mkText(goal.title, {
    name:       'goal-title',
    x:          D.GOAL_PAD,
    y:          16,
    fontSize:   D.GOAL_TITLE_FONT,
    fontWeight: '600',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  }));

  // ── Percentage (top-right, coloured) ─────────────────────────────────────
  card.appendChild(mkText(`${pct}%`, {
    name:       'goal-pct',
    x:          D.GOAL_W - D.GOAL_PCT_X_OFFSET,
    y:          16,
    fontSize:   D.GOAL_PCT_FONT,
    fontWeight: '700',
    fills:      [{ fillColor: COLORS[goal.colorKey], fillOpacity: 1 }],
  }));

  // ── Amount fraction (below title) ─────────────────────────────────────────
  card.appendChild(mkText(amountText, {
    name:       'goal-amount',
    x:          D.GOAL_PAD,
    y:          44,
    fontSize:   D.GOAL_AMOUNT_FONT,
    fontWeight: '400',
    fills:      [{ fillColor: COLORS.TEXT_SECONDARY, fillOpacity: 1 }],
  }));

  // ── Progress bar track (full width) ──────────────────────────────────────
  card.appendChild(mkRect({
    name:         'bar-bg',
    x:            D.GOAL_PAD,
    y:            D.BAR_Y,
    width:        barInnerW,
    height:       D.BAR_H,
    fills:        [{ fillColor: COLORS.BG_ELEVATED, fillOpacity: 1 }],
    borderRadius: D.BAR_R,
  }));

  // ── Progress bar fill (proportional to completion) ────────────────────────
  card.appendChild(mkRect({
    name:         'bar-fill',
    x:            D.GOAL_PAD,
    y:            D.BAR_Y,
    width:        fillW,
    height:       D.BAR_H,
    fills:        [{ fillColor: COLORS[goal.colorKey], fillOpacity: 1 }],
    borderRadius: D.BAR_R,
  }));

  return card;
}

/**
 * Build a single transaction row board (rowWidth × TX_ROW_H).
 *
 * Children (6): row-bg, merchant, category-pill, category-label, amount, date.
 * Positive amounts (starting with '+') use BUDGET_HEALTHY; negatives use
 * TEXT_PRIMARY.
 *
 * @param {object} penpot
 * @param {object} COLORS
 * @param {{ merchant, category, amount, date }} tx
 * @param {number} rowWidth  CONTENT_W − PADDING * 2  (= 1152)
 * @param {number} index     Zero-based row index
 * @returns {PenpotBoard}
 */
function buildPbTxRow(penpot, COLORS, tx, rowWidth, index) {
  const { mkRect, mkBoard, mkText } = makeHelpers(penpot);
  const D          = PIGGYBANKS;
  const isPositive = tx.amount.startsWith('+');

  const row = mkBoard({
    name:   `tx-row-${index}`,
    width:  rowWidth,
    height: D.TX_ROW_H,
    fills:  [{ fillColor: COLORS.BG_SURFACE, fillOpacity: 1 }],
  });

  // ── Row background ────────────────────────────────────────────────────────
  row.appendChild(mkRect({
    name:         'row-bg',
    x:            0,
    y:            0,
    width:        rowWidth,
    height:       D.TX_ROW_H,
    fills:        [{ fillColor: COLORS.BG_SURFACE, fillOpacity: 1 }],
    borderRadius: D.TX_ROW_R,
  }));

  // ── Merchant name (top-left) ──────────────────────────────────────────────
  row.appendChild(mkText(tx.merchant, {
    name:       'merchant',
    x:          D.PADDING,
    y:          16,
    fontSize:   D.TX_FONT,
    fontWeight: '500',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  }));

  // ── Category pill background ──────────────────────────────────────────────
  row.appendChild(mkRect({
    name:         'category-pill',
    x:            D.PADDING,
    y:            D.TX_ROW_H - D.PILL_H - 6,   // 26
    width:        D.PILL_W,
    height:       D.PILL_H,
    fills:        [{ fillColor: COLORS.BG_ELEVATED, fillOpacity: 1 }],
    borderRadius: D.PILL_R,
  }));

  // ── Category label (inside pill) ──────────────────────────────────────────
  row.appendChild(mkText(tx.category, {
    name:       'category-label',
    x:          D.PADDING + 8,
    y:          D.TX_ROW_H - D.PILL_H - 4,     // 28
    fontSize:   D.TX_FONT_SMALL,
    fontWeight: '400',
    fills:      [{ fillColor: COLORS.TEXT_SECONDARY, fillOpacity: 1 }],
  }));

  // ── Amount (right-aligned, top) ───────────────────────────────────────────
  row.appendChild(mkText(tx.amount, {
    name:       'amount',
    x:          rowWidth - D.TX_AMOUNT_X_OFFSET,
    y:          16,
    fontSize:   D.TX_FONT,
    fontWeight: '600',
    fills: [{
      fillColor:   isPositive ? COLORS.BUDGET_HEALTHY : COLORS.TEXT_PRIMARY,
      fillOpacity: 1,
    }],
  }));

  // ── Date (right-aligned, bottom) ─────────────────────────────────────────
  row.appendChild(mkText(tx.date, {
    name:       'date',
    x:          rowWidth - D.TX_DATE_X_OFFSET,
    y:          D.TX_ROW_H - D.TX_FONT_SMALL - 8,   // 33
    fontSize:   D.TX_FONT_SMALL,
    fontWeight: '400',
    fills:      [{ fillColor: COLORS.TEXT_MUTED, fillOpacity: 1 }],
  }));

  return row;
}

// ── Public builder ────────────────────────────────────────────────────────────

/**
 * Build the full Piggy Banks layout: sidebar + content board.
 *
 * Returns both boards so setup.js can append each to the already-navigated
 * Piggy Banks page.  The content board is always at x:240 so it sits flush
 * against the right edge of the sidebar.
 *
 * @param {object} penpot  Penpot plugin API (or test mock)
 * @param {object} COLORS  Design-token map from colors.js
 * @returns {{ sidebar: PenpotBoard, content: PenpotBoard }}
 */
export function buildPiggyBanks(penpot, COLORS) {
  const { mkBoard, mkText } = makeHelpers(penpot);
  const D = PIGGYBANKS;

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const sidebar = buildSidebar(penpot, COLORS, 'Piggy Banks');

  // ── Content board ─────────────────────────────────────────────────────────
  const content = mkBoard({
    name:   'Piggy Banks Content',
    x:      D.CONTENT_X,
    y:      0,
    width:  D.CONTENT_W,
    height: D.CONTENT_H,
    fills:  [{ fillColor: COLORS.BG_APP, fillOpacity: 1 }],
  });

  // ── Header title ──────────────────────────────────────────────────────────
  content.appendChild(mkText('Piggy Banks', {
    name:       'header-title',
    x:          D.PADDING,
    y:          D.HEADER_TITLE_Y,
    fontSize:   D.HEADER_TITLE_FONT,
    fontWeight: '700',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  }));

  // ── Date range (right-aligned) ────────────────────────────────────────────
  content.appendChild(mkText('Aug 1 – Aug 10, 2026', {
    name:       'header-date',
    x:          D.CONTENT_W - 200,
    y:          D.HEADER_TITLE_Y + 4,
    fontSize:   D.HEADER_DATE_FONT,
    fontWeight: '400',
    fills:      [{ fillColor: COLORS.TEXT_SECONDARY, fillOpacity: 1 }],
  }));

  // ── Savings goals section title ───────────────────────────────────────────
  content.appendChild(mkText('Savings Goals', {
    name:       'goals-section-title',
    x:          D.PADDING,
    y:          D.GOALS_SECTION_Y,
    fontSize:   D.GOALS_SECTION_FONT,
    fontWeight: '600',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  }));

  // ── Goal cards — horizontal row, y:104 ───────────────────────────────────
  //   3 × 368 + 2 × 16 gap = 1136 total; left edge at x:24 → right edge 1160 ≤ 1200
  const goalStep = D.GOAL_W + D.GAP;   // 384
  SAVINGS_GOALS.forEach((goal, i) => {
    const card = buildGoalCard(penpot, COLORS, goal);
    card.x = D.PADDING + i * goalStep;
    card.y = D.GOALS_Y;
    content.appendChild(card);
  });

  // ── Transaction history section title ─────────────────────────────────────
  content.appendChild(mkText('Transaction History', {
    name:       'history-section-title',
    x:          D.PADDING,
    y:          D.HISTORY_SECTION_Y,
    fontSize:   D.HISTORY_SECTION_FONT,
    fontWeight: '600',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  }));

  // ── Transaction rows — stacked, x:24, starting y:296 ─────────────────────
  //   row width: 1200 − 2×24 = 1152
  //   row stride: TX_ROW_H(52) + TX_GAP(8) = 60
  //   5 rows: y 296, 356, 416, 476, 536  →  bottom edge 588 ≤ 960
  const txRowW  = D.CONTENT_W - D.PADDING * 2;   // 1152
  const txStride = D.TX_ROW_H + D.TX_GAP;         //   60
  PB_TRANSACTIONS.forEach((tx, i) => {
    const row = buildPbTxRow(penpot, COLORS, tx, txRowW, i);
    row.x = D.PADDING;
    row.y = D.TX_Y_START + i * txStride;
    content.appendChild(row);
  });

  return { sidebar, content };
}
