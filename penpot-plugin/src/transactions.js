/**
 * Transaction Review screen assembler for MoneyBudget Penpot prototype.
 *
 * Exports:
 *   buildTransactions(penpot, COLORS) → { sidebar, content }
 *     sidebar  — 240×960 sidebar board with 'Transactions' active nav item
 *     content  — 1200×960 content board (x:240) with header, filter controls,
 *                column header, and twelve transaction rows
 *   TRANSACTIONS      — layout constants
 *   FILTER_CONTROLS   — filter control definitions (exported for testing)
 *   TRANSACTIONS_LIST — full transaction sample data (exported for testing)
 *
 * Content board direct children (18):
 *   header-title      text  (x:24,  y:24)
 *   header-date       text  (x:1000, y:28)
 *   filter-search     board (x:24,  y:80)  — 300×40
 *   filter-category   board (x:336, y:80)  — 140×40
 *   filter-date       board (x:488, y:80)  — 160×40
 *   col-header        board (x:24,  y:136) — 1152×32
 *   tx-row-0          board (x:24,  y:184) — 1152×52
 *   tx-row-1          board (x:24,  y:244) — 1152×52
 *   ...
 *   tx-row-11         board (x:24,  y:844) — 1152×52
 *
 * Each filter board children  (2): filter-bg, filter-label
 * col-header children          (4): col-date, col-merchant, col-category, col-amount
 * Each tx-row children         (6): row-bg, date, merchant, category-pill,
 *                                   category-label, amount
 *
 * Layout arithmetic:
 *   Filter bottom   : FILTER_Y(80)  + FILTER_H(40)          = 120
 *   COL_HEADER_Y    : 120 + GAP(16)                          = 136
 *   Col-header bottom: 136 + COL_HEADER_H(32)               = 168
 *   TX_Y_START      : 168 + GAP(16)                          = 184
 *   Row stride      : TX_ROW_H(52) + TX_GAP(8)              = 60
 *   Row 11 bottom   : 184 + 11×60 + 52                       = 896  ≤ 960 ✓
 */
import { makeHelpers } from './helpers.js';
import { buildSidebar } from './sidebar.js';

// ── Layout constants ──────────────────────────────────────────────────────────
export const TRANSACTIONS = {
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

  // Filter bar (y:80, height:40)
  FILTER_Y:      80,
  FILTER_H:      40,
  FILTER_R:       6,
  FILTER_FONT:   13,
  SEARCH_W:     300,
  FILTER_CAT_W: 140,
  FILTER_DATE_W:160,
  FILTER_GAP:    12,

  // Column header row (y:136, height:32)
  COL_HEADER_Y:    136,
  COL_HEADER_H:     32,
  COL_HEADER_FONT:  11,

  // Column x offsets — used in col-header labels and tx-row children
  COL_DATE_X:       0,
  COL_MERCHANT_X:  136,
  COL_CATEGORY_X:  500,
  COL_AMOUNT_X:    900,

  // Transaction rows
  TX_Y_START:   184,
  TX_ROW_H:      52,
  TX_ROW_R:       6,
  TX_GAP:         8,
  TX_FONT:       13,
  TX_FONT_SMALL: 11,

  // Category pill badge
  PILL_W: 90,
  PILL_H: 20,
  PILL_R: 10,
};

// ── Sample data ───────────────────────────────────────────────────────────────

/**
 * Filter control definitions (exported so tests can reference them directly).
 *
 * x values:
 *   search   : PADDING(24)
 *   category : 24 + SEARCH_W(300) + FILTER_GAP(12)           = 336
 *   date     : 336 + FILTER_CAT_W(140) + FILTER_GAP(12)      = 488
 */
