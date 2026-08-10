/**
 * verify-sidebar.mjs
 *
 * Offline unit tests for the sidebar component builder.
 * No live Penpot runtime is required — a minimal mock is injected.
 *
 * Run:  node tests/verify-sidebar.mjs
 *
 * Exit 0 = all checks passed, Exit 1 = one or more failures.
 */

import { buildSidebar, SIDEBAR, NAV_ITEMS } from '../src/sidebar.js';
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

// ── Test harness ─────────────────────────────────────────────────────────────
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
const penpot  = makeMockPenpot();
const sidebar = buildSidebar(penpot, COLORS);
const kids    = sidebar.children;

// ─────────────────────────────────────────────────────────────────────────────
// § 1  Sidebar board — structure and dimensions
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 1  Sidebar board');
check('name is "Sidebar"',            sidebar.name === 'Sidebar');
check('x = 0',                        sidebar.x    === 0);
check('y = 0',                        sidebar.y    === 0);
check('width  = 240',                 sidebar.width  === SIDEBAR.WIDTH);
check('height = 960',                 sidebar.height === SIDEBAR.HEIGHT);
check('clipsContent = true',          sidebar.clipsContent === true);
check('exactly 1 fill',               sidebar.fills.length === 1);
check('fill color is SIDEBAR_BG',     sidebar.fills[0].fillColor   === COLORS.SIDEBAR_BG);
check('fill opacity = 1',             sidebar.fills[0].fillOpacity === 1);

