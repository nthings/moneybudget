/**
 * verify-transactions.mjs
 *
 * Offline unit tests for the Transaction Review screen assembler.
 * No live Penpot runtime is required — a minimal mock is injected.
 *
 * Sections:
 *   § 1  Module exports
 *   § 2  Return shape
 *   § 3  Sidebar board
 *   § 4  Content board dimensions
 *   § 5  Content direct children count (18)
 *   § 6  Header elements
 *   § 7  Filter controls (3 × 8 checks)
 *   § 8  Column header row
 *   § 9  Transaction rows — positions and structure (all 12)
 *   § 10 Selected row content — first, fourth (positive), last
 *   § 11 Amount colours — positive vs negative
 *   § 12 TRANSACTIONS_LIST data integrity
 *   § 13 TRANSACTIONS layout constants sanity
 *
 * Run:  node tests/verify-transactions.mjs   (from penpot-plugin/ directory)
 *
 * Exit 0 = all checks passed, Exit 1 = one or more failures.
 */

import {
  buildTransactions,
  TRANSACTIONS,
  FILTER_CONTROLS,
  TRANSACTIONS_LIST,
} from '../src/transactions.js';
import { COLORS } from '../src/colors.js';

// ── Minimal Penpot mock ───────────────────────────────────────────────────────
function makeShape(type) {
  return {
    _type:        type,
    name:         '',
    x:            0,
    y:            0,
    _w:           100,
    _h:           100,
    fills:        [],
    strokes:      [],
    fontWeight:   undefined,
    fontSize:     undefined,
    borderRadius: undefined,
    clipsContent: false,
    _content:     undefined,
    children:     [],
    resize(w, h) { this._w = w; this._h = h; },
    get width()  { return this._w; },
    get height() { return this._h; },
    appendChild(child) { this.children.push(child); },
  };
}

function makeMockPenpot() {
  return {
    createBoard()       { return makeShape('board'); },
    createRectangle()   { return makeShape('rect');  },
    createText(content) {
      const t = makeShape('text');
      t._content = content;
      return t;
    },
  };
}

// ── Test harness ──────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function check(desc, condition) {
  if (condition) {
    console.log(`  \u2705 ${desc}`);
    passed++;
  } else {
    console.error(`  \u274c FAIL: ${desc}`);
    failed++;
  }
}

// ── Build subject ─────────────────────────────────────────────────────────────
const penpot = makeMockPenpot();
const { sidebar, content } = buildTransactions(penpot, COLORS);
const kids = content.children;

// ─────────────────────────────────────────────────────────────────────────────
// § 1  Module exports
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 1  Module exports');
check('buildTransactions is a function',  typeof buildTransactions === 'function');
check('TRANSACTIONS is an object',        typeof TRANSACTIONS      === 'object');
check('FILTER_CONTROLS is an array',      Array.isArray(FILTER_CONTROLS));
check('TRANSACTIONS_LIST is an array',    Array.isArray(TRANSACTIONS_LIST));

// ─────────────────────────────────────────────────────────────────────────────
// § 2  Return shape
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 2  Return shape');
check('returns { sidebar }',   sidebar !== undefined);
check('returns { content }',   content !== undefined);
check('sidebar is a board',    sidebar._type === 'board');
check('content is a board',    content._type === 'board');

// ─────────────────────────────────────────────────────────────────────────────
// § 3  Sidebar board
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 3  Sidebar board');
check('sidebar name = "Sidebar"',                  sidebar.name   === 'Sidebar');
check('sidebar width  = 240',                      sidebar.width  === 240);
check('sidebar height = 960',                      sidebar.height === 960);
// 'Transactions' active → its active-bg highlight rect must exist
const activeKid = sidebar.children.find(c => c.name === 'Transactions-active-bg');
check('"Transactions-active-bg" exists in sidebar', !!activeKid);

// ─────────────────────────────────────────────────────────────────────────────
// § 4  Content board dimensions
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 4  Content board dimensions');
check('content name = "Transactions Content"', content.name   === 'Transactions Content');
check('content x = 240',                       content.x      === TRANSACTIONS.CONTENT_X);
check('content y = 0',                         content.y      === 0);
check('content width  = 1200',                 content.width  === TRANSACTIONS.CONTENT_W);
check('content height = 960',                  content.height === TRANSACTIONS.CONTENT_H);

