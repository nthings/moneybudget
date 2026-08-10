/**
 * verify-allocator.mjs
 *
 * Offline unit tests for the ZBB counter widget and tier group card builder.
 * No live Penpot runtime is required — a minimal mock is injected.
 *
 * Sections:
 *   §1  ZBB counter board  — structure, dimensions, fill, 4 children
 *   §2  ZBB counter states — all three colour states verified
 *   §3  Tier group board   — title, items, subtotal structure
 *   §4  Negative tests     — unknown state throws; empty-items edge case
 *   §5  Exported constants — ZBB_COUNTER and TIER_GROUP sanity
 *   §6  Allocator assembly — desktop (1200×960) and mobile (390×844) frames
 *   §7  Setup integration  — runSetup() returns desktopAllocator + mobileAllocator
 *
 * Run:  node tests/verify-allocator.mjs   (from penpot-plugin/ directory)
 *
 * Exit 0 = all checks passed, Exit 1 = one or more failures.
 */

import { buildZbbCounter, ZBB_COUNTER } from '../src/zbb-counter.js';
import { buildTierGroup,  TIER_GROUP   } from '../src/allocator-tiers.js';
import { buildDesktopAllocator, buildMobileAllocator, ALLOCATOR } from '../src/allocator.js';
import { runSetup } from '../src/setup.js';
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

// ─────────────────────────────────────────────────────────────────────────────
// § 1  ZBB Counter board — structure and dimensions (healthy state)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 1  ZBB Counter board (healthy)');

const penpot   = makeMockPenpot();
const healthy  = buildZbbCounter(penpot, COLORS, 'healthy');
const hKids    = healthy.children;

check('name = "ZBB Counter - Healthy"',  healthy.name          === 'ZBB Counter - Healthy');
check('width  = 360',                    healthy.width         === ZBB_COUNTER.WIDTH);
check('height = 80',                     healthy.height        === ZBB_COUNTER.HEIGHT);
check('exactly 1 fill',                  healthy.fills.length  === 1);
check('fill = BG_ELEVATED',              healthy.fills[0].fillColor   === COLORS.BG_ELEVATED);
check('fill opacity = 1',                healthy.fills[0].fillOpacity === 1);
check('exactly 4 children',             hKids.length          === 4);

// state-bar
const hBar = hKids.find(c => c.name === 'state-bar');
check('state-bar child exists',          !!hBar);
check('state-bar x = 0',                 hBar?.x          === 0);
check('state-bar y = 0',                 hBar?.y          === 0);
check('state-bar width = 4',             hBar?.width      === ZBB_COUNTER.STATE_BAR_W);
check('state-bar height = 80',           hBar?.height     === ZBB_COUNTER.HEIGHT);
check('state-bar fill = BUDGET_HEALTHY', hBar?.fills[0]?.fillColor   === COLORS.BUDGET_HEALTHY);
check('state-bar fill opacity = 1',      hBar?.fills[0]?.fillOpacity === 1);

// label
const hLabel = hKids.find(c => c.name === 'label');
check('label child exists',              !!hLabel);
check('label _content = "ZBB Balance"',  hLabel?._content   === 'ZBB Balance');
check('label x = 16',                    hLabel?.x          === ZBB_COUNTER.LABEL_X);
check('label y = 12',                    hLabel?.y          === ZBB_COUNTER.LABEL_Y);
check('label fontSize = 11',             hLabel?.fontSize   === ZBB_COUNTER.LABEL_FONT_SIZE);
check('label fontWeight = "400"',        hLabel?.fontWeight === '400');
check('label fill = TEXT_SECONDARY',     hLabel?.fills[0]?.fillColor === COLORS.TEXT_SECONDARY);

