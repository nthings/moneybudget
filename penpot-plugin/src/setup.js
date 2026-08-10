/**
 * Design-system setup orchestrator.
 *
 * Accepts the `penpot` API reference so the module is fully testable without
 * a live Penpot instance.  In the plugin entry point (`index.js`) the global
 * `penpot` is passed in; in tests a mock is injected.
 *
 * Steps performed:
 *   1. Create / rename the four required pages.
 *   2. Persist color tokens in penpot.storage under the key "colors".
 *   3. Persist a record of available helper keys under "helperKeys".
 *   4. Build and return mkRect / mkBoard / mkText helpers.
 *   5. Build the Sidebar component and append it to the current page.
 *   6. Build desktop (1200×960) and mobile (390×844) Allocator frames.
 *   7. Navigate to Dashboard page and build Dashboard screen.
 *   8. Navigate to Transaction Review page and build Transactions screen.
 *   9. Navigate to Piggy Banks page and build Piggy Banks screen.
 *
 * @param {object} penpot  Penpot plugin API reference
 * @returns {{ helpers: {mkRect, mkBoard, mkText}, penpotUtils: object, COLORS: object,
 *            sidebar: PenpotBoard, desktopAllocator: PenpotBoard, mobileAllocator: PenpotBoard,
 *            dashboardSidebar: PenpotBoard, dashboardContent: PenpotBoard,
 *            transactionsSidebar: PenpotBoard, transactionsContent: PenpotBoard,
 *            piggyBanksSidebar: PenpotBoard, piggyBanksContent: PenpotBoard }}
 */
import { COLORS } from './colors.js';
import { makeHelpers } from './helpers.js';
import { makeUtils } from './utils.js';
import { setupPages } from './pages.js';
import { buildSidebar } from './sidebar.js';
import { buildDesktopAllocator, buildMobileAllocator } from './allocator.js';
import { buildDashboard } from './dashboard.js';
import { buildTransactions } from './transactions.js';
import { buildPiggyBanks } from './piggybanks.js';

export function runSetup(penpot) {
  // ── 1. Pages ───────────────────────────────────────────────────────────────
  setupPages(penpot);

  // ── 2. Utils (needed for storage writes below) ────────────────────────────
  const { penpotUtils } = makeUtils(penpot);

  // ── 3. Persist color tokens ────────────────────────────────────────────────
  penpotUtils.store('colors', COLORS);

  // ── 4. Persist helper registry (strings only — functions cannot be stored) ─
  penpotUtils.store('helperKeys', ['mkRect', 'mkBoard', 'mkText']);

  // ── 5. Build helpers bound to this penpot instance ────────────────────────
  const helpers = makeHelpers(penpot);

  // ── 6. Build sidebar and place on The Allocator page ─────────────────────
  //  The Penpot runtime makes shapes on the active (current) page.  After
  //  setupPages() the current page is The Allocator, so the board lands there.
  const sidebar = buildSidebar(penpot, COLORS);

  // ── 7. Build desktop and mobile allocator frames ──────────────────────────
  //  Desktop (1200×960) placed at x:240 — fits to the right of the sidebar.
  //  Mobile  (390×844)  placed at x:1500 — side-by-side responsive preview.
  const desktopAllocator = buildDesktopAllocator(penpot, COLORS);
  const mobileAllocator  = buildMobileAllocator(penpot, COLORS);

  // ── 8. Navigate to Dashboard page and build Dashboard screen ───────────────
  //  openPage() switches the active page so new shapes land on Dashboard.
  const dashboardPage = penpotUtils.findPage('Dashboard');
  penpot.openPage(dashboardPage);
  const { sidebar: dashboardSidebar, content: dashboardContent } = buildDashboard(penpot, COLORS);

  // ── 9. Navigate to Transaction Review page and build Transactions screen ────
  const transactionsPage = penpotUtils.findPage('Transaction Review');
  penpot.openPage(transactionsPage);
  const { sidebar: transactionsSidebar, content: transactionsContent } = buildTransactions(penpot, COLORS);

  // ── 10. Navigate to Piggy Banks page and build Piggy Banks screen ──────────
  const piggyBanksPage = penpotUtils.findPage('Piggy Banks');
  penpot.openPage(piggyBanksPage);
  const { sidebar: piggyBanksSidebar, content: piggyBanksContent } = buildPiggyBanks(penpot, COLORS);

  return {
    helpers, penpotUtils, COLORS,
    sidebar, desktopAllocator, mobileAllocator,
    dashboardSidebar, dashboardContent,
    transactionsSidebar, transactionsContent,
    piggyBanksSidebar, piggyBanksContent,
  };
}
