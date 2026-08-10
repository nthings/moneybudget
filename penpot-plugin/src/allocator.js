/**
 * Allocator screen assembler for MoneyBudget Penpot prototype.
 *
 * Exports:
 *   buildDesktopAllocator(penpot, COLORS) — 1200×960 content board at x:240
 *   buildMobileAllocator(penpot, COLORS)  — 390×844 self-contained frame at x:1500
 *   ALLOCATOR                             — layout constants
 *
 * Both frames are wired into setup.js so runSetup() places them on "The
 * Allocator" page alongside the S01 sidebar.
 *
 * Desktop frame children (7):
 *   ZBB Counter - Healthy   (x:24,  y:24)
 *   ZBB Counter - Warning   (x:400, y:24)
 *   ZBB Counter - Overspent (x:776, y:24)
 *   Tier: Essential Needs   (x:24,  y:120)
 *   Tier: Financial Goals   (x:24,  y:328)
 *   Tier: Lifestyle         (x:24,  y:500)
 *   lock-cta                (x:500, y:888)
 *
 * Mobile frame children (6):
 *   ZBB Counter - Healthy         (x:15, y:24)
 *   ZBB Counter - Warning         (x:15, y:120)
 *   ZBB Counter - Overspent       (x:15, y:216)
 *   Mobile Tier: Essential Needs  (x:15, y:312)
 *   Mobile Tier: Financial Goals  (x:15, y:504)
 *   lock-cta                      (x:95, y:772)
 */
import { makeHelpers } from './helpers.js';
import { buildZbbCounter, ZBB_COUNTER } from './zbb-counter.js';
import { buildTierGroup, TIER_GROUP, DEFAULT_TIERS } from './allocator-tiers.js';

// ── Layout constants ──────────────────────────────────────────────────────────
export const ALLOCATOR = {
  // Desktop content board (sits to the right of the 240px sidebar)
  DESKTOP_X: 240,
  DESKTOP_W: 1200,
  DESKTOP_H: 960,

  // Mobile frame (side-by-side preview)
  MOBILE_X: 1500,
  MOBILE_W: 390,
  MOBILE_H: 844,

  // Shared spacing
  PADDING: 24,
  GAP:     16,

  // Lock CTA button
  LOCK_CTA_W:  200,
  LOCK_CTA_H:   48,
  LOCK_CTA_R:    8,   // border-radius

  // Mobile tier card (360px wide — fits 390px frame with 15px each side)
  MOBILE_TIER_W:        360,
  MOBILE_TIER_ROW_H:     32,   // tighter rows than desktop (36)
  MOBILE_TIER_HEADER_H:  40,
  MOBILE_TIER_PADDING_X: 12,
  MOBILE_TIER_PADDING_Y:  8,
};

// ── Private helpers ───────────────────────────────────────────────────────────

/** Total height of a desktop tier group card for itemCount line items. */
function desktopTierHeight(itemCount) {
  return (
    TIER_GROUP.HEADER_H +
    itemCount * TIER_GROUP.ROW_H +
    TIER_GROUP.ROW_H +     // subtotal row
    TIER_GROUP.PADDING_Y
  );
}

/** Total height of a mobile tier group card for itemCount line items. */
function mobileTierHeight(itemCount) {
  return (
    ALLOCATOR.MOBILE_TIER_HEADER_H +
    itemCount * ALLOCATOR.MOBILE_TIER_ROW_H +
    ALLOCATOR.MOBILE_TIER_ROW_H +   // subtotal row
    ALLOCATOR.MOBILE_TIER_PADDING_Y
  );
}

/** Lock CTA — a single styled rectangle (ACCENT_BLUE, rounded corners). */
function buildLockCta(penpot, COLORS, { x, y }) {
  const { mkRect } = makeHelpers(penpot);
  return mkRect({
    name:         'lock-cta',
    x,
    y,
    width:        ALLOCATOR.LOCK_CTA_W,
    height:       ALLOCATOR.LOCK_CTA_H,
    fills:        [{ fillColor: COLORS.ACCENT_BLUE, fillOpacity: 1 }],
    borderRadius: ALLOCATOR.LOCK_CTA_R,
  });
}