// amount
const hAmount = hKids.find(c => c.name === 'amount');
check('amount child exists',             !!hAmount);
check('amount _content = "$1,250.00"',   hAmount?._content  === '$1,250.00');
check('amount fontSize = 20',            hAmount?.fontSize  === ZBB_COUNTER.AMOUNT_FONT_SIZE);
check('amount fontWeight = "700"',       hAmount?.fontWeight === '700');
check('amount fill = TEXT_PRIMARY',      hAmount?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

// state-label
const hStateLabel = hKids.find(c => c.name === 'state-label');
check('state-label child exists',           !!hStateLabel);
check('state-label _content = "Healthy"',   hStateLabel?._content    === 'Healthy');
check('state-label fontSize = 11',          hStateLabel?.fontSize    === ZBB_COUNTER.STATE_LABEL_FONT_SIZE);
check('state-label fontWeight = "500"',     hStateLabel?.fontWeight  === '500');
check('state-label fill = BUDGET_HEALTHY',  hStateLabel?.fills[0]?.fillColor === COLORS.BUDGET_HEALTHY);

// ─────────────────────────────────────────────────────────────────────────────
// § 2  ZBB Counter — all three colour states
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 2  ZBB Counter — all three states');

const warning   = buildZbbCounter(penpot, COLORS, 'warning');
const overspent = buildZbbCounter(penpot, COLORS, 'overspent');

// warning state
const wBar        = warning.children.find(c => c.name === 'state-bar');
const wStateLabel = warning.children.find(c => c.name === 'state-label');
const wAmount     = warning.children.find(c => c.name === 'amount');

check('warning: name = "ZBB Counter - Warning"',           warning.name === 'ZBB Counter - Warning');
check('warning: state-bar fill = BUDGET_WARNING',          wBar?.fills[0]?.fillColor   === COLORS.BUDGET_WARNING);
check('warning: state-label _content = "Warning"',         wStateLabel?._content       === 'Warning');
check('warning: state-label fill = BUDGET_WARNING',        wStateLabel?.fills[0]?.fillColor === COLORS.BUDGET_WARNING);
check('warning: amount _content = "$42.00"',               wAmount?._content           === '$42.00');
check('warning: exactly 4 children',                       warning.children.length     === 4);

// overspent state
const oBar        = overspent.children.find(c => c.name === 'state-bar');
const oStateLabel = overspent.children.find(c => c.name === 'state-label');
const oAmount     = overspent.children.find(c => c.name === 'amount');

check('overspent: name = "ZBB Counter - Overspent"',       overspent.name === 'ZBB Counter - Overspent');
check('overspent: state-bar fill = BUDGET_OVERSPENT',      oBar?.fills[0]?.fillColor      === COLORS.BUDGET_OVERSPENT);
check('overspent: state-label _content = "Overspent"',     oStateLabel?._content          === 'Overspent');
check('overspent: state-label fill = BUDGET_OVERSPENT',    oStateLabel?.fills[0]?.fillColor === COLORS.BUDGET_OVERSPENT);
check('overspent: amount _content = "-$215.00"',           oAmount?._content              === '-$215.00');
check('overspent: exactly 4 children',                     overspent.children.length      === 4);

// all three board names are distinct
const counterNames = [healthy.name, warning.name, overspent.name];
check('all three counter names are distinct',
  new Set(counterNames).size === 3);

// state-bar colours match token values
check('healthy  state-bar colour = #4CAF50',  hBar?.fills[0]?.fillColor === '#4CAF50');
check('warning  state-bar colour = #FFC107',  wBar?.fills[0]?.fillColor === '#FFC107');
check('overspent state-bar colour = #F44336', oBar?.fills[0]?.fillColor === '#F44336');

// ─────────────────────────────────────────────────────────────────────────────
// § 3  Tier Group board — structure (2 items → 8 children)
// ─────────────────────────────────────────────────────────────────────────────
// Children layout for N items: 2N + 4
//   header-bg(1) + title(1) + item-label×N + item-amount×N + divider(1) + subtotal(1)
// For N=2: 8 children
console.log('\n§ 3  Tier Group board (2 items)');

const tier2 = buildTierGroup(penpot, COLORS, {
  title: 'Essential Needs',
  items: [
    { label: 'Rent',      amount: '$1,500.00' },
    { label: 'Groceries', amount: '$400.00'   },
  ],
});
const t2Kids = tier2.children;

check('name = "Tier: Essential Needs"',    tier2.name           === 'Tier: Essential Needs');
check('width = 1152',                       tier2.width          === TIER_GROUP.WIDTH);
check('fill = BG_SURFACE',                  tier2.fills[0]?.fillColor   === COLORS.BG_SURFACE);
check('fill opacity = 1',                   tier2.fills[0]?.fillOpacity === 1);
check('exactly 8 children for 2 items',    t2Kids.length        === 8);

// header-bg
const t2Header = t2Kids.find(c => c.name === 'header-bg');
check('header-bg exists',                  !!t2Header);
check('header-bg width = 1152',            t2Header?.width   === TIER_GROUP.WIDTH);
check('header-bg height = 40',             t2Header?.height  === TIER_GROUP.HEADER_H);
check('header-bg x = 0',                   t2Header?.x       === 0);
check('header-bg y = 0',                   t2Header?.y       === 0);
check('header-bg fill = BG_ELEVATED',      t2Header?.fills[0]?.fillColor === COLORS.BG_ELEVATED);

// title text
const t2Title = t2Kids.find(c => c.name === 'title');
check('title child exists',                !!t2Title);
check('title _content = "Essential Needs"', t2Title?._content    === 'Essential Needs');
check('title fontSize = 14',               t2Title?.fontSize    === TIER_GROUP.TITLE_FONT_SIZE);
check('title fontWeight = "600"',          t2Title?.fontWeight  === '600');
check('title fill = TEXT_PRIMARY',         t2Title?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

// item 0
const t2Label0  = t2Kids.find(c => c.name === 'item-label-0');
const t2Amount0 = t2Kids.find(c => c.name === 'item-amount-0');
check('item-label-0 exists',               !!t2Label0);
check('item-label-0 _content = "Rent"',    t2Label0?._content    === 'Rent');
check('item-label-0 fontSize = 13',        t2Label0?.fontSize    === TIER_GROUP.ITEM_FONT_SIZE);
check('item-label-0 fill = TEXT_SECONDARY', t2Label0?.fills[0]?.fillColor === COLORS.TEXT_SECONDARY);
check('item-amount-0 exists',              !!t2Amount0);
check('item-amount-0 _content = "$1,500.00"', t2Amount0?._content === '$1,500.00');
check('item-amount-0 fill = TEXT_PRIMARY', t2Amount0?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

// item 1
const t2Label1  = t2Kids.find(c => c.name === 'item-label-1');
const t2Amount1 = t2Kids.find(c => c.name === 'item-amount-1');
check('item-label-1 exists',               !!t2Label1);
check('item-label-1 _content = "Groceries"', t2Label1?._content  === 'Groceries');
check('item-amount-1 exists',              !!t2Amount1);
check('item-amount-1 _content = "$400.00"',  t2Amount1?._content === '$400.00');

// divider
const t2Divider = t2Kids.find(c => c.name === 'divider');
check('divider exists',                    !!t2Divider);
check('divider height = 1',               t2Divider?.height === TIER_GROUP.DIVIDER_H);
check('divider fill = BORDER_SUBTLE',     t2Divider?.fills[0]?.fillColor === COLORS.BORDER_SUBTLE);

// subtotal
const t2Subtotal = t2Kids.find(c => c.name === 'subtotal');
check('subtotal child exists',             !!t2Subtotal);
check('subtotal _content = "Subtotal"',    t2Subtotal?._content   === 'Subtotal');
check('subtotal fontSize = 13',            t2Subtotal?.fontSize   === TIER_GROUP.SUBTOTAL_FONT_SIZE);
check('subtotal fontWeight = "600"',       t2Subtotal?.fontWeight === '600');
check('subtotal fill = TEXT_PRIMARY',      t2Subtotal?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

// dynamic height: 40 + 2*36 + 36 + 8 = 156
const expectedH2 = TIER_GROUP.HEADER_H + 2 * TIER_GROUP.ROW_H + TIER_GROUP.ROW_H + TIER_GROUP.PADDING_Y;
check(`board height = ${expectedH2} for 2 items`, tier2.height === expectedH2);

// tier with 3 items → 2*3+4 = 10 children
const tier3 = buildTierGroup(penpot, COLORS, {
  title: 'Lifestyle',
  items: [
    { label: 'Dining Out',    amount: '$150.00' },
    { label: 'Entertainment', amount: '$80.00'  },
    { label: 'Subscriptions', amount: '$45.00'  },
  ],
});
check('3-item tier has 10 children',       tier3.children.length === 10);
check('3-item tier item-label-2 exists',
  !!tier3.children.find(c => c.name === 'item-label-2'));
check('3-item tier item-label-2 _content = "Subscriptions"',
  tier3.children.find(c => c.name === 'item-label-2')?._content === 'Subscriptions');

// ─────────────────────────────────────────────────────────────────────────────
// § 4  Negative tests
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 4  Negative tests');

// Unknown state must throw
let threwOnBadState = false;
try {
  buildZbbCounter(penpot, COLORS, 'invalid-state');
} catch (e) {
  threwOnBadState = e instanceof Error && e.message.includes('unknown state');
}
check('buildZbbCounter("invalid-state") throws with "unknown state"', threwOnBadState);

// Empty-items tier group — should produce 4 children (2*0+4)
const tierEmpty = buildTierGroup(penpot, COLORS, { title: 'Empty', items: [] });
check('empty-items tier has 4 children',      tierEmpty.children.length === 4);
check('empty-items tier has title child',      !!tierEmpty.children.find(c => c.name === 'title'));
check('empty-items tier has subtotal child',   !!tierEmpty.children.find(c => c.name === 'subtotal'));
check('empty-items tier has header-bg child',  !!tierEmpty.children.find(c => c.name === 'header-bg'));
check('empty-items tier has divider child',    !!tierEmpty.children.find(c => c.name === 'divider'));

// ─────────────────────────────────────────────────────────────────────────────
// § 5  Exported constants sanity
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 5  Exported constants');
check('ZBB_COUNTER.WIDTH  = 360',    ZBB_COUNTER.WIDTH         === 360);
check('ZBB_COUNTER.HEIGHT = 80',     ZBB_COUNTER.HEIGHT        ===  80);
check('ZBB_COUNTER.STATE_BAR_W = 4', ZBB_COUNTER.STATE_BAR_W  ===   4);
check('TIER_GROUP.WIDTH = 1152',     TIER_GROUP.WIDTH          === 1152);
check('TIER_GROUP.HEADER_H = 40',    TIER_GROUP.HEADER_H       ===  40);
check('TIER_GROUP.ROW_H = 36',       TIER_GROUP.ROW_H          ===  36);

// ─────────────────────────────────────────────────────────────────────────────
// § 6  Allocator assembly — desktop (1200×960) and mobile (390×844)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 6a  Desktop allocator (1200×960 at x:240)');

const desktop = buildDesktopAllocator(makeMockPenpot(), COLORS);
const dKids   = desktop.children;

check('desktop name = "Allocator Desktop"',  desktop.name          === 'Allocator Desktop');
check('desktop x    = 240',                   desktop.x             === ALLOCATOR.DESKTOP_X);
check('desktop y    = 0',                     desktop.y             === 0);
check('desktop width  = 1200',                desktop.width         === ALLOCATOR.DESKTOP_W);
check('desktop height = 960',                 desktop.height        === ALLOCATOR.DESKTOP_H);
check('desktop fill   = BG_APP',              desktop.fills[0]?.fillColor   === COLORS.BG_APP);
check('desktop fill opacity = 1',             desktop.fills[0]?.fillOpacity === 1);
check('desktop exactly 7 children',           dKids.length          === 7);

// ZBB counter children
const dHealthy   = dKids.find(c => c.name === 'ZBB Counter - Healthy');
const dWarning   = dKids.find(c => c.name === 'ZBB Counter - Warning');
const dOverspent = dKids.find(c => c.name === 'ZBB Counter - Overspent');
check('desktop: ZBB Counter - Healthy child exists',    !!dHealthy);
check('desktop: ZBB Counter - Warning child exists',    !!dWarning);
check('desktop: ZBB Counter - Overspent child exists',  !!dOverspent);

// Tier group children
const dTierEss  = dKids.find(c => c.name === 'Tier: Essential Needs');
const dTierFin  = dKids.find(c => c.name === 'Tier: Financial Goals');
const dTierLife = dKids.find(c => c.name === 'Tier: Lifestyle');
check('desktop: Tier: Essential Needs child exists',  !!dTierEss);
check('desktop: Tier: Financial Goals child exists',  !!dTierFin);
check('desktop: Tier: Lifestyle child exists',        !!dTierLife);

// Lock CTA
const dLockCta = dKids.find(c => c.name === 'lock-cta');
check('desktop: lock-cta child exists',               !!dLockCta);
check('desktop: lock-cta fill = ACCENT_BLUE',         dLockCta?.fills[0]?.fillColor   === COLORS.ACCENT_BLUE);
check('desktop: lock-cta fill opacity = 1',           dLockCta?.fills[0]?.fillOpacity === 1);
check('desktop: lock-cta borderRadius = 8',           dLockCta?.borderRadius          === ALLOCATOR.LOCK_CTA_R);

// Counter positions
const counterStep = ZBB_COUNTER.WIDTH + ALLOCATOR.GAP;   // 376
check('desktop: healthy counter x = 24',   dHealthy?.x   === ALLOCATOR.PADDING);
check('desktop: warning counter x = 400',  dWarning?.x   === ALLOCATOR.PADDING + counterStep);
check('desktop: overspent counter x = 776', dOverspent?.x === ALLOCATOR.PADDING + 2 * counterStep);
check('desktop: counters y = 24',           dHealthy?.y   === ALLOCATOR.PADDING);

// Tier x positions
check('desktop: Essential Needs x = 24',   dTierEss?.x  === ALLOCATOR.PADDING);
check('desktop: Financial Goals x = 24',   dTierFin?.x  === ALLOCATOR.PADDING);
check('desktop: Lifestyle x = 24',         dTierLife?.x === ALLOCATOR.PADDING);

console.log('\n§ 6b  Mobile allocator (390×844 at x:1500)');

const mobile = buildMobileAllocator(makeMockPenpot(), COLORS);
const mKids  = mobile.children;

check('mobile name = "Allocator Mobile"',  mobile.name          === 'Allocator Mobile');
check('mobile x    = 1500',                mobile.x             === ALLOCATOR.MOBILE_X);
check('mobile y    = 0',                   mobile.y             === 0);
check('mobile width  = 390',               mobile.width         === ALLOCATOR.MOBILE_W);
check('mobile height = 844',               mobile.height        === ALLOCATOR.MOBILE_H);
check('mobile fill   = BG_APP',            mobile.fills[0]?.fillColor   === COLORS.BG_APP);
check('mobile fill opacity = 1',           mobile.fills[0]?.fillOpacity === 1);
check('mobile exactly 6 children',         mKids.length         === 6);

// ZBB counter children
const mHealthy   = mKids.find(c => c.name === 'ZBB Counter - Healthy');
const mWarning   = mKids.find(c => c.name === 'ZBB Counter - Warning');
const mOverspent = mKids.find(c => c.name === 'ZBB Counter - Overspent');
check('mobile: ZBB Counter - Healthy child exists',    !!mHealthy);
check('mobile: ZBB Counter - Warning child exists',    !!mWarning);
check('mobile: ZBB Counter - Overspent child exists',  !!mOverspent);

// Mobile tier children
const mTierEss = mKids.find(c => c.name === 'Mobile Tier: Essential Needs');
const mTierFin = mKids.find(c => c.name === 'Mobile Tier: Financial Goals');
check('mobile: Mobile Tier: Essential Needs child exists', !!mTierEss);
check('mobile: Mobile Tier: Financial Goals child exists', !!mTierFin);

// Lock CTA
const mLockCta = mKids.find(c => c.name === 'lock-cta');
check('mobile: lock-cta child exists',               !!mLockCta);
check('mobile: lock-cta fill = ACCENT_BLUE',         mLockCta?.fills[0]?.fillColor   === COLORS.ACCENT_BLUE);
check('mobile: lock-cta borderRadius = 8',           mLockCta?.borderRadius          === ALLOCATOR.LOCK_CTA_R);

// Counter x = 15 (centred padding in 390px frame) and stacked vertically
const padX = (ALLOCATOR.MOBILE_W - ZBB_COUNTER.WIDTH) / 2;   // 15
check('mobile: healthy counter x = 15',    mHealthy?.x  === padX);
check('mobile: warning counter x = 15',    mWarning?.x  === padX);
check('mobile: overspent counter x = 15',  mOverspent?.x === padX);
check('mobile: counters stacked (healthy.y < warning.y < overspent.y)',
  mHealthy?.y < mWarning?.y && mWarning?.y < mOverspent?.y);
check('mobile: healthy counter y = 24',    mHealthy?.y  === ALLOCATOR.PADDING);

// ─────────────────────────────────────────────────────────────────────────────
// § 7  Setup integration — runSetup() wires in desktopAllocator + mobileAllocator
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 7  Setup integration');

// Minimal mock that satisfies all modules called by runSetup:
//   setupPages  → currentPage, createPage, getPages
//   penpotUtils → storage.setItem / getItem
//   buildSidebar + buildDesktopAllocator + buildMobileAllocator
//               → createBoard, createRectangle, createText
function makeSetupMock() {
  const pages = [{ name: 'Page 1' }];
  let _currentPage = pages[0];
  const store  = {};
  return {
    get currentPage() { return _currentPage; },
    openPage(page)    { _currentPage = page; },
    createPage(name)  { const p = { name }; pages.push(p); return p; },
    getPages()        { return [...pages]; },
    createBoard() {
      let _w = 100, _h = 100;
      return {
        name: '', x: 0, y: 0,
        fills: [], clipsContent: true,
        children: [],
        get width()  { return _w; },
        get height() { return _h; },
        resize(w, h) { _w = w; _h = h; },
        appendChild(child) { this.children.push(child); },
      };
    },
    createRectangle() {
      let _w = 100, _h = 100;
      return {
        name: '', x: 0, y: 0, fills: [], strokes: [], borderRadius: 0,
        get width()  { return _w; },
        get height() { return _h; },
        resize(w, h) { _w = w; _h = h; },
      };
    },
    createText(content) {
      return { name: '', content, x: 0, y: 0, fills: [], fontSize: 14, fontWeight: 'regular' };
    },
    storage: {
      _data: store,
      setItem(k, v) { store[k] = v; },
      getItem(k)    { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
    },
  };
}

const setupResult = runSetup(makeSetupMock());

// desktopAllocator
check('setup: desktopAllocator is defined',
  setupResult.desktopAllocator !== undefined && setupResult.desktopAllocator !== null);
check('setup: desktopAllocator.name = "Allocator Desktop"',
  setupResult.desktopAllocator?.name === 'Allocator Desktop');
check('setup: desktopAllocator.x = 240',
  setupResult.desktopAllocator?.x === ALLOCATOR.DESKTOP_X);

// mobileAllocator
check('setup: mobileAllocator is defined',
  setupResult.mobileAllocator !== undefined && setupResult.mobileAllocator !== null);
check('setup: mobileAllocator.name = "Allocator Mobile"',
  setupResult.mobileAllocator?.name === 'Allocator Mobile');
check('setup: mobileAllocator.x = 1500',
  setupResult.mobileAllocator?.x === ALLOCATOR.MOBILE_X);

// S01 regressions — sidebar, helpers, COLORS still present
check('setup: sidebar still returned (S01 regression)',    !!setupResult.sidebar);
check('setup: helpers still returned (S01 regression)',    !!setupResult.helpers);
check('setup: COLORS still returned (S01 regression)',     !!setupResult.COLORS);

// ─────────────────────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(56)}`);
const total = passed + failed;
console.log(`${total} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