// ─────────────────────────────────────────────────────────────────────────────
// § 5  Content direct children count
//   header-title(1) + header-date(1) + filter×3 + col-header(1) + tx-rows×12 = 18
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n§ 5  Content children count (got ${kids.length}, expected 18)`);
check('exactly 18 direct children', kids.length === 18);

// ─────────────────────────────────────────────────────────────────────────────
// § 6  Header elements
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 6  Header elements');
const headerTitle = kids.find(c => c.name === 'header-title');
const headerDate  = kids.find(c => c.name === 'header-date');
check('header-title exists',                    !!headerTitle);
check('header-title _content = "Transactions"', headerTitle?._content   === 'Transactions');
check('header-title x = 24',                    headerTitle?.x          === TRANSACTIONS.PADDING);
check('header-title y = 24',                    headerTitle?.y          === TRANSACTIONS.HEADER_TITLE_Y);
check('header-title fontSize = 22',             headerTitle?.fontSize   === TRANSACTIONS.HEADER_TITLE_FONT);
check('header-title fontWeight = "700"',        headerTitle?.fontWeight === '700');
check('header-date exists',                     !!headerDate);
check('header-date x = 1000',                   headerDate?.x           === TRANSACTIONS.CONTENT_W - 200);

// ─────────────────────────────────────────────────────────────────────────────
// § 7  Filter controls (3 controls × 8 checks = 24)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 7  Filter controls');
for (const def of FILTER_CONTROLS) {
  const ctrl = kids.find(c => c.name === def.name);
  check(`${def.name}: board exists`,                  !!ctrl);
  check(`${def.name}: x = ${def.x}`,                 ctrl?.x      === def.x);
  check(`${def.name}: y = ${TRANSACTIONS.FILTER_Y}`, ctrl?.y      === TRANSACTIONS.FILTER_Y);
  check(`${def.name}: width = ${def.width}`,         ctrl?.width  === def.width);
  check(`${def.name}: height = ${TRANSACTIONS.FILTER_H}`, ctrl?.height === TRANSACTIONS.FILTER_H);
  check(`${def.name}: has 2 children`,               ctrl?.children.length === 2);
  const lbl = ctrl?.children.find(c => c.name === 'filter-label');
  check(`${def.name}: filter-label content = "${def.label}"`, lbl?._content === def.label);
  const bg = ctrl?.children.find(c => c.name === 'filter-bg');
  check(`${def.name}: filter-bg exists`,             !!bg);
}

// ─────────────────────────────────────────────────────────────────────────────
// § 8  Column header row
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 8  Column header row');
const ROW_WIDTH = TRANSACTIONS.CONTENT_W - TRANSACTIONS.PADDING * 2;  // 1152
const colHeader = kids.find(c => c.name === 'col-header');
check('col-header board exists',         !!colHeader);
check('col-header x = 24',              colHeader?.x      === TRANSACTIONS.PADDING);
check('col-header y = 136',             colHeader?.y      === TRANSACTIONS.COL_HEADER_Y);
check('col-header width = 1152',        colHeader?.width  === ROW_WIDTH);
check('col-header height = 32',         colHeader?.height === TRANSACTIONS.COL_HEADER_H);
check('col-header has 4 children',      colHeader?.children.length === 4);
const colDate     = colHeader?.children.find(c => c.name === 'col-date');
const colMerchant = colHeader?.children.find(c => c.name === 'col-merchant');
const colCategory = colHeader?.children.find(c => c.name === 'col-category');
const colAmount   = colHeader?.children.find(c => c.name === 'col-amount');
check('col-date label = "DATE"',         colDate?._content     === 'DATE');
check('col-merchant label = "MERCHANT"', colMerchant?._content === 'MERCHANT');
check('col-category label = "CATEGORY"', colCategory?._content === 'CATEGORY');
check('col-amount label = "AMOUNT"',     colAmount?._content   === 'AMOUNT');

// ─────────────────────────────────────────────────────────────────────────────
// § 9  Transaction rows — positions and structure (all 12)
//   stride = TX_ROW_H(52) + TX_GAP(8) = 60
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 9  Transaction rows — positions and structure');
const TX_STRIDE = TRANSACTIONS.TX_ROW_H + TRANSACTIONS.TX_GAP;   // 60

for (let i = 0; i < TRANSACTIONS_LIST.length; i++) {
  const expectedName = `tx-row-${i}`;
  const expectedX    = TRANSACTIONS.PADDING;
  const expectedY    = TRANSACTIONS.TX_Y_START + i * TX_STRIDE;
  const row = kids.find(c => c.name === expectedName);
  check(`${expectedName}: exists`,                  !!row);
  check(`${expectedName}: x = ${expectedX}`,        row?.x               === expectedX);
  check(`${expectedName}: y = ${expectedY}`,        row?.y               === expectedY);
  check(`${expectedName}: has 6 children`,          row?.children.length === 6);
}

// ─────────────────────────────────────────────────────────────────────────────
// § 10  Selected row content — first, fourth (positive), last
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 10  Selected row content');
function checkRowContent(idx) {
  const tx  = TRANSACTIONS_LIST[idx];
  const row = kids.find(c => c.name === `tx-row-${idx}`);
  const merchantNode = row?.children.find(c => c.name === 'merchant');
  const dateNode     = row?.children.find(c => c.name === 'date');
  const amountNode   = row?.children.find(c => c.name === 'amount');
  check(`row ${idx} merchant = "${tx.merchant}"`, merchantNode?._content === tx.merchant);
  check(`row ${idx} date = "${tx.date}"`,         dateNode?._content     === tx.date);
  check(`row ${idx} amount = "${tx.amount}"`,     amountNode?._content   === tx.amount);
}
checkRowContent(0);    // Whole Foods Market — negative
checkRowContent(3);    // Payroll Deposit — positive
checkRowContent(11);   // Trader Joe's — last row, negative

// ─────────────────────────────────────────────────────────────────────────────
// § 11  Amount colours — positive vs negative
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 11  Amount colours');
// Rows 3 and 10 are Payroll Deposit (amount starts with '+')
[3, 10].forEach(idx => {
  const row        = kids.find(c => c.name === `tx-row-${idx}`);
  const amountNode = row?.children.find(c => c.name === 'amount');
  check(
    `row ${idx} (positive): amount fill = BUDGET_HEALTHY`,
    amountNode?.fills[0]?.fillColor === COLORS.BUDGET_HEALTHY,
  );
});
// Rows 0 and 11 are negative expenses
[0, 11].forEach(idx => {
  const row        = kids.find(c => c.name === `tx-row-${idx}`);
  const amountNode = row?.children.find(c => c.name === 'amount');
  check(
    `row ${idx} (negative): amount fill = TEXT_PRIMARY`,
    amountNode?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY,
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// § 12  TRANSACTIONS_LIST data integrity
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 12  TRANSACTIONS_LIST data integrity');
check('TRANSACTIONS_LIST has 12 entries',      TRANSACTIONS_LIST.length === 12);
check('every entry has date field',            TRANSACTIONS_LIST.every(t => typeof t.date     === 'string'));
check('every entry has merchant field',        TRANSACTIONS_LIST.every(t => typeof t.merchant === 'string'));
check('every entry has category field',        TRANSACTIONS_LIST.every(t => typeof t.category === 'string'));
check('every entry has amount field',          TRANSACTIONS_LIST.every(t => typeof t.amount   === 'string'));
check('at least one positive amount',          TRANSACTIONS_LIST.some(t => t.amount.startsWith('+')));

// ─────────────────────────────────────────────────────────────────────────────
// § 13  TRANSACTIONS layout constants sanity
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 13  TRANSACTIONS layout constants');
check('TRANSACTIONS.CONTENT_W  = 1200',  TRANSACTIONS.CONTENT_W   === 1200);
check('TRANSACTIONS.CONTENT_H  = 960',   TRANSACTIONS.CONTENT_H   === 960);
check('TRANSACTIONS.SIDEBAR_W  = 240',   TRANSACTIONS.SIDEBAR_W   === 240);
check('TRANSACTIONS.TX_Y_START = 184',   TRANSACTIONS.TX_Y_START  === 184);
check('TRANSACTIONS.FILTER_Y   = 80',    TRANSACTIONS.FILTER_Y    === 80);
check('TRANSACTIONS.COL_HEADER_Y = 136', TRANSACTIONS.COL_HEADER_Y === 136);
check('FILTER_CONTROLS has 3 entries',   FILTER_CONTROLS.length   === 3);

// ─────────────────────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(56)}`);
const total = passed + failed;
console.log(`${total} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
