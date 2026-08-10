/**
 * Dashboard screen assembler for MoneyBudget Penpot prototype.
 *
 * Exports:
 *   buildDashboard(penpot, COLORS) → { sidebar, content }
 *     sidebar — 240×960 sidebar board with 'Dashboard' active nav item
 *     content — 1200×960 content board (x:240) with header, stat cards,
 *               section title, and five transaction rows
 *   DASHBOARD        — layout constants
 *   STAT_CARDS       — stat card definitions (exported for testing)
 *   RECENT_TRANSACTIONS — transaction sample data (exported for testing)
 *
 * Content board children (11):
 *   header-title    text  (x:24,   y:24)
 *   header-date     text  (x:1000, y:28)
 *   stat-income     board (x:24,   y:96)  — 368×100
 *   stat-spent      board (x:408,  y:96)  — 368×100
 *   stat-remaining  board (x:792,  y:96)  — 368×100
 *   section-title   text  (x:24,   y:232)
 *   tx-row-0        board (x:24,   y:272) — 1152×52
 *   tx-row-1        board (x:24,   y:332) — 1152×52
 *   tx-row-2        board (x:24,   y:392) — 1152×52
 *   tx-row-3        board (x:24,   y:452) — 1152×52
 *   tx-row-4        board (x:24,   y:512) — 1152×52
 *
 * Each stat card children (3):  accent-strip, card-title, card-value
 * Each tx-row children   (6):   row-bg, merchant, category-pill,
 *                                category-label, amount, date
 */
import { makeHelpers } from './helpers.js';
import { buildSidebar } from './sidebar.js';

// ── Layout constants ──────────────────────────────────────────────────────────
export const DASHBOARD = {
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

  // Stat cards
  STAT_Y:          96,
  STAT_W:         368,
  STAT_H:         100,
  STAT_R:           8,   // border-radius
  STAT_GAP:        16,
  STAT_TITLE_FONT: 12,
  STAT_VALUE_FONT: 28,

  // Recent-transactions section title
  SECTION_TITLE_Y:    232,
  SECTION_TITLE_FONT:  16,

  // Transaction rows
  TX_Y_START:         272,
  TX_ROW_H:            52,
  TX_ROW_R:             6,
  TX_GAP:               8,
  TX_FONT:             13,
  TX_FONT_SMALL:       11,
  TX_AMOUNT_X_OFFSET: 120,   // amount text: rowWidth − TX_AMOUNT_X_OFFSET
  TX_DATE_X_OFFSET:    60,   // date text:   rowWidth − TX_DATE_X_OFFSET

  // Category pill badge
  PILL_W: 80,
  PILL_H: 20,
  PILL_R: 10,
};

// ── Sample data ───────────────────────────────────────────────────────────────
/** Stat card definitions (exported so tests can reference them directly). */
export const STAT_CARDS = [
  { name: 'stat-income',    label: 'Total Income', value: '$5,200', colorKey: 'BUDGET_HEALTHY' },
  { name: 'stat-spent',     label: 'Total Spent',  value: '$3,840', colorKey: 'BUDGET_WARNING' },
  { name: 'stat-remaining', label: 'Remaining',    value: '$1,360', colorKey: 'ACCENT_BLUE'    },
];

/** Recent transaction sample rows (exported so tests can reference them directly). */
export const RECENT_TRANSACTIONS = [
  { merchant: 'Whole Foods Market', category: 'Groceries', amount: '-$84.32',  date: 'Aug 9' },
  { merchant: 'Netflix',            category: 'Streaming', amount: '-$15.99',  date: 'Aug 8' },
  { merchant: 'Shell Gas Station',  category: 'Transport', amount: '-$62.50',  date: 'Aug 7' },
  { merchant: 'Payroll Deposit',    category: 'Income',    amount: '+$2,600',  date: 'Aug 5' },
  { merchant: 'Amazon',             category: 'Shopping',  amount: '-$137.80', date: 'Aug 3' },
];

// ── Private helpers ───────────────────────────────────────────────────────────

/**
 * Build a single stat card board (STAT_W × STAT_H).
 *
 * Children (3): accent-strip (rect), card-title (text), card-value (text).
 * The accent-strip is a 4px tall coloured band at the top of the card that
 * uses COLORS[colorKey] to communicate the metric's health state at a glance.
 *
 * @param {object} penpot
 * @param {object} COLORS
 * @param {{ name: string, label: string, value: string, colorKey: string }} def
 * @returns {PenpotBoard}
 */
