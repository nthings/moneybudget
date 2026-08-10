/**
 * Sidebar component builder for MoneyBudget.
 *
 * Creates a 240×960 dark sidebar board with:
 *   - Logo text at the top
 *   - Four navigation items (Dashboard, The Allocator, Transactions, Piggy Banks)
 *     where "The Allocator" is rendered in an active / highlighted state
 *   - Settings link anchored near the bottom
 *
 * All shapes are created with penpot.createX() (via the shared helpers) — never
 * page.createX() — so the module works correctly in both the plugin runtime and
 * the unit-test harness.
 *
 * @param {object} penpot  Penpot plugin API reference
 * @param {object} COLORS  Design-token map from colors.js
 * @returns {PenpotBoard}  The sidebar board with all children appended
 */
import { makeHelpers } from './helpers.js';

// ── Layout constants ──────────────────────────────────────────────────────────
export const SIDEBAR = {
  WIDTH:  240,
  HEIGHT: 960,

  // Logo
  LOGO_X:    20,
  LOGO_Y:    24,
  LOGO_SIZE: 18,

  // Navigation list
  NAV_X:          20,
  NAV_Y_START:    80,
  NAV_ITEM_H:     44,   // vertical stride per item
  NAV_FONT_SIZE:  14,

  // Active-state highlight rectangle
  ACTIVE_BG_X: 8,
  ACTIVE_BG_W: 224,
  ACTIVE_BG_H: 40,
  ACTIVE_BG_R: 6,       // border-radius

  // Settings link (bottom anchor)
  SETTINGS_Y: 900,
};

// ── Navigation item definitions ───────────────────────────────────────────────
export const NAV_ITEMS = [
  { label: 'Dashboard'     },
  { label: 'The Allocator' },
  { label: 'Transactions'  },
  { label: 'Piggy Banks'   },
];

// ── Builder ───────────────────────────────────────────────────────────────────
export function buildSidebar(penpot, COLORS, activeLabel = 'The Allocator') {
  const { mkRect, mkBoard, mkText } = makeHelpers(penpot);

  // ── 1. Main container board ─────────────────────────────────────────────────
  const sidebar = mkBoard({
    name:         'Sidebar',
    x:            0,
    y:            0,
    width:        SIDEBAR.WIDTH,
    height:       SIDEBAR.HEIGHT,
    fills:        [{ fillColor: COLORS.SIDEBAR_BG, fillOpacity: 1 }],
    clipsContent: true,
  });

  // ── 2. Logo text ─────────────────────────────────────────────────────────────
  const logo = mkText('MoneyBudget', {
    name:       'logo',
    x:          SIDEBAR.LOGO_X,
    y:          SIDEBAR.LOGO_Y,
    fontSize:   SIDEBAR.LOGO_SIZE,
    fontWeight: '700',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  });
  sidebar.appendChild(logo);

  // ── 3. Navigation items ───────────────────────────────────────────────────────
  NAV_ITEMS.forEach((item, i) => {
    const isActive = item.label === activeLabel;
    const navY = SIDEBAR.NAV_Y_START + i * SIDEBAR.NAV_ITEM_H;

    // Active-state highlight rectangle (only for the active item)
    if (isActive) {
      const activeBg = mkRect({
        name:         `${item.label}-active-bg`,
        x:            SIDEBAR.ACTIVE_BG_X,
        y:            navY,
        width:        SIDEBAR.ACTIVE_BG_W,
        height:       SIDEBAR.ACTIVE_BG_H,
        fills:        [{ fillColor: COLORS.SIDEBAR_ITEM_ACTIVE, fillOpacity: 1 }],
        borderRadius: SIDEBAR.ACTIVE_BG_R,
      });
      sidebar.appendChild(activeBg);
    }

    // Label text
    const navText = mkText(item.label, {
      name:       item.label,
      x:          SIDEBAR.NAV_X,
      y:          navY + 12,
      fontSize:   SIDEBAR.NAV_FONT_SIZE,
      fontWeight: isActive ? '600' : '400',
      fills: [{
        fillColor:   isActive ? COLORS.TEXT_PRIMARY : COLORS.TEXT_SECONDARY,
        fillOpacity: 1,
      }],
    });
    sidebar.appendChild(navText);
  });

  // ── 4. Settings link (bottom) ─────────────────────────────────────────────
  const settingsText = mkText('Settings', {
    name:       'Settings',
    x:          SIDEBAR.NAV_X,
    y:          SIDEBAR.SETTINGS_Y,
    fontSize:   SIDEBAR.NAV_FONT_SIZE,
    fontWeight: '400',
    fills:      [{ fillColor: COLORS.TEXT_SECONDARY, fillOpacity: 1 }],
  });
  sidebar.appendChild(settingsText);

  return sidebar;
}
