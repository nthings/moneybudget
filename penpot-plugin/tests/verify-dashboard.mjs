/**
 * verify-dashboard.mjs
 *
 * Offline unit tests for the Dashboard screen assembler.
 * No live Penpot runtime is required — a minimal mock is injected.
 *
 * Sections:
 *   §1  Content board — structure and dimensions
 *   §2  Content board children count (11)
 *   §3  Header — title text and date range text
 *   §4  Stat cards — count, names, positions, dimensions
 *   §5  Stat card internals — accent-strip colour, card-title, card-value
 *   §6  Section title — "Recent Transactions"
 *   §7  Transaction rows — count, x/y positions, dimensions
 *   §8  Transaction row internals (row 0: Whole Foods Market)
 *   §9  Negative tests — positive vs negative amount colour logic
 *   §10 Sidebar integration — Dashboard active in returned sidebar
 *   §11 DASHBOARD layout constants
 *
 * Run:  node tests/verify-dashboard.mjs   (from penpot-plugin/ directory)
 *
 * Exit 0 = all checks passed, Exit 1 = one or more failures.
 */

import {
  buildDashboard,
  DASHBOARD,
  STAT_CARDS,
  RECENT_TRANSACTIONS,
} from '../src/dashboard.js';
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
    console.log(`  ✅ ${desc}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${desc}`);
    failed++;
  }
}

// ── Build subject ─────────────────────────────────────────────────────────────
const penpot = makeMockPenpot();
const { sidebar, content } = buildDashboard(penpot, COLORS);
const kids = content.children;

// Derived layout constants (reused across sections)
const txRowW  = DASHBOARD.CONTENT_W - DASHBOARD.PADDING * 2;   // 1152
const txStride = DASHBOARD.TX_ROW_H + DASHBOARD.TX_GAP;          //   60

// ─────────────────────────────────────────────────────────────────────────────
// § 1  Content board — structure and dimensions
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 1  Content board — structure and dimensions');
check('name = "Dashboard Content"',   content.name          === 'Dashboard Content');
check('x = 240',                      content.x             === DASHBOARD.CONTENT_X);
check('y = 0',                        content.y             === 0);
check('width  = 1200',                content.width         === DASHBOARD.CONTENT_W);
check('height = 960',                 content.height        === DASHBOARD.CONTENT_H);
check('exactly 1 fill',               content.fills.length  === 1);
check('fill color = BG_APP',          content.fills[0].fillColor   === COLORS.BG_APP);
check('fill opacity = 1',             content.fills[0].fillOpacity === 1);