/**
 * Mobile-width tier group card (360px, tighter row height).
 *
 * Children naming mirrors buildTierGroup for consistency:
 *   header-bg, title, item-label-N, item-amount-N, divider, subtotal
 */
function buildMobileTierGroup(penpot, COLORS, { title, items }) {
  const { mkRect, mkBoard, mkText } = makeHelpers(penpot);
  const W  = ALLOCATOR.MOBILE_TIER_W;
  const PX = ALLOCATOR.MOBILE_TIER_PADDING_X;
  const PY = ALLOCATOR.MOBILE_TIER_PADDING_Y;
  const RH = ALLOCATOR.MOBILE_TIER_ROW_H;
  const HH = ALLOCATOR.MOBILE_TIER_HEADER_H;

  const board = mkBoard({
    name:   `Mobile Tier: ${title}`,
    width:  W,
    height: mobileTierHeight(items.length),
    fills:  [{ fillColor: COLORS.BG_SURFACE, fillOpacity: 1 }],
  });

  // ── Header background strip ──────────────────────────────────────────────
  board.appendChild(mkRect({
    name:   'header-bg',
    x:      0,
    y:      0,
    width:  W,
    height: HH,
    fills:  [{ fillColor: COLORS.BG_ELEVATED, fillOpacity: 1 }],
  }));

  // ── Title text ───────────────────────────────────────────────────────────
  board.appendChild(mkText(title, {
    name:       'title',
    x:          PX,
    y:          PY + 8,
    fontSize:   14,
    fontWeight: '600',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  }));

  // ── Line-item rows ───────────────────────────────────────────────────────
  items.forEach((item, i) => {
    const rowY = HH + i * RH + PY;
    board.appendChild(mkText(item.label, {
      name:       `item-label-${i}`,
      x:          PX,
      y:          rowY,
      fontSize:   12,
      fontWeight: '400',
      fills:      [{ fillColor: COLORS.TEXT_SECONDARY, fillOpacity: 1 }],
    }));
    board.appendChild(mkText(item.amount, {
      name:       `item-amount-${i}`,
      x:          W - 90,
      y:          rowY,
      fontSize:   12,
      fontWeight: '400',
      fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
    }));
  });

  // ── Divider before subtotal ──────────────────────────────────────────────
  board.appendChild(mkRect({
    name:   'divider',
    x:      PX,
    y:      HH + items.length * RH + PY - 4,
    width:  W - PX * 2,
    height: 1,
    fills:  [{ fillColor: COLORS.BORDER_SUBTLE, fillOpacity: 1 }],
  }));

  // ── Subtotal row ─────────────────────────────────────────────────────────
  board.appendChild(mkText('Subtotal', {
    name:       'subtotal',
    x:          PX,
    y:          HH + items.length * RH + PY,
    fontSize:   12,
    fontWeight: '600',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  }));

  return board;
}

// ── Public builders ───────────────────────────────────────────────────────────

/**
 * Build the desktop Allocator content board (1200×960 at x:240).
 *
 * Positioned to the right of the S01 sidebar (240px) to compose the full
 * 1440×960 canvas.
 *
 * @param {object} penpot  Penpot plugin API (or test mock)
 * @param {object} COLORS  Design-token map from colors.js
 * @returns {PenpotBoard}
 */
