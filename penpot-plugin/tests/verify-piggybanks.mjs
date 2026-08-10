/**
 * verify-piggybanks.mjs
 *
 * Offline unit tests for the Piggy Banks screen assembler.
 * No live Penpot runtime is required — a minimal mock is injected.
 *
 * Sections:
 *   §1  Content board — structure and dimensions
 *   §2  Content board children count (12)
 *   §3  Header — title text and date range text
 *   §4  Goals section title — "Savings Goals"
 *   §5  Goal cards — layout (x, y, width, height per card)
 *   §6  Goal card internals — goal-vacation (goal-bg, goal-title, goal-pct,
 *                              goal-amount, bar-bg, bar-fill)
 *   §7  History section title — "Transaction History"
 *   §8  Transaction rows — count, x/y positions, dimensions
 *   §9  Transaction row internals (row 0: Transfer to Vacation Fund)
 *   §10 Negative tests — positive vs negative amount colour logic
 *   §11 Sidebar integration — Piggy Banks active in returned sidebar
 *   §12 PIGGYBANKS layout constants and exported data
 *
 * Run:  node tests/verify-piggybanks.mjs   (from penpot-plugin/ directory)
 *
 * Exit 0 = all checks passed, Exit 1 = one or more failures.
 */

import {
  buildPiggyBanks,
  PIGGYBANKS,
  SAVINGS_GOALS,
  PB_TRANSACTIONS,
} from '../src/piggybanks.js';
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
const { sidebar, content } = buildPiggyBanks(penpot, COLORS);
const kids = content.children;

// Derived layout constants (reused across sections)
const txRowW   = PIGGYBANKS.CONTENT_W - PIGGYBANKS.PADDING * 2;   // 1152
const txStride = PIGGYBANKS.TX_ROW_H  + PIGGYBANKS.TX_GAP;         //   60
const goalStep = PIGGYBANKS.GOAL_W    + PIGGYBANKS.GAP;             //  384
const barInnerW = PIGGYBANKS.GOAL_W   - PIGGYBANKS.GOAL_PAD * 2;   //  336

// ─────────────────────────────────────────────────────────────────────────────
// §1  Content board — structure and dimensions
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§1  Content board — structure and dimensions');
check('name = "Piggy Banks Content"',  content.name                  === 'Piggy Banks Content');
check('x = 240',                       content.x                     === PIGGYBANKS.CONTENT_X);
check('y = 0',                         content.y                     === 0);
check('width  = 1200',                 content.width                 === PIGGYBANKS.CONTENT_W);
check('height = 960',                  content.height                === PIGGYBANKS.CONTENT_H);
check('exactly 1 fill',                content.fills.length          === 1);
check('fill color = BG_APP',           content.fills[0].fillColor    === COLORS.BG_APP);
check('fill opacity = 1',              content.fills[0].fillOpacity  === 1);