export const FILTER_CONTROLS = [
  {
    name:  'filter-search',
    label: 'Search transactions\u2026',
    width: TRANSACTIONS.SEARCH_W,
    x:     TRANSACTIONS.PADDING,
  },
  {
    name:  'filter-category',
    label: 'All Categories',
    width: TRANSACTIONS.FILTER_CAT_W,
    x:     TRANSACTIONS.PADDING + TRANSACTIONS.SEARCH_W + TRANSACTIONS.FILTER_GAP,
  },
  {
    name:  'filter-date',
    label: 'Aug 2026',
    width: TRANSACTIONS.FILTER_DATE_W,
    x:     TRANSACTIONS.PADDING + TRANSACTIONS.SEARCH_W + TRANSACTIONS.FILTER_GAP +
           TRANSACTIONS.FILTER_CAT_W + TRANSACTIONS.FILTER_GAP,
  },
];

/**
 * Transaction sample data — 12 rows.
 * Rows 3 and 10 (Payroll Deposit) have positive amounts ('+') and will render
 * with BUDGET_HEALTHY colour; all other rows are negative (TEXT_PRIMARY).
 * Exported so tests can reference them directly.
 */
export const TRANSACTIONS_LIST = [
  { date: 'Aug 10', merchant: 'Whole Foods Market', category: 'Groceries', amount: '-$84.32'  },
  { date: 'Aug 9',  merchant: 'Netflix',            category: 'Streaming', amount: '-$15.99'  },
  { date: 'Aug 8',  merchant: 'Shell Gas Station',  category: 'Transport', amount: '-$62.50'  },
  { date: 'Aug 7',  merchant: 'Payroll Deposit',    category: 'Income',    amount: '+$2,600'  },
  { date: 'Aug 6',  merchant: 'Amazon',             category: 'Shopping',  amount: '-$137.80' },
  { date: 'Aug 5',  merchant: 'Starbucks',          category: 'Dining',    amount: '-$12.45'  },
  { date: 'Aug 4',  merchant: 'AT&T',               category: 'Utilities', amount: '-$89.99'  },
  { date: 'Aug 3',  merchant: 'Target',             category: 'Shopping',  amount: '-$54.20'  },
  { date: 'Aug 2',  merchant: 'Uber',               category: 'Transport', amount: '-$18.75'  },
  { date: 'Aug 1',  merchant: 'Spotify',            category: 'Streaming', amount: '-$9.99'   },
  { date: 'Jul 31', merchant: 'Payroll Deposit',    category: 'Income',    amount: '+$2,600'  },
  { date: 'Jul 30', merchant: "Trader Joe's",       category: 'Groceries', amount: '-$71.43'  },
];

// ── Private helpers ───────────────────────────────────────────────────────────

/**
 * Build a filter control board (def.width × FILTER_H).
 *
 * Children (2): filter-bg (rect), filter-label (text).
 *
 * @param {object} penpot
 * @param {object} COLORS
 * @param {{ name: string, label: string, width: number, x: number }} def
 * @returns {PenpotBoard}
 */
function buildFilterControl(penpot, COLORS, def) {
  const { mkRect, mkBoard, mkText } = makeHelpers(penpot);
  const D = TRANSACTIONS;

  const ctrl = mkBoard({
    name:   def.name,
    width:  def.width,
    height: D.FILTER_H,
    fills:  [{ fillColor: COLORS.BG_SURFACE, fillOpacity: 1 }],
  });

  // Input background
  ctrl.appendChild(mkRect({
    name:         'filter-bg',
    x:            0,
    y:            0,
    width:        def.width,
    height:       D.FILTER_H,
    fills:        [{ fillColor: COLORS.BG_ELEVATED, fillOpacity: 1 }],
    borderRadius: D.FILTER_R,
  }));

  // Placeholder / label text
  ctrl.appendChild(mkText(def.label, {
    name:       'filter-label',
    x:          12,
    y:          13,
    fontSize:   D.FILTER_FONT,
    fontWeight: '400',
    fills:      [{ fillColor: COLORS.TEXT_MUTED, fillOpacity: 1 }],
  }));

  return ctrl;
}