// ─────────────────────────────────────────────────────────────────────────────
// § 2  Children count
//   logo(1) + nav-texts(4) + active-bg-rect(1) + settings(1) = 7
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n§ 2  Children count (got ${kids.length}, expected 7)`);
check('exactly 7 children appended', kids.length === 7);

// ─────────────────────────────────────────────────────────────────────────────
// § 3  Logo
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 3  Logo');
const logo = kids.find(c => c.name === 'logo');
check('logo child exists',               !!logo);
check('logo _content = "MoneyBudget"',   logo?._content   === 'MoneyBudget');
check('logo x = 20',                     logo?.x          === SIDEBAR.LOGO_X);
check('logo y = 24',                     logo?.y          === SIDEBAR.LOGO_Y);
check('logo fontSize = 18',              logo?.fontSize   === SIDEBAR.LOGO_SIZE);
check('logo fontWeight = "700"',         logo?.fontWeight === '700');
check('logo fill = TEXT_PRIMARY',        logo?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);
check('logo fill opacity = 1',           logo?.fills[0]?.fillOpacity === 1);

// ─────────────────────────────────────────────────────────────────────────────
// § 4  Nav item texts — presence and basic styling
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 4  Nav item texts');
for (const item of NAV_ITEMS) {
  const t = kids.find(c => c.name === item.label);
  check(`"${item.label}" text child exists`, !!t);
  check(`"${item.label}" fontSize = 14`,     t?.fontSize === SIDEBAR.NAV_FONT_SIZE);
}

// ─────────────────────────────────────────────────────────────────────────────
// § 5  Active nav item — "The Allocator" (default activeLabel)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 5  Active nav item ("The Allocator")');
const DEFAULT_ACTIVE_LABEL = 'The Allocator';
const activeBg   = kids.find(c => c.name === `${DEFAULT_ACTIVE_LABEL}-active-bg`);
const activeText = kids.find(c => c.name === DEFAULT_ACTIVE_LABEL);

check('active-bg rect exists',                   !!activeBg);
check('active-bg fill = SIDEBAR_ITEM_ACTIVE',    activeBg?.fills[0]?.fillColor   === COLORS.SIDEBAR_ITEM_ACTIVE);
check('active-bg fill opacity = 1',              activeBg?.fills[0]?.fillOpacity === 1);
check('active-bg width = 224',                   activeBg?.width  === SIDEBAR.ACTIVE_BG_W);
check('active-bg height = 40',                   activeBg?.height === SIDEBAR.ACTIVE_BG_H);
check('active-bg borderRadius = 6',              activeBg?.borderRadius === SIDEBAR.ACTIVE_BG_R);
check('active-bg x = 8',                         activeBg?.x === SIDEBAR.ACTIVE_BG_X);
check('active text fontWeight = "600"',          activeText?.fontWeight === '600');
check('active text fill = TEXT_PRIMARY',         activeText?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);

// ─────────────────────────────────────────────────────────────────────────────
// § 6  Inactive nav items — no highlight rect, secondary colour
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 6  Inactive nav items');
const inactiveItems = NAV_ITEMS.filter(n => n.label !== DEFAULT_ACTIVE_LABEL);
for (const item of inactiveItems) {
  const t   = kids.find(c => c.name === item.label);
  const bg  = kids.find(c => c.name === `${item.label}-active-bg`);
  check(`"${item.label}" fontWeight = "400"`,       t?.fontWeight             === '400');
  check(`"${item.label}" fill = TEXT_SECONDARY`,    t?.fills[0]?.fillColor    === COLORS.TEXT_SECONDARY);
  check(`"${item.label}" has no active-bg rect`,    bg === undefined);
}

// ─────────────────────────────────────────────────────────────────────────────
// § 7  Nav item vertical positions
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 7  Nav item Y positions');
NAV_ITEMS.forEach((item, i) => {
  const expectedY = SIDEBAR.NAV_Y_START + i * SIDEBAR.NAV_ITEM_H + 12;
  const t = kids.find(c => c.name === item.label);
  check(`"${item.label}" y = ${expectedY}`, t?.y === expectedY);
});

// ─────────────────────────────────────────────────────────────────────────────
// § 8  Settings link
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 8  Settings link');
const settings = kids.find(c => c.name === 'Settings');
check('Settings text exists',              !!settings);
check('Settings _content = "Settings"',   settings?._content           === 'Settings');
check('Settings y = 900',                 settings?.y                  === SIDEBAR.SETTINGS_Y);
check('Settings x = 20',                  settings?.x                  === SIDEBAR.NAV_X);
check('Settings fontSize = 14',           settings?.fontSize           === SIDEBAR.NAV_FONT_SIZE);
check('Settings fontWeight = "400"',      settings?.fontWeight         === '400');
check('Settings fill = TEXT_SECONDARY',   settings?.fills[0]?.fillColor === COLORS.TEXT_SECONDARY);

// ─────────────────────────────────────────────────────────────────────────────
// § 9  Exported SIDEBAR constants sanity
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 9  SIDEBAR layout constants');
check('SIDEBAR.WIDTH  = 240',             SIDEBAR.WIDTH       === 240);
check('SIDEBAR.HEIGHT = 960',             SIDEBAR.HEIGHT      === 960);
check('NAV_ITEMS has 4 entries',          NAV_ITEMS.length    === 4);
check('NAV_ITEMS entries have no hardcoded .active property',
  NAV_ITEMS.every(n => !('active' in n)));

// ─────────────────────────────────────────────────────────────────────────────
// § 10  Alternate activeLabel — 'Dashboard'
//   Calling buildSidebar with activeLabel='Dashboard' must highlight Dashboard
//   and leave The Allocator inactive.
// ─────────────────────────────────────────────────────────────────────────────
console.log("\n§ 10  Alternate activeLabel ('Dashboard')");
{
  const penpot2  = makeMockPenpot();
  const sidebar2 = buildSidebar(penpot2, COLORS, 'Dashboard');
  const kids2    = sidebar2.children;

  const dashBg   = kids2.find(c => c.name === 'Dashboard-active-bg');
  const dashText = kids2.find(c => c.name === 'Dashboard');
  const allocBg  = kids2.find(c => c.name === 'The Allocator-active-bg');
  const allocText= kids2.find(c => c.name === 'The Allocator');

  check('Dashboard active-bg rect exists',            !!dashBg);
  check('Dashboard text fontWeight = "600"',          dashText?.fontWeight === '600');
  check('Dashboard text fill = TEXT_PRIMARY',         dashText?.fills[0]?.fillColor === COLORS.TEXT_PRIMARY);
  check('The Allocator has no active-bg rect',        allocBg === undefined);
  check('The Allocator text fontWeight = "400"',      allocText?.fontWeight === '400');
  check('The Allocator text fill = TEXT_SECONDARY',   allocText?.fills[0]?.fillColor === COLORS.TEXT_SECONDARY);
  // 7 children: logo + 4 nav-texts + 1 active-bg (Dashboard) + settings
  check('still 7 children when Dashboard is active',  kids2.length === 7);
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(56)}`);
const total = passed + failed;
console.log(`${total} checks: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  process.exit(1);
}