// ─────────────────────────────────────────────────────────────────────────────
// §2  Content board children count (12)
//   header-title(1) + header-date(1) + goals-section-title(1) +
//   goal-cards(3) + history-section-title(1) + tx-rows(5) = 12
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n§2  Content children count (got ${kids.length}, expected 12)`);
check('exactly 12 children appended', kids.length === 12);

// ─────────────────────────────────────────────────────────────────────────────
// §3  Header — title text and date range text
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§3  Header');
const headerTitle = kids.find(c => c.name === 'header-title');
const headerDate  = kids.find(c => c.name === 'header-date');

check('header-title exists',                     !!headerTitle);
check('header-title _content = "Piggy Banks"',   headerTitle?._content   === 'Piggy Banks');
check('header-title x = 24',                     headerTitle?.x          === PIGGYBANKS.PADDING);
check('header-title y = 24',                     headerTitle?.y          === PIGGYBANKS.HEADER_TITLE_Y);
check('header-title fontSize = 22',              headerTitle?.fontSize   === PIGGYBANKS.HEADER_TITLE_FONT);
check('header-title fontWeight = "700"',         headerTitle?.fontWeight === '700');
check('header-title fill = TEXT_PRIMARY',        headerTitle?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

check('header-date exists',                      !!headerDate);
check('header-date _content contains "Aug"',     headerDate?._content?.includes('Aug'));
check('header-date x = 1000',                    headerDate?.x           === PIGGYBANKS.CONTENT_W - 200);
check('header-date y = 28',                      headerDate?.y           === PIGGYBANKS.HEADER_TITLE_Y + 4);
check('header-date fontSize = 13',               headerDate?.fontSize    === PIGGYBANKS.HEADER_DATE_FONT);
check('header-date fontWeight = "400"',          headerDate?.fontWeight  === '400');
check('header-date fill = TEXT_SECONDARY',       headerDate?.fills[0]?.fillColor === COLORS.TEXT_SECONDARY);

// ─────────────────────────────────────────────────────────────────────────────
// §4  Goals section title — "Savings Goals"
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§4  Goals section title');
const goalsSectionTitle = kids.find(c => c.name === 'goals-section-title');
check('goals-section-title exists',                          !!goalsSectionTitle);
check('goals-section-title _content = "Savings Goals"',     goalsSectionTitle?._content   === 'Savings Goals');
check('goals-section-title x = 24',                         goalsSectionTitle?.x          === PIGGYBANKS.PADDING);
check('goals-section-title y = 72',                         goalsSectionTitle?.y          === PIGGYBANKS.GOALS_SECTION_Y);
check('goals-section-title fontSize = 16',                  goalsSectionTitle?.fontSize   === PIGGYBANKS.GOALS_SECTION_FONT);
check('goals-section-title fontWeight = "600"',             goalsSectionTitle?.fontWeight === '600');
check('goals-section-title fill = TEXT_PRIMARY',            goalsSectionTitle?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

// ─────────────────────────────────────────────────────────────────────────────
// §5  Goal cards — layout (x, y, width, height per card)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§5  Goal cards — layout');
SAVINGS_GOALS.forEach((goal, i) => {
  const card      = kids.find(c => c.name === goal.name);
  const expectedX = PIGGYBANKS.PADDING + i * goalStep;
  check(`"${goal.name}" exists`,                 !!card);
  check(`"${goal.name}" width  = ${PIGGYBANKS.GOAL_W}`,   card?.width  === PIGGYBANKS.GOAL_W);
  check(`"${goal.name}" height = ${PIGGYBANKS.GOAL_H}`,   card?.height === PIGGYBANKS.GOAL_H);
  check(`"${goal.name}" y = ${PIGGYBANKS.GOALS_Y}`,       card?.y      === PIGGYBANKS.GOALS_Y);
  check(`"${goal.name}" x = ${expectedX}`,                card?.x      === expectedX);
});

// Rightmost card right edge must fit within content board
const lastCardX = PIGGYBANKS.PADDING + 2 * goalStep;  // 792
check('rightmost card fits within content (792 + 368 ≤ 1200)',
  lastCardX + PIGGYBANKS.GOAL_W <= PIGGYBANKS.CONTENT_W);

// ─────────────────────────────────────────────────────────────────────────────
// §6  Goal card internals — goal-vacation deep dive
//     pct = Math.round(800/1000*100) = 80
//     fillW = Math.round(80/100 * 336) = 269
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§6  Goal card internals (goal-vacation)');
const vacGoal   = SAVINGS_GOALS[0];  // goal-vacation, ACCENT_BLUE, 800/1000 = 80%
const vacCard   = kids.find(c => c.name === vacGoal.name);
const vacKids   = vacCard?.children ?? [];

const vacPct   = Math.round(vacGoal.current / vacGoal.target * 100);    // 80
const vacFillW = Math.round(vacPct / 100 * barInnerW);                  // 269

check('goal-vacation has 6 children',    vacKids.length === 6);

// goal-bg
const vacBg = vacKids.find(c => c.name === 'goal-bg');
check('goal-bg exists',                  !!vacBg);
check('goal-bg width  = 368',            vacBg?.width        === PIGGYBANKS.GOAL_W);
check('goal-bg height = 120',            vacBg?.height       === PIGGYBANKS.GOAL_H);
check('goal-bg borderRadius = 8',        vacBg?.borderRadius === PIGGYBANKS.GOAL_R);
check('goal-bg fill = BG_SURFACE',       vacBg?.fills[0]?.fillColor === COLORS.BG_SURFACE);

// goal-title
const vacTitle = vacKids.find(c => c.name === 'goal-title');
check('goal-title exists',               !!vacTitle);
check('goal-title _content = "Vacation Fund"', vacTitle?._content   === 'Vacation Fund');
check('goal-title x = 16',              vacTitle?.x          === PIGGYBANKS.GOAL_PAD);
check('goal-title y = 16',              vacTitle?.y          === 16);
check('goal-title fontSize = 14',       vacTitle?.fontSize   === PIGGYBANKS.GOAL_TITLE_FONT);
check('goal-title fontWeight = "600"',  vacTitle?.fontWeight === '600');
check('goal-title fill = TEXT_PRIMARY', vacTitle?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

// goal-pct
const vacPctEl = vacKids.find(c => c.name === 'goal-pct');
check('goal-pct exists',                !!vacPctEl);
check(`goal-pct _content = "${vacPct}%"`,  vacPctEl?._content  === `${vacPct}%`);
check('goal-pct x = GOAL_W − GOAL_PCT_X_OFFSET',
  vacPctEl?.x === PIGGYBANKS.GOAL_W - PIGGYBANKS.GOAL_PCT_X_OFFSET);
check('goal-pct fontSize = 16',         vacPctEl?.fontSize   === PIGGYBANKS.GOAL_PCT_FONT);
check('goal-pct fontWeight = "700"',    vacPctEl?.fontWeight === '700');
check('goal-pct fill = ACCENT_BLUE',    vacPctEl?.fills[0]?.fillColor === COLORS[vacGoal.colorKey]);

// goal-amount
const vacAmount = vacKids.find(c => c.name === 'goal-amount');
const expectedAmountText = `$${vacGoal.current.toLocaleString('en-US')} / $${vacGoal.target.toLocaleString('en-US')}`;
check('goal-amount exists',             !!vacAmount);
check(`goal-amount _content = "${expectedAmountText}"`,
  vacAmount?._content === expectedAmountText);
check('goal-amount x = 16',             vacAmount?.x          === PIGGYBANKS.GOAL_PAD);
check('goal-amount y = 44',             vacAmount?.y          === 44);
check('goal-amount fontSize = 12',      vacAmount?.fontSize   === PIGGYBANKS.GOAL_AMOUNT_FONT);
check('goal-amount fill = TEXT_SECONDARY',
  vacAmount?.fills[0]?.fillColor === COLORS.TEXT_SECONDARY);

// bar-bg
const vacBarBg = vacKids.find(c => c.name === 'bar-bg');
check('bar-bg exists',                  !!vacBarBg);
check('bar-bg x = 16',                  vacBarBg?.x          === PIGGYBANKS.GOAL_PAD);
check('bar-bg y = 88',                  vacBarBg?.y          === PIGGYBANKS.BAR_Y);
check(`bar-bg width = ${barInnerW}`,    vacBarBg?.width      === barInnerW);
check('bar-bg height = 8',              vacBarBg?.height     === PIGGYBANKS.BAR_H);
check('bar-bg borderRadius = 4',        vacBarBg?.borderRadius === PIGGYBANKS.BAR_R);
check('bar-bg fill = BG_ELEVATED',      vacBarBg?.fills[0]?.fillColor === COLORS.BG_ELEVATED);

// bar-fill
const vacBarFill = vacKids.find(c => c.name === 'bar-fill');
check('bar-fill exists',                !!vacBarFill);
check('bar-fill x = 16',               vacBarFill?.x          === PIGGYBANKS.GOAL_PAD);
check('bar-fill y = 88',               vacBarFill?.y          === PIGGYBANKS.BAR_Y);
check(`bar-fill width = ${vacFillW} (80% of ${barInnerW})`,
  vacBarFill?.width === vacFillW);
check('bar-fill height = 8',           vacBarFill?.height     === PIGGYBANKS.BAR_H);
check('bar-fill borderRadius = 4',     vacBarFill?.borderRadius === PIGGYBANKS.BAR_R);
check('bar-fill fill = ACCENT_BLUE',   vacBarFill?.fills[0]?.fillColor === COLORS[vacGoal.colorKey]);

// ─────────────────────────────────────────────────────────────────────────────
// §7  History section title — "Transaction History"
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§7  History section title');
const histTitle = kids.find(c => c.name === 'history-section-title');
check('history-section-title exists',                        !!histTitle);
check('history-section-title _content = "Transaction History"',
  histTitle?._content   === 'Transaction History');
check('history-section-title x = 24',                        histTitle?.x          === PIGGYBANKS.PADDING);
check('history-section-title y = 256',                       histTitle?.y          === PIGGYBANKS.HISTORY_SECTION_Y);
check('history-section-title fontSize = 16',                 histTitle?.fontSize   === PIGGYBANKS.HISTORY_SECTION_FONT);
check('history-section-title fontWeight = "600"',            histTitle?.fontWeight === '600');
check('history-section-title fill = TEXT_PRIMARY',           histTitle?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

// ─────────────────────────────────────────────────────────────────────────────
// §8  Transaction rows — count, x/y positions, dimensions
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§8  Transaction rows — layout');
const txRows = [0, 1, 2, 3, 4].map(i => kids.find(c => c.name === `tx-row-${i}`));

check('5 transaction row boards present',     txRows.every(r => !!r));
check('all tx rows have width 1152',          txRows.every(r => r?.width  === txRowW));
check('all tx rows have height 52',           txRows.every(r => r?.height === PIGGYBANKS.TX_ROW_H));
check('all tx rows have x = 24',             txRows.every(r => r?.x      === PIGGYBANKS.PADDING));

txRows.forEach((row, i) => {
  const expectedY = PIGGYBANKS.TX_Y_START + i * txStride;
  check(`tx-row-${i} y = ${expectedY}`,       row?.y === expectedY);
});

// Bottom edge of last row is within content height
const lastRowBottom = PIGGYBANKS.TX_Y_START + 4 * txStride + PIGGYBANKS.TX_ROW_H;
check(`last row bottom (${lastRowBottom}) ≤ CONTENT_H (960)`,
  lastRowBottom <= PIGGYBANKS.CONTENT_H);

// ─────────────────────────────────────────────────────────────────────────────
// §9  Transaction row internals — row 0 (Transfer to Vacation Fund)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§9  Transaction row 0 internals (Transfer to Vacation Fund)');
const row0     = kids.find(c => c.name === 'tx-row-0');
const r0Kids   = row0?.children ?? [];
const r0Bg     = r0Kids.find(c => c.name === 'row-bg');
const r0Merch  = r0Kids.find(c => c.name === 'merchant');
const r0Pill   = r0Kids.find(c => c.name === 'category-pill');
const r0CatLbl = r0Kids.find(c => c.name === 'category-label');
const r0Amount = r0Kids.find(c => c.name === 'amount');
const r0Date   = r0Kids.find(c => c.name === 'date');

check('tx-row-0 has exactly 6 children',           r0Kids.length === 6);

// row-bg
check('row-bg exists',                             !!r0Bg);
check('row-bg width = 1152',                       r0Bg?.width        === txRowW);
check('row-bg height = 52',                        r0Bg?.height       === PIGGYBANKS.TX_ROW_H);
check('row-bg borderRadius = 6',                   r0Bg?.borderRadius === PIGGYBANKS.TX_ROW_R);
check('row-bg fill = BG_SURFACE',                  r0Bg?.fills[0]?.fillColor === COLORS.BG_SURFACE);

// merchant
check('merchant exists',                           !!r0Merch);
check('merchant _content = "Transfer to Vacation Fund"',
  r0Merch?._content   === 'Transfer to Vacation Fund');
check('merchant x = 24',                           r0Merch?.x          === PIGGYBANKS.PADDING);
check('merchant y = 16',                           r0Merch?.y          === 16);
check('merchant fontSize = 13',                    r0Merch?.fontSize   === PIGGYBANKS.TX_FONT);
check('merchant fontWeight = "500"',               r0Merch?.fontWeight === '500');
check('merchant fill = TEXT_PRIMARY',              r0Merch?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

// category-pill
const pillExpectedY = PIGGYBANKS.TX_ROW_H - PIGGYBANKS.PILL_H - 6;  // 26
check('category-pill exists',                      !!r0Pill);
check('category-pill x = 24',                      r0Pill?.x            === PIGGYBANKS.PADDING);
check(`category-pill y = ${pillExpectedY}`,         r0Pill?.y            === pillExpectedY);
check('category-pill width = 80',                  r0Pill?.width        === PIGGYBANKS.PILL_W);
check('category-pill height = 20',                 r0Pill?.height       === PIGGYBANKS.PILL_H);
check('category-pill borderRadius = 10',           r0Pill?.borderRadius === PIGGYBANKS.PILL_R);
check('category-pill fill = BG_ELEVATED',          r0Pill?.fills[0]?.fillColor === COLORS.BG_ELEVATED);

// category-label
const catLblExpectedY = PIGGYBANKS.TX_ROW_H - PIGGYBANKS.PILL_H - 4;  // 28
check('category-label exists',                     !!r0CatLbl);
check('category-label _content = "Savings"',       r0CatLbl?._content   === 'Savings');
check('category-label x = 32',                     r0CatLbl?.x          === PIGGYBANKS.PADDING + 8);
check(`category-label y = ${catLblExpectedY}`,      r0CatLbl?.y          === catLblExpectedY);
check('category-label fontSize = 11',              r0CatLbl?.fontSize   === PIGGYBANKS.TX_FONT_SMALL);
check('category-label fill = TEXT_SECONDARY',      r0CatLbl?.fills[0]?.fillColor === COLORS.TEXT_SECONDARY);

// amount — positive row: '+$200.00' → BUDGET_HEALTHY
const amountExpectedX = txRowW - PIGGYBANKS.TX_AMOUNT_X_OFFSET;  // 1032
check('amount exists',                             !!r0Amount);
check('amount _content = "+$200.00"',              r0Amount?._content   === '+$200.00');
check(`amount x = ${amountExpectedX}`,              r0Amount?.x          === amountExpectedX);
check('amount y = 16',                             r0Amount?.y          === 16);
check('amount fontSize = 13',                      r0Amount?.fontSize   === PIGGYBANKS.TX_FONT);
check('amount fontWeight = "600"',                 r0Amount?.fontWeight === '600');
check('positive amount fill = BUDGET_HEALTHY',     r0Amount?.fills[0]?.fillColor === COLORS.BUDGET_HEALTHY);

// date
const dateExpectedX = txRowW - PIGGYBANKS.TX_DATE_X_OFFSET;                   // 1092
const dateExpectedY = PIGGYBANKS.TX_ROW_H - PIGGYBANKS.TX_FONT_SMALL - 8;     //   33
check('date exists',                               !!r0Date);
check('date _content = "Aug 9"',                   r0Date?._content     === 'Aug 9');
check(`date x = ${dateExpectedX}`,                  r0Date?.x            === dateExpectedX);
check(`date y = ${dateExpectedY}`,                  r0Date?.y            === dateExpectedY);
check('date fontSize = 11',                        r0Date?.fontSize     === PIGGYBANKS.TX_FONT_SMALL);
check('date fill = TEXT_MUTED',                    r0Date?.fills[0]?.fillColor === COLORS.TEXT_MUTED);

// ─────────────────────────────────────────────────────────────────────────────
// §10 Negative tests — positive vs negative amount colour logic
//     Row 2 (ATM Withdrawal, '-$60.00') must use TEXT_PRIMARY.
//     Rows 0, 1, 3, 4 are positive ('+') must use BUDGET_HEALTHY.
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§10 Negative tests — amount colour logic');
{
  const row2     = kids.find(c => c.name === 'tx-row-2');
  const r2Amount = row2?.children.find(c => c.name === 'amount');
  check('row 2 (ATM Withdrawal) amount _content = "-$60.00"',
    r2Amount?._content === '-$60.00');
  check('row 2 negative amount fill = TEXT_PRIMARY',
    r2Amount?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

  const row4     = kids.find(c => c.name === 'tx-row-4');
  const r4Amount = row4?.children.find(c => c.name === 'amount');
  check('row 4 (Interest Earned) amount _content = "+$3.24"',
    r4Amount?._content === '+$3.24');
  check('row 4 positive amount fill = BUDGET_HEALTHY',
    r4Amount?.fills[0]?.fillColor === COLORS.BUDGET_HEALTHY);

  // All four positive rows use BUDGET_HEALTHY
  const positiveRowIdxs = [0, 1, 3, 4];
  const allPosUseHealthy = positiveRowIdxs.every(i => {
    const row = kids.find(c => c.name === `tx-row-${i}`);
    const amt = row?.children.find(c => c.name === 'amount');
    return amt?.fills[0]?.fillColor === COLORS.BUDGET_HEALTHY;
  });
  check('all 4 positive-amount rows use BUDGET_HEALTHY colour', allPosUseHealthy);

  // All 5 rows have exactly 6 children
  const allRowCounts = [0, 1, 2, 3, 4].map(i => kids.find(c => c.name === `tx-row-${i}`));
  check('all 5 tx rows have exactly 6 children',
    allRowCounts.every(row => row?.children.length === 6));

  // tx-row names are distinct
  const rowNames = allRowCounts.map(r => r?.name);
  check('all 5 tx-row names are distinct', new Set(rowNames).size === 5);

  // Merchant content matches PB_TRANSACTIONS data
  PB_TRANSACTIONS.forEach((tx, i) => {
    const row   = kids.find(c => c.name === `tx-row-${i}`);
    const merch = row?.children.find(c => c.name === 'merchant');
    check(`tx-row-${i} merchant matches PB_TRANSACTIONS[${i}]`,
      merch?._content === tx.merchant);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// §11 Sidebar integration — Piggy Banks active in returned sidebar
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§11 Sidebar integration');
check('buildPiggyBanks returns { sidebar, content }', !!sidebar && !!content);
check('sidebar name = "Sidebar"',                     sidebar.name === 'Sidebar');

const sidebarKids    = sidebar.children;
const pbActiveBg     = sidebarKids.find(c => c.name === 'Piggy Banks-active-bg');
const dashActiveBg   = sidebarKids.find(c => c.name === 'Dashboard-active-bg');
const pbText         = sidebarKids.find(c => c.name === 'Piggy Banks');
const dashText       = sidebarKids.find(c => c.name === 'Dashboard');

check('sidebar has "Piggy Banks" active-bg rect',      !!pbActiveBg);
check('"Piggy Banks" text fontWeight = "600"',         pbText?.fontWeight === '600');
check('"Piggy Banks" text fill = TEXT_PRIMARY',        pbText?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);
check('"Dashboard" has no active-bg rect',             dashActiveBg === undefined);
check('"Dashboard" text fontWeight = "400"',           dashText?.fontWeight === '400');
check('"Dashboard" text fill = TEXT_SECONDARY',        dashText?.fills[0]?.fillColor === COLORS.TEXT_SECONDARY);
// Sidebar: logo + 4 nav-texts + 1 active-bg (Piggy Banks) + settings = 7
check('sidebar has 7 children',                        sidebarKids.length === 7);

// ─────────────────────────────────────────────────────────────────────────────
// §12 PIGGYBANKS layout constants and exported data
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§12 PIGGYBANKS layout constants');
check('PIGGYBANKS.CONTENT_X = 240',           PIGGYBANKS.CONTENT_X         === 240);
check('PIGGYBANKS.CONTENT_W = 1200',          PIGGYBANKS.CONTENT_W         === 1200);
check('PIGGYBANKS.CONTENT_H = 960',           PIGGYBANKS.CONTENT_H         === 960);
check('PIGGYBANKS.GOAL_W = 368',              PIGGYBANKS.GOAL_W            === 368);
check('PIGGYBANKS.GOAL_H = 120',              PIGGYBANKS.GOAL_H            === 120);
check('PIGGYBANKS.GOAL_PAD = 16',             PIGGYBANKS.GOAL_PAD          ===  16);
check('PIGGYBANKS.BAR_Y = 88',                PIGGYBANKS.BAR_Y             ===  88);
check('PIGGYBANKS.BAR_H = 8',                 PIGGYBANKS.BAR_H             ===   8);
check('PIGGYBANKS.TX_ROW_H = 52',             PIGGYBANKS.TX_ROW_H          ===  52);
check('PIGGYBANKS.TX_Y_START = 296',          PIGGYBANKS.TX_Y_START        === 296);
check('PIGGYBANKS.HISTORY_SECTION_Y = 256',   PIGGYBANKS.HISTORY_SECTION_Y === 256);
check('SAVINGS_GOALS.length = 3',             SAVINGS_GOALS.length         ===   3);
check('PB_TRANSACTIONS.length = 5',           PB_TRANSACTIONS.length       ===   5);
// Derived constant cross-checks
check('derived txRowW = 1152',                txRowW    === 1152);
check('derived barInnerW = 336',              barInnerW ===  336);

// ─────────────────────────────────────────────────────────────────────────────
// §12b  Additional goal card cross-checks (goal-emergency and goal-laptop)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§12b  Additional goal cards cross-checks');
// emergency: 3200/5000 = 64%
const emGoal    = SAVINGS_GOALS[1];
const emCard    = kids.find(c => c.name === emGoal.name);
const emPct     = Math.round(emGoal.current / emGoal.target * 100);         // 64
const emFillW   = Math.round(emPct / 100 * barInnerW);                      // 215
const emBarFill = emCard?.children.find(c => c.name === 'bar-fill');
const emPctEl   = emCard?.children.find(c => c.name === 'goal-pct');
check(`goal-emergency goal-pct = "${emPct}%"`,    emPctEl?._content  === `${emPct}%`);
check(`goal-emergency bar-fill width = ${emFillW}`,  emBarFill?.width === emFillW);
check('goal-emergency bar-fill fill = BUDGET_HEALTHY',
  emBarFill?.fills[0]?.fillColor === COLORS[emGoal.colorKey]);

// laptop: 450/1200 = 38% (Math.round(37.5) = 38)
const lapGoal    = SAVINGS_GOALS[2];
const lapCard    = kids.find(c => c.name === lapGoal.name);
const lapPct     = Math.round(lapGoal.current / lapGoal.target * 100);      // 38
const lapFillW   = Math.round(lapPct / 100 * barInnerW);                    // 128
const lapBarFill = lapCard?.children.find(c => c.name === 'bar-fill');
const lapPctEl   = lapCard?.children.find(c => c.name === 'goal-pct');
check(`goal-laptop goal-pct = "${lapPct}%"`,    lapPctEl?._content   === `${lapPct}%`);
check(`goal-laptop bar-fill width = ${lapFillW}`,   lapBarFill?.width === lapFillW);
check('goal-laptop bar-fill fill = ACCENT_PURPLE',
  lapBarFill?.fills[0]?.fillColor === COLORS[lapGoal.colorKey]);

// All 3 goal cards have exactly 6 children
const allGoalCards = SAVINGS_GOALS.map(g => kids.find(c => c.name === g.name));
check('all 3 goal cards have exactly 6 children',
  allGoalCards.every(card => card?.children.length === 6));

// ─────────────────────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(56)}`);
const total = passed + failed;
console.log(`${total} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