/**
 * Build the column header row board (rowWidth × COL_HEADER_H).
 *
 * Children (4): col-date, col-merchant, col-category, col-amount.
 * Text uses COL_HEADER_FONT, fontWeight '600', TEXT_MUTED colour.
 *
 * @param {object} penpot
 * @param {object} COLORS
 * @param {number} rowWidth  CONTENT_W − PADDING * 2 (= 1152)
 * @returns {PenpotBoard}
 */
function buildColHeader(penpot, COLORS, rowWidth) {
  const { mkBoard, mkText } = makeHelpers(penpot);
  const D = TRANSACTIONS;

  const header = mkBoard({
    name:   'col-header',
    width:  rowWidth,
    height: D.COL_HEADER_H,
    fills:  [{ fillColor: COLORS.BG_APP, fillOpacity: 1 }],
  });

  const cols = [
    { name: 'col-date',     label: 'DATE',     x: D.COL_DATE_X     },
    { name: 'col-merchant', label: 'MERCHANT', x: D.COL_MERCHANT_X },
    { name: 'col-category', label: 'CATEGORY', x: D.COL_CATEGORY_X },
    { name: 'col-amount',   label: 'AMOUNT',   x: D.COL_AMOUNT_X   },
  ];

  cols.forEach(col => {
    header.appendChild(mkText(col.label, {
      name:       col.name,
      x:          col.x,
      y:          10,
      fontSize:   D.COL_HEADER_FONT,
      fontWeight: '600',
      fills:      [{ fillColor: COLORS.TEXT_MUTED, fillOpacity: 1 }],
    }));
  });

  return header;
}

/**
 * Build a single transaction row board (rowWidth × TX_ROW_H).
 *
 * Children (6): row-bg, date, merchant, category-pill, category-label, amount.
 * Positive amounts ('+') render with BUDGET_HEALTHY; negatives with TEXT_PRIMARY.
 *
 * @param {object} penpot
 * @param {object} COLORS
 * @param {{ date: string, merchant: string, category: string, amount: string }} tx
 * @param {number} rowWidth  CONTENT_W − PADDING * 2 (= 1152)
 * @param {number} index     Zero-based row index — drives board name (tx-row-N)
 * @returns {PenpotBoard}
 */
function buildTxRow(penpot, COLORS, tx, rowWidth, index) {
  const { mkRect, mkBoard, mkText } = makeHelpers(penpot);
  const D          = TRANSACTIONS;
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

  // ── Date (left column) ────────────────────────────────────────────────────
  row.appendChild(mkText(tx.date, {
    name:       'date',
    x:          D.COL_DATE_X,
    y:          19,
    fontSize:   D.TX_FONT_SMALL,
    fontWeight: '400',
    fills:      [{ fillColor: COLORS.TEXT_SECONDARY, fillOpacity: 1 }],
  }));

  // ── Merchant name (second column) ─────────────────────────────────────────
  row.appendChild(mkText(tx.merchant, {
    name:       'merchant',
    x:          D.COL_MERCHANT_X,
    y:          16,
    fontSize:   D.TX_FONT,
    fontWeight: '500',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  }));

  // ── Category pill background ──────────────────────────────────────────────
  row.appendChild(mkRect({
    name:         'category-pill',
    x:            D.COL_CATEGORY_X,
    y:            D.TX_ROW_H - D.PILL_H - 6,   // 26
    width:        D.PILL_W,
    height:       D.PILL_H,
    fills:        [{ fillColor: COLORS.BG_ELEVATED, fillOpacity: 1 }],
    borderRadius: D.PILL_R,
  }));

  // ── Category label (inside pill) ──────────────────────────────────────────
  row.appendChild(mkText(tx.category, {
    name:       'category-label',
    x:          D.COL_CATEGORY_X + 8,
    y:          D.TX_ROW_H - D.PILL_H - 4,     // 28
    fontSize:   D.TX_FONT_SMALL,
    fontWeight: '400',
    fills:      [{ fillColor: COLORS.TEXT_SECONDARY, fillOpacity: 1 }],
  }));

  // ── Amount (rightmost column) ─────────────────────────────────────────────
  row.appendChild(mkText(tx.amount, {
    name:       'amount',
    x:          D.COL_AMOUNT_X,
    y:          16,
    fontSize:   D.TX_FONT,
    fontWeight: '600',
    fills: [{
      fillColor:   isPositive ? COLORS.BUDGET_HEALTHY : COLORS.TEXT_PRIMARY,
      fillOpacity: 1,
    }],
  }));

  return row;
}