// ─────────────────────────────────────────────────────────────────────────────
// § 2  Content board children count (11)
//   header-title(1) + header-date(1) + stat-cards(3) +
//   section-title(1) + tx-rows(5) = 11
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n§ 2  Content children count (got ${kids.length}, expected 11)`);
check('exactly 11 children appended', kids.length === 11);

// ─────────────────────────────────────────────────────────────────────────────
// § 3  Header — title text and date range text
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 3  Header');
const headerTitle = kids.find(c => c.name === 'header-title');
const headerDate  = kids.find(c => c.name === 'header-date');

check('header-title exists',                      !!headerTitle);
check('header-title _content = "Dashboard"',      headerTitle?._content   === 'Dashboard');
check('header-title x = 24',                      headerTitle?.x          === DASHBOARD.PADDING);
check('header-title y = 24',                      headerTitle?.y          === DASHBOARD.HEADER_TITLE_Y);
check('header-title fontSize = 22',               headerTitle?.fontSize   === DASHBOARD.HEADER_TITLE_FONT);
check('header-title fontWeight = "700"',          headerTitle?.fontWeight === '700');
check('header-title fill = TEXT_PRIMARY',         headerTitle?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

check('header-date exists',                       !!headerDate);
check('header-date _content contains "Aug"',      headerDate?._content?.includes('Aug'));
check('header-date x = 1000',                     headerDate?.x          === DASHBOARD.CONTENT_W - 200);
check('header-date y = 28',                       headerDate?.y          === DASHBOARD.HEADER_TITLE_Y + 4);
check('header-date fontSize = 13',                headerDate?.fontSize   === DASHBOARD.HEADER_DATE_FONT);
check('header-date fontWeight = "400"',           headerDate?.fontWeight === '400');
check('header-date fill = TEXT_SECONDARY',        headerDate?.fills[0]?.fillColor === COLORS.TEXT_SECONDARY);

// ─────────────────────────────────────────────────────────────────────────────
// § 4  Stat cards — count, names, positions, dimensions
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 4  Stat cards — layout');
const statCardNames = STAT_CARDS.map(d => d.name);   // ['stat-income','stat-spent','stat-remaining']

for (const name of statCardNames) {
  const card = kids.find(c => c.name === name);
  check(`stat card "${name}" exists`,        !!card);
  check(`stat card "${name}" width  = 368`,  card?.width  === DASHBOARD.STAT_W);
  check(`stat card "${name}" height = 100`,  card?.height === DASHBOARD.STAT_H);
  check(`stat card "${name}" y = 96`,        card?.y      === DASHBOARD.STAT_Y);
}

// x positions: 24, 408, 792
const cardStep = DASHBOARD.STAT_W + DASHBOARD.STAT_GAP;   // 384
STAT_CARDS.forEach((def, i) => {
  const card = kids.find(c => c.name === def.name);
  const expectedX = DASHBOARD.PADDING + i * cardStep;
  check(`"${def.name}" x = ${expectedX}`,   card?.x === expectedX);
});

// rightmost card right edge ≤ CONTENT_W
const lastCardX = DASHBOARD.PADDING + 2 * cardStep;  // 792
check('rightmost card fits within content (792 + 368 ≤ 1200)',
  lastCardX + DASHBOARD.STAT_W <= DASHBOARD.CONTENT_W);

// ─────────────────────────────────────────────────────────────────────────────
// § 5  Stat card internals — accent-strip colour, card-title, card-value
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 5  Stat card internals');
for (const def of STAT_CARDS) {
  const card   = kids.find(c => c.name === def.name);
  const strip  = card?.children.find(c => c.name === 'accent-strip');
  const title  = card?.children.find(c => c.name === 'card-title');
  const value  = card?.children.find(c => c.name === 'card-value');

  check(`"${def.name}" has 3 children`,                card?.children.length === 3);
  check(`"${def.name}" accent-strip exists`,            !!strip);
  check(`"${def.name}" accent-strip fill = COLORS.${def.colorKey}`,
    strip?.fills[0]?.fillColor === COLORS[def.colorKey]);
  check(`"${def.name}" accent-strip width = 368`,      strip?.width  === DASHBOARD.STAT_W);
  check(`"${def.name}" accent-strip height = 4`,       strip?.height === 4);
  check(`"${def.name}" accent-strip borderRadius = 8`, strip?.borderRadius === DASHBOARD.STAT_R);
  check(`"${def.name}" card-title _content = "${def.label}"`,
    title?._content === def.label);
  check(`"${def.name}" card-title fontSize = 12`,      title?.fontSize   === DASHBOARD.STAT_TITLE_FONT);
  check(`"${def.name}" card-title fontWeight = "400"`, title?.fontWeight === '400');
  check(`"${def.name}" card-title fill = TEXT_SECONDARY`,
    title?.fills[0]?.fillColor === COLORS.TEXT_SECONDARY);
  check(`"${def.name}" card-value _content = "${def.value}"`,
    value?._content === def.value);
  check(`"${def.name}" card-value fontSize = 28`,      value?.fontSize   === DASHBOARD.STAT_VALUE_FONT);
  check(`"${def.name}" card-value fontWeight = "700"`, value?.fontWeight === '700');
  check(`"${def.name}" card-value fill = TEXT_PRIMARY`,
    value?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);
}

// ─────────────────────────────────────────────────────────────────────────────
// § 6  Section title — "Recent Transactions"
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 6  Section title');
const sectionTitle = kids.find(c => c.name === 'section-title');
check('section-title exists',                     !!sectionTitle);
check('section-title _content = "Recent Transactions"',
  sectionTitle?._content   === 'Recent Transactions');
check('section-title x = 24',                     sectionTitle?.x          === DASHBOARD.PADDING);
check('section-title y = 232',                    sectionTitle?.y          === DASHBOARD.SECTION_TITLE_Y);
check('section-title fontSize = 16',              sectionTitle?.fontSize   === DASHBOARD.SECTION_TITLE_FONT);
check('section-title fontWeight = "600"',         sectionTitle?.fontWeight === '600');
check('section-title fill = TEXT_PRIMARY',        sectionTitle?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

// ─────────────────────────────────────────────────────────────────────────────
// § 7  Transaction rows — count, x/y positions, dimensions
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 7  Transaction rows — layout');
const txRows = [0, 1, 2, 3, 4].map(i => kids.find(c => c.name === `tx-row-${i}`));

check('5 transaction row boards present',      txRows.every(r => !!r));
check('all tx rows have width 1152',           txRows.every(r => r?.width  === txRowW));
check('all tx rows have height 52',            txRows.every(r => r?.height === DASHBOARD.TX_ROW_H));
check('all tx rows have x = 24',              txRows.every(r => r?.x     === DASHBOARD.PADDING));

txRows.forEach((row, i) => {
  const expectedY = DASHBOARD.TX_Y_START + i * txStride;
  check(`tx-row-${i} y = ${expectedY}`,        row?.y === expectedY);
});

// Bottom edge of last row is within content height
const lastRowBottom = DASHBOARD.TX_Y_START + 4 * txStride + DASHBOARD.TX_ROW_H;
check(`last row bottom (${lastRowBottom}) ≤ CONTENT_H (960)`,
  lastRowBottom <= DASHBOARD.CONTENT_H);

// ─────────────────────────────────────────────────────────────────────────────
// § 8  Transaction row internals — row 0 (Whole Foods Market)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 8  Transaction row 0 internals (Whole Foods Market)');
const row0      = kids.find(c => c.name === 'tx-row-0');
const r0Kids    = row0?.children ?? [];
const r0Bg      = r0Kids.find(c => c.name === 'row-bg');
const r0Merch   = r0Kids.find(c => c.name === 'merchant');
const r0Pill    = r0Kids.find(c => c.name === 'category-pill');
const r0CatLbl  = r0Kids.find(c => c.name === 'category-label');
const r0Amount  = r0Kids.find(c => c.name === 'amount');
const r0Date    = r0Kids.find(c => c.name === 'date');

check('tx-row-0 has exactly 6 children',           r0Kids.length === 6);

// row-bg
check('row-bg exists',                             !!r0Bg);
check('row-bg width = 1152',                       r0Bg?.width          === txRowW);
check('row-bg height = 52',                        r0Bg?.height         === DASHBOARD.TX_ROW_H);
check('row-bg borderRadius = 6',                   r0Bg?.borderRadius   === DASHBOARD.TX_ROW_R);
check('row-bg fill = BG_SURFACE',                  r0Bg?.fills[0]?.fillColor === COLORS.BG_SURFACE);

// merchant
check('merchant exists',                           !!r0Merch);
check('merchant _content = "Whole Foods Market"',  r0Merch?._content    === 'Whole Foods Market');
check('merchant x = 24',                           r0Merch?.x           === DASHBOARD.PADDING);
check('merchant y = 16',                           r0Merch?.y           === 16);
check('merchant fontSize = 13',                    r0Merch?.fontSize    === DASHBOARD.TX_FONT);
check('merchant fontWeight = "500"',               r0Merch?.fontWeight  === '500');
check('merchant fill = TEXT_PRIMARY',              r0Merch?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

// category-pill
const pillExpectedY = DASHBOARD.TX_ROW_H - DASHBOARD.PILL_H - 6;  // 26
check('category-pill exists',                      !!r0Pill);
check('category-pill x = 24',                      r0Pill?.x            === DASHBOARD.PADDING);
check(`category-pill y = ${pillExpectedY}`,         r0Pill?.y            === pillExpectedY);
check('category-pill width = 80',                  r0Pill?.width        === DASHBOARD.PILL_W);
check('category-pill height = 20',                 r0Pill?.height       === DASHBOARD.PILL_H);
check('category-pill borderRadius = 10',           r0Pill?.borderRadius === DASHBOARD.PILL_R);
check('category-pill fill = BG_ELEVATED',          r0Pill?.fills[0]?.fillColor === COLORS.BG_ELEVATED);

// category-label
const catLblExpectedY = DASHBOARD.TX_ROW_H - DASHBOARD.PILL_H - 4;  // 28
check('category-label exists',                     !!r0CatLbl);
check('category-label _content = "Groceries"',     r0CatLbl?._content   === 'Groceries');
check('category-label x = 32',                     r0CatLbl?.x          === DASHBOARD.PADDING + 8);
check(`category-label y = ${catLblExpectedY}`,      r0CatLbl?.y          === catLblExpectedY);
check('category-label fontSize = 11',              r0CatLbl?.fontSize   === DASHBOARD.TX_FONT_SMALL);
check('category-label fill = TEXT_SECONDARY',      r0CatLbl?.fills[0]?.fillColor === COLORS.TEXT_SECONDARY);

// amount
const amountExpectedX = txRowW - DASHBOARD.TX_AMOUNT_X_OFFSET;  // 1032
check('amount exists',                             !!r0Amount);
check('amount _content = "-$84.32"',               r0Amount?._content   === '-$84.32');
check(`amount x = ${amountExpectedX}`,              r0Amount?.x          === amountExpectedX);
check('amount y = 16',                             r0Amount?.y          === 16);
check('amount fontSize = 13',                      r0Amount?.fontSize   === DASHBOARD.TX_FONT);
check('amount fontWeight = "600"',                 r0Amount?.fontWeight === '600');
// negative amount → TEXT_PRIMARY
check('negative amount fill = TEXT_PRIMARY',       r0Amount?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

// date
const dateExpectedX = txRowW - DASHBOARD.TX_DATE_X_OFFSET;              // 1092
const dateExpectedY = DASHBOARD.TX_ROW_H - DASHBOARD.TX_FONT_SMALL - 8; // 33
check('date exists',                               !!r0Date);
check('date _content = "Aug 9"',                   r0Date?._content     === 'Aug 9');
check(`date x = ${dateExpectedX}`,                  r0Date?.x            === dateExpectedX);
check(`date y = ${dateExpectedY}`,                  r0Date?.y            === dateExpectedY);
check('date fontSize = 11',                        r0Date?.fontSize     === DASHBOARD.TX_FONT_SMALL);
check('date fill = TEXT_MUTED',                    r0Date?.fills[0]?.fillColor === COLORS.TEXT_MUTED);

// ─────────────────────────────────────────────────────────────────────────────
// § 9  Negative tests — positive vs negative amount colour logic
// ─────────────────────────────────────────────────────────────────────────────
// Row 3 is 'Payroll Deposit' with amount '+$2,600' — must use BUDGET_HEALTHY.
// Rows 0, 1, 2, 4 are negative — must use TEXT_PRIMARY.
// This tests the isPositive branch in buildTxRow.
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 9  Negative tests — amount colour logic');
{
  const row3       = kids.find(c => c.name === 'tx-row-3');
  const r3Amount   = row3?.children.find(c => c.name === 'amount');
  check('row 3 (Payroll Deposit) amount _content = "+$2,600"',
    r3Amount?._content === '+$2,600');
  check('row 3 positive amount fill = BUDGET_HEALTHY',
    r3Amount?.fills[0]?.fillColor === COLORS.BUDGET_HEALTHY);

  const row4       = kids.find(c => c.name === 'tx-row-4');
  const r4Amount   = row4?.children.find(c => c.name === 'amount');
  check('row 4 (Amazon) amount _content = "-$137.80"',
    r4Amount?._content === '-$137.80');
  check('row 4 negative amount fill = TEXT_PRIMARY',
    r4Amount?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

  // Verify the four negative rows all use TEXT_PRIMARY
  const negativeRows = [0, 1, 2, 4].map(i => kids.find(c => c.name === `tx-row-${i}`));
  const allNegUsePrimary = negativeRows.every(row => {
    const amt = row?.children.find(c => c.name === 'amount');
    return amt?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY;
  });
  check('all 4 negative-amount rows use TEXT_PRIMARY colour', allNegUsePrimary);

  // All 5 rows have exactly 6 children
  const allRowCounts = [0, 1, 2, 3, 4].map(i => kids.find(c => c.name === `tx-row-${i}`));
  check('all 5 tx rows have exactly 6 children',
    allRowCounts.every(row => row?.children.length === 6));

  // Merchant name is unique per row (no duplicate board names)
  const rowNames = allRowCounts.map(r => r?.name);
  check('all 5 tx-row names are distinct',
    new Set(rowNames).size === 5);

  // RECENT_TRANSACTIONS data matches what was built
  RECENT_TRANSACTIONS.forEach((tx, i) => {
    const row    = kids.find(c => c.name === `tx-row-${i}`);
    const merch  = row?.children.find(c => c.name === 'merchant');
    check(`tx-row-${i} merchant matches RECENT_TRANSACTIONS[${i}]`,
      merch?._content === tx.merchant);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// § 10  Sidebar integration — buildDashboard returns sidebar with 'Dashboard' active
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 10  Sidebar integration');
check('buildDashboard returns { sidebar, content }', !!sidebar && !!content);
check('sidebar name = "Sidebar"',                    sidebar.name === 'Sidebar');

const sidebarKids = sidebar.children;
const dashActiveBg  = sidebarKids.find(c => c.name === 'Dashboard-active-bg');
const allocActiveBg = sidebarKids.find(c => c.name === 'The Allocator-active-bg');
const dashText      = sidebarKids.find(c => c.name === 'Dashboard');
const allocText     = sidebarKids.find(c => c.name === 'The Allocator');

check('sidebar has "Dashboard" active-bg rect',        !!dashActiveBg);
check('"Dashboard" text fontWeight = "600"',           dashText?.fontWeight === '600');
check('"Dashboard" text fill = TEXT_PRIMARY',          dashText?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);
check('"The Allocator" has no active-bg rect',         allocActiveBg === undefined);
check('"The Allocator" text fontWeight = "400"',       allocText?.fontWeight === '400');
check('"The Allocator" text fill = TEXT_SECONDARY',    allocText?.fills[0]?.fillColor === COLORS.TEXT_SECONDARY);
// Sidebar children: logo + 4 nav-texts + 1 active-bg (Dashboard) + settings = 7
check('sidebar has 7 children',                        sidebarKids.length === 7);

// ─────────────────────────────────────────────────────────────────────────────
// § 11  DASHBOARD layout constants
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 11  DASHBOARD layout constants');
check('DASHBOARD.CONTENT_X = 240',         DASHBOARD.CONTENT_X         === 240);
check('DASHBOARD.CONTENT_W = 1200',        DASHBOARD.CONTENT_W         === 1200);
check('DASHBOARD.CONTENT_H = 960',         DASHBOARD.CONTENT_H         === 960);
check('DASHBOARD.SIDEBAR_W = 240',         DASHBOARD.SIDEBAR_W         === 240);
check('DASHBOARD.PADDING = 24',            DASHBOARD.PADDING           ===  24);
check('DASHBOARD.STAT_W = 368',            DASHBOARD.STAT_W            === 368);
check('DASHBOARD.STAT_H = 100',            DASHBOARD.STAT_H            === 100);
check('DASHBOARD.TX_ROW_H = 52',           DASHBOARD.TX_ROW_H          ===  52);
check('DASHBOARD.TX_AMOUNT_X_OFFSET = 120', DASHBOARD.TX_AMOUNT_X_OFFSET === 120);
check('DASHBOARD.TX_DATE_X_OFFSET = 60',   DASHBOARD.TX_DATE_X_OFFSET  ===  60);
check('DASHBOARD.PILL_W = 80',             DASHBOARD.PILL_W            ===  80);
check('DASHBOARD.PILL_H = 20',             DASHBOARD.PILL_H            ===  20);
check('STAT_CARDS has 3 entries',          STAT_CARDS.length           ===   3);
check('RECENT_TRANSACTIONS has 5 entries', RECENT_TRANSACTIONS.length  ===   5);
// Derived: txRowW = 1200 - 2*24 = 1152
check('derived txRowW = 1152',             txRowW === 1152);

// ─────────────────────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(56)}`);
const total = passed + failed;
console.log(`${total} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