function buildStatCard(penpot, COLORS, def) {
  const { mkRect, mkBoard, mkText } = makeHelpers(penpot);
  const D = DASHBOARD;

  const card = mkBoard({
    name:   def.name,
    width:  D.STAT_W,
    height: D.STAT_H,
    fills:  [{ fillColor: COLORS.BG_SURFACE, fillOpacity: 1 }],
  });

  // ── Accent strip — 4px coloured top band ─────────────────────────────────
  card.appendChild(mkRect({
    name:         'accent-strip',
    x:            0,
    y:            0,
    width:        D.STAT_W,
    height:       4,
    fills:        [{ fillColor: COLORS[def.colorKey], fillOpacity: 1 }],
    borderRadius: D.STAT_R,
  }));

  // ── Metric label ──────────────────────────────────────────────────────────
  card.appendChild(mkText(def.label, {
    name:       'card-title',
    x:          D.PADDING,
    y:          20,
    fontSize:   D.STAT_TITLE_FONT,
    fontWeight: '400',
    fills:      [{ fillColor: COLORS.TEXT_SECONDARY, fillOpacity: 1 }],
  }));

  // ── Metric value ──────────────────────────────────────────────────────────
  card.appendChild(mkText(def.value, {
    name:       'card-value',
    x:          D.PADDING,
    y:          44,
    fontSize:   D.STAT_VALUE_FONT,
    fontWeight: '700',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  }));

  return card;
}

/**
 * Build a single transaction row board (rowWidth × TX_ROW_H).
 *
 * Children (6): row-bg, merchant, category-pill, category-label, amount, date.
 * Positive amounts (starting with '+') use BUDGET_HEALTHY colour; negatives
 * use TEXT_PRIMARY so income vs spend is visually distinct.
 *
 * @param {object} penpot
 * @param {object} COLORS
 * @param {{ merchant: string, category: string, amount: string, date: string }} tx
 * @param {number} rowWidth  CONTENT_W − PADDING * 2 (= 1152)
 * @param {number} index     Zero-based row index — drives board name (tx-row-N)
 * @returns {PenpotBoard}
 */
function buildTxRow(penpot, COLORS, tx, rowWidth, index) {
  const { mkRect, mkBoard, mkText } = makeHelpers(penpot);
  const D          = DASHBOARD;
  const isPositive = tx.amount.startsWith('+');

  const row = mkBoard({
    name:   `tx-row-${index}`,
    width:  rowWidth,
    height: D.TX_ROW_H,
    fills:  [{ fillColor: COLORS.BG_SURFACE, fillOpacity: 1 }],
  });

  // ── Row background (provides border-radius visual) ────────────────────────
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
 * Build the full Dashboard layout: sidebar + content board.
 *
 * Returns both boards so setup.js can append each to the already-navigated
 * Dashboard page.  The content board is always at x:240 so it sits flush
 * against the right edge of the sidebar (240 px wide).
 *
 * @param {object} penpot  Penpot plugin API (or test mock)
 * @param {object} COLORS  Design-token map from colors.js
 * @returns {{ sidebar: PenpotBoard, content: PenpotBoard }}
 */
export function buildDashboard(penpot, COLORS) {
  const { mkBoard, mkText } = makeHelpers(penpot);
  const D = DASHBOARD;

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const sidebar = buildSidebar(penpot, COLORS, 'Dashboard');

  // ── Content board ─────────────────────────────────────────────────────────
  const content = mkBoard({
    name:   'Dashboard Content',
    x:      D.CONTENT_X,
    y:      0,
    width:  D.CONTENT_W,
    height: D.CONTENT_H,
    fills:  [{ fillColor: COLORS.BG_APP, fillOpacity: 1 }],
  });

  // ── Header title ──────────────────────────────────────────────────────────
  content.appendChild(mkText('Dashboard', {
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

  // ── Stat cards — horizontal row, y:96 ────────────────────────────────────
  //   3 × 368 + 2 × 16 gap = 1136 total; left edge at x:24 → right edge 1160 ≤ 1200
  STAT_CARDS.forEach((def, i) => {
    const card = buildStatCard(penpot, COLORS, def);
    card.x = D.PADDING + i * (D.STAT_W + D.STAT_GAP);
    card.y = D.STAT_Y;
    content.appendChild(card);
  });

  // ── Section title ─────────────────────────────────────────────────────────
  content.appendChild(mkText('Recent Transactions', {
    name:       'section-title',
    x:          D.PADDING,
    y:          D.SECTION_TITLE_Y,
    fontSize:   D.SECTION_TITLE_FONT,
    fontWeight: '600',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  }));

  // ── Transaction rows — stacked, x:24, starting y:272 ─────────────────────
  //   row width: 1200 − 2×24 = 1152
  //   row stride: TX_ROW_H(52) + TX_GAP(8) = 60
  //   5 rows: y 272, 332, 392, 452, 512  →  bottom edge 564 ≤ 960
  const txRowW = D.CONTENT_W - D.PADDING * 2;   // 1152
  RECENT_TRANSACTIONS.forEach((tx, i) => {
    const row = buildTxRow(penpot, COLORS, tx, txRowW, i);
    row.x = D.PADDING;
    row.y = D.TX_Y_START + i * (D.TX_ROW_H + D.TX_GAP);
    content.appendChild(row);
  });

  return { sidebar, content };
}