// ── Public builder ────────────────────────────────────────────────────────────

/**
 * Build the full Transaction Review layout: sidebar + content board.
 *
 * Returns both boards so setup.js can append each to the already-navigated
 * Transactions page.  The content board is always at x:240 so it sits flush
 * against the right edge of the sidebar (240 px wide).
 *
 * Content board direct children (18):
 *   header-title, header-date, filter-search, filter-category, filter-date,
 *   col-header, tx-row-0 … tx-row-11
 *
 * @param {object} penpot  Penpot plugin API (or test mock)
 * @param {object} COLORS  Design-token map from colors.js
 * @returns {{ sidebar: PenpotBoard, content: PenpotBoard }}
 */
export function buildTransactions(penpot, COLORS) {
  const { mkBoard, mkText } = makeHelpers(penpot);
  const D = TRANSACTIONS;

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const sidebar = buildSidebar(penpot, COLORS, 'Transactions');

  // ── Content board ─────────────────────────────────────────────────────────
  const content = mkBoard({
    name:   'Transactions Content',
    x:      D.CONTENT_X,
    y:      0,
    width:  D.CONTENT_W,
    height: D.CONTENT_H,
    fills:  [{ fillColor: COLORS.BG_APP, fillOpacity: 1 }],
  });

  // ── Header title ──────────────────────────────────────────────────────────
  content.appendChild(mkText('Transactions', {
    name:       'header-title',
    x:          D.PADDING,
    y:          D.HEADER_TITLE_Y,
    fontSize:   D.HEADER_TITLE_FONT,
    fontWeight: '700',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  }));

  // ── Date range (right-aligned) ────────────────────────────────────────────
  content.appendChild(mkText('Aug 1 \u2013 Aug 10, 2026', {
    name:       'header-date',
    x:          D.CONTENT_W - 200,
    y:          D.HEADER_TITLE_Y + 4,
    fontSize:   D.HEADER_DATE_FONT,
    fontWeight: '400',
    fills:      [{ fillColor: COLORS.TEXT_SECONDARY, fillOpacity: 1 }],
  }));

  // ── Filter controls — y:80, stacked horizontally ──────────────────────────
  FILTER_CONTROLS.forEach(def => {
    const ctrl = buildFilterControl(penpot, COLORS, def);
    ctrl.x = def.x;
    ctrl.y = D.FILTER_Y;
    content.appendChild(ctrl);
  });

  // ── Column header — y:136, width: CONTENT_W − PADDING * 2 = 1152 ─────────
  const rowWidth = D.CONTENT_W - D.PADDING * 2;   // 1152
  const colHeader = buildColHeader(penpot, COLORS, rowWidth);
  colHeader.x = D.PADDING;
  colHeader.y = D.COL_HEADER_Y;
  content.appendChild(colHeader);

  // ── Transaction rows — y:184, stride 60 px (52 row + 8 gap) ──────────────
  //   12 rows → last bottom edge: 184 + 11×60 + 52 = 896 ≤ 960 ✓
  TRANSACTIONS_LIST.forEach((tx, i) => {
    const row = buildTxRow(penpot, COLORS, tx, rowWidth, i);
    row.x = D.PADDING;
    row.y = D.TX_Y_START + i * (D.TX_ROW_H + D.TX_GAP);
    content.appendChild(row);
  });

  return { sidebar, content };
}