export function buildDesktopAllocator(penpot, COLORS) {
  const { mkBoard } = makeHelpers(penpot);

  const board = mkBoard({
    name:   'Allocator Desktop',
    x:      ALLOCATOR.DESKTOP_X,
    y:      0,
    width:  ALLOCATOR.DESKTOP_W,
    height: ALLOCATOR.DESKTOP_H,
    fills:  [{ fillColor: COLORS.BG_APP, fillOpacity: 1 }],
  });

  // ── ZBB Counter row — horizontal, y:24 ───────────────────────────────────
  //   3 counters × 360px + 2 gaps × 16px = 1112px; left edge at x:24
  const counterY    = ALLOCATOR.PADDING;                          // 24
  const counterStep = ZBB_COUNTER.WIDTH + ALLOCATOR.GAP;          // 376
  ['healthy', 'warning', 'overspent'].forEach((state, i) => {
    const counter = buildZbbCounter(penpot, COLORS, state);
    counter.x = ALLOCATOR.PADDING + i * counterStep;              // 24, 400, 776
    counter.y = counterY;
    board.appendChild(counter);
  });

  // ── Tier groups — stacked vertically, x:24, starting y:120 ───────────────
  let tierY = ALLOCATOR.PADDING + ZBB_COUNTER.HEIGHT + ALLOCATOR.GAP;  // 120
  for (const tier of DEFAULT_TIERS) {
    const card = buildTierGroup(penpot, COLORS, tier);
    card.x = ALLOCATOR.PADDING;
    card.y = tierY;
    board.appendChild(card);
    tierY += desktopTierHeight(tier.items.length) + ALLOCATOR.GAP;
    //  Essential Needs (h=192) → tierY: 328
    //  Financial Goals (h=156) → tierY: 500
    //  Lifestyle       (h=192) → tierY: 708  (well below 888 lock CTA)
  }

  // ── Lock CTA — centred horizontally near bottom ───────────────────────────
  const lockX = (ALLOCATOR.DESKTOP_W - ALLOCATOR.LOCK_CTA_W) / 2;       // 500
  const lockY = ALLOCATOR.DESKTOP_H - ALLOCATOR.PADDING - ALLOCATOR.LOCK_CTA_H; // 888
  board.appendChild(buildLockCta(penpot, COLORS, { x: lockX, y: lockY }));

  return board;
}

/**
 * Build the mobile Allocator frame (390×844 at x:1500).
 *
 * Self-contained — no sidebar.  ZBB counters stack vertically (each 360px wide
 * fits with 15px horizontal padding).  Only the first two DEFAULT_TIERS are
 * shown using mobile-width cards (ROW_H=32 instead of 36).
 *
 * @param {object} penpot  Penpot plugin API (or test mock)
 * @param {object} COLORS  Design-token map from colors.js
 * @returns {PenpotBoard}
 */
export function buildMobileAllocator(penpot, COLORS) {
  const { mkBoard } = makeHelpers(penpot);

  const padX = (ALLOCATOR.MOBILE_W - ZBB_COUNTER.WIDTH) / 2;    // 15

  const board = mkBoard({
    name:   'Allocator Mobile',
    x:      ALLOCATOR.MOBILE_X,
    y:      0,
    width:  ALLOCATOR.MOBILE_W,
    height: ALLOCATOR.MOBILE_H,
    fills:  [{ fillColor: COLORS.BG_APP, fillOpacity: 1 }],
  });

  // ── ZBB Counters — stacked vertically, x:15 ──────────────────────────────
  let counterY = ALLOCATOR.PADDING;                               // 24
  ['healthy', 'warning', 'overspent'].forEach((state) => {
    const counter = buildZbbCounter(penpot, COLORS, state);
    counter.x = padX;
    counter.y = counterY;
    board.appendChild(counter);
    counterY += ZBB_COUNTER.HEIGHT + ALLOCATOR.GAP;               // +96 each
  });
  // After 3 iterations: counterY = 24 + 3*96 = 312

  // ── Mobile tier groups — stacked, x:15, starting y:312 ───────────────────
  let tierY = counterY;   // 312 — gap from last counter step already included
  for (const tier of DEFAULT_TIERS.slice(0, 2)) {
    const card = buildMobileTierGroup(penpot, COLORS, tier);
    card.x = padX;
    card.y = tierY;
    board.appendChild(card);
    tierY += mobileTierHeight(tier.items.length) + ALLOCATOR.GAP;
    //  Essential Needs (h=176) → tierY: 504
    //  Financial Goals (h=144) → tierY: 664
  }

  // ── Lock CTA — centred horizontally near bottom ───────────────────────────
  const lockX = (ALLOCATOR.MOBILE_W - ALLOCATOR.LOCK_CTA_W) / 2;        // 95
  const lockY = ALLOCATOR.MOBILE_H - ALLOCATOR.PADDING - ALLOCATOR.LOCK_CTA_H; // 772
  board.appendChild(buildLockCta(penpot, COLORS, { x: lockX, y: lockY }));

  return board;
}
