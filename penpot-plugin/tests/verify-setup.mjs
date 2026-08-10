/**
 * Verification test for T01: Create pages, color storage, and shape helpers.
 *
 * Runs against a mock Penpot API to confirm the setup logic would produce the
 * correct result when loaded into the real Penpot plugin environment.
 *
 * Run:  node tests/verify-setup.mjs
 *
 * Exit 0 = all pass.  Exit 1 = at least one failure.
 */
import { runSetup } from '../src/setup.js';

// ─────────────────────────────────────────────────────────────────────────────
// Mock Penpot API
// ─────────────────────────────────────────────────────────────────────────────
function buildMockPenpot() {
  const pages = [{ name: 'Page 1' }];
  const storageData = {};
  let _currentPage = pages[0];   // mutable — updated by openPage()

  return {
    // Page management
    get currentPage() { return _currentPage; },

    createPage(name) {
      const page = { name };
      pages.push(page);
      return page;
    },

    getPages() { return [...pages]; },

    openPage(page) { _currentPage = page; },


    // Shape factories
    createBoard() {
      let _w = 100, _h = 100;
      return {
        name: '', x: 0, y: 0,
        get width()  { return _w; },
        get height() { return _h; },
        resize(w, h) { _w = w; _h = h; },
        fills: [],
        clipsContent: true,
        children: [],
        appendChild(child) { this.children.push(child); },
      };
    },

    createRectangle() {
      let _w = 100, _h = 100;
      return {
        name: '', x: 0, y: 0,
        get width()  { return _w; },
        get height() { return _h; },
        resize(w, h) { _w = w; _h = h; },
        fills: [],
        strokes: [],
        borderRadius: 0,
      };
    },

    createText(content) {
      return {
        name: '', content, x: 0, y: 0,
        fills: [], fontSize: 14, fontWeight: 'regular',
      };
    },

    // Storage (mirrors penpot.storage / IndexedDB-backed plugin storage)
    storage: {
      _data: storageData,
      setItem(k, v)  { storageData[k] = v; },
      getItem(k)     { return Object.prototype.hasOwnProperty.call(storageData, k) ? storageData[k] : null; },
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Assertion helpers
// ─────────────────────────────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`  ✓  ${label}`);
    passed++;
  } else {
    console.error(`  ✗  ${label}`);
    failed++;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Run setup
// ─────────────────────────────────────────────────────────────────────────────
const mock = buildMockPenpot();
const result = runSetup(mock);

// ─────────────────────────────────────────────────────────────────────────────
// § 1  Pages
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 1  Pages');
const pages = mock.getPages();
const names = pages.map((p) => p.name);

assert(pages.length === 4, `4 pages exist (got ${pages.length})`);

for (const expected of ['The Allocator', 'Dashboard', 'Transaction Review', 'Piggy Banks']) {
  assert(names.includes(expected), `Page "${expected}" present`);
}

// ─────────────────────────────────────────────────────────────────────────────
// § 2  penpotUtils.getPages()
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 2  penpotUtils.getPages()');
const utilPages = result.penpotUtils.getPages();
assert(utilPages.length === 4,
  `penpotUtils.getPages() returns 4 pages (got ${utilPages.length})`);
assert(
  utilPages.map((p) => p.name).includes('The Allocator'),
  'penpotUtils.getPages() includes "The Allocator"',
);

// ─────────────────────────────────────────────────────────────────────────────
// § 3  Color storage
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 3  Color storage');
const storedColors = result.penpotUtils.retrieve('colors');
assert(storedColors !== undefined && storedColors !== null,
  'Colors persisted to penpot.storage["colors"]');
assert(typeof storedColors === 'object',
  'Stored colors value is an object');

for (const key of ['BG_APP', 'SIDEBAR_BG', 'BUDGET_HEALTHY', 'BUDGET_WARNING', 'BUDGET_OVERSPENT']) {
  assert(key in storedColors, `Color token ${key} present`);
}

const storedHelperKeys = result.penpotUtils.retrieve('helperKeys');
assert(
  Array.isArray(storedHelperKeys) &&
  storedHelperKeys.includes('mkRect') &&
  storedHelperKeys.includes('mkBoard') &&
  storedHelperKeys.includes('mkText'),
  'helperKeys registry stored correctly',
);

// ─────────────────────────────────────────────────────────────────────────────
// § 4  Helper function existence
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 4  Helper functions exported');
assert(typeof result.helpers.mkRect  === 'function', 'mkRect  is a function');
assert(typeof result.helpers.mkBoard === 'function', 'mkBoard is a function');
assert(typeof result.helpers.mkText  === 'function', 'mkText  is a function');

// ─────────────────────────────────────────────────────────────────────────────
// § 5  mkRect behaviour
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 5  mkRect');
const rect = result.helpers.mkRect({
  name: 'budget-card', x: 32, y: 64,
  width: 300, height: 80,
  borderRadius: 12,
  fills: [{ type: 'solid', color: '#1E2130' }],
});
assert(rect.name         === 'budget-card', 'mkRect sets name');
assert(rect.x            === 32,            'mkRect sets x');
assert(rect.y            === 64,            'mkRect sets y');
assert(rect.width        === 300,           'mkRect sets width');
assert(rect.height       === 80,            'mkRect sets height');
assert(rect.borderRadius === 12,            'mkRect sets borderRadius');
assert(rect.fills.length === 1,             'mkRect sets fills');

// ─────────────────────────────────────────────────────────────────────────────
// § 6  mkBoard behaviour
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 6  mkBoard');
const board = result.helpers.mkBoard({
  name: 'Sidebar', x: 0, y: 0,
  width: 240, height: 960,
  fills: [{ type: 'solid', color: '#0D0F18' }],
  clipsContent: true,
});
assert(board.name        === 'Sidebar', 'mkBoard sets name');
assert(board.x           === 0,         'mkBoard sets x');
assert(board.y           === 0,         'mkBoard sets y');
assert(board.width       === 240,       'mkBoard width = 240');
assert(board.height      === 960,       'mkBoard height = 960');
assert(board.fills.length === 1,        'mkBoard sets fills');
assert(board.clipsContent === true,     'mkBoard sets clipsContent');

// ─────────────────────────────────────────────────────────────────────────────
// § 7  mkText behaviour
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 7  mkText');
const text = result.helpers.mkText('Dashboard', {
  name: 'nav-label', x: 16, y: 140,
  fontSize: 14, fontWeight: '500',
  fills: [{ type: 'solid', color: '#FFFFFF' }],
});
assert(text.content    === 'Dashboard', 'mkText stores content');
assert(text.name       === 'nav-label', 'mkText sets name');
assert(text.x          === 16,          'mkText sets x');
assert(text.y          === 140,         'mkText sets y');
assert(text.fontSize   === 14,          'mkText sets fontSize');
assert(text.fontWeight === '500',       'mkText sets fontWeight');
assert(text.fills.length === 1,         'mkText sets fills');

// ─────────────────────────────────────────────────────────────────────────────
// § 8  COLORS exported
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 8  COLORS constant');
assert(typeof result.COLORS === 'object',            'COLORS is an object');
assert(Object.keys(result.COLORS).length >= 16,      'COLORS has ≥ 16 tokens');
assert(result.COLORS.BUDGET_HEALTHY   === '#4CAF50', 'BUDGET_HEALTHY = #4CAF50');
assert(result.COLORS.BUDGET_WARNING   === '#FFC107', 'BUDGET_WARNING = #FFC107');
assert(result.COLORS.BUDGET_OVERSPENT === '#F44336', 'BUDGET_OVERSPENT = #F44336');

// ─────────────────────────────────────────────────────────────────────────────
// § 9  Dashboard screen wired
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 9  Dashboard screen');
assert(result.dashboardSidebar !== undefined && result.dashboardSidebar !== null,
  'dashboardSidebar returned from runSetup');
assert(result.dashboardContent !== undefined && result.dashboardContent !== null,
  'dashboardContent returned from runSetup');
assert(result.dashboardSidebar.name === 'Sidebar',
  `dashboardSidebar.name = 'Sidebar' (got '${result.dashboardSidebar.name}')`);
assert(result.dashboardContent.name === 'Dashboard Content',
  `dashboardContent.name = 'Dashboard Content' (got '${result.dashboardContent.name}')`);
assert(result.dashboardContent.width  === 1200, `dashboardContent width = 1200 (got ${result.dashboardContent.width})`);
assert(result.dashboardContent.height === 960,  `dashboardContent height = 960 (got ${result.dashboardContent.height})`);
assert(Array.isArray(result.dashboardContent.children) && result.dashboardContent.children.length >= 6,
  `dashboardContent has ≥ 6 children (got ${result.dashboardContent.children?.length})`);

// ─────────────────────────────────────────────────────────────────────────────
// § 10  Transaction Review screen wired
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 10  Transaction Review screen');
assert(result.transactionsSidebar !== undefined && result.transactionsSidebar !== null,
  'transactionsSidebar returned from runSetup');
assert(result.transactionsContent !== undefined && result.transactionsContent !== null,
  'transactionsContent returned from runSetup');
assert(result.transactionsSidebar.name === 'Sidebar',
  `transactionsSidebar.name = 'Sidebar' (got '${result.transactionsSidebar.name}')`);
assert(result.transactionsContent.name === 'Transactions Content',
  `transactionsContent.name = 'Transactions Content' (got '${result.transactionsContent.name}')`);
assert(result.transactionsContent.width  === 1200, `transactionsContent width = 1200 (got ${result.transactionsContent.width})`);
assert(result.transactionsContent.height === 960,  `transactionsContent height = 960 (got ${result.transactionsContent.height})`);
assert(Array.isArray(result.transactionsContent.children) && result.transactionsContent.children.length >= 6,
  `transactionsContent has ≥ 6 children (got ${result.transactionsContent.children?.length})`);

// ─────────────────────────────────────────────────────────────────────────────
// § 11  Piggy Banks screen wired
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n§ 11  Piggy Banks screen');
assert(result.piggyBanksSidebar !== undefined && result.piggyBanksSidebar !== null,
  'piggyBanksSidebar returned from runSetup');
assert(result.piggyBanksContent !== undefined && result.piggyBanksContent !== null,
  'piggyBanksContent returned from runSetup');
assert(result.piggyBanksSidebar.name === 'Sidebar',
  `piggyBanksSidebar.name = 'Sidebar' (got '${result.piggyBanksSidebar.name}')`);
assert(result.piggyBanksContent.name === 'Piggy Banks Content',
  `piggyBanksContent.name = 'Piggy Banks Content' (got '${result.piggyBanksContent.name}')`);
assert(result.piggyBanksContent.width  === 1200, `piggyBanksContent width = 1200 (got ${result.piggyBanksContent.width})`);
assert(result.piggyBanksContent.height === 960,  `piggyBanksContent height = 960 (got ${result.piggyBanksContent.height})`);
assert(Array.isArray(result.piggyBanksContent.children) && result.piggyBanksContent.children.length >= 6,
  `piggyBanksContent has ≥ 6 children (got ${result.piggyBanksContent.children?.length})`);

// ─────────────────────────────────────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
console.log(`Result: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('\n✗ VERIFICATION FAILED');
  process.exit(1);
} else {
  console.log('\n✓ ALL CHECKS PASSED');
  process.exit(0);
}
