/**
 * Tier group card builder for MoneyBudget ZBB Allocator.
 *
 * Creates a card-style board representing one budget tier (e.g. "Essential Needs")
 * with a header, a list of line-item rows, and a subtotal row.
 *
 * Usage:
 *   import { buildTierGroup, TIER_GROUP, DEFAULT_TIERS } from './allocator-tiers.js';
 *   const card = buildTierGroup(penpot, COLORS, {
 *     title: 'Essential Needs',
 *     items: [{ label: 'Rent', amount: '$1,500.00' }, ...],
 *   });
 *
 * Children layout for N items (2N + 4 total):
 *   header-bg         — coloured header rectangle
 *   title             — tier title text
 *   item-label-0…N-1  — label text per line item
 *   item-amount-0…N-1 — amount text per line item
 *   divider           — separator rect above subtotal
 *   subtotal          — "Subtotal" label text
 *
 * @param {object} penpot               Penpot plugin API reference (or test mock)
 * @param {object} COLORS               Design-token map from colors.js
 * @param {{ title: string, items: Array<{ label: string, amount: string }> }} tier
 * @returns {PenpotBoard}               Tier card board with all children appended
 */
import { makeHelpers } from './helpers.js';

// ── Layout constants ──────────────────────────────────────────────────────────
export const TIER_GROUP = {
  WIDTH:    1152,
  HEADER_H:   40,   // height of the shaded header strip
  ROW_H:      36,   // vertical stride per item row
  PADDING_X:  16,
  PADDING_Y:   8,

  TITLE_FONT_SIZE:    14,
  ITEM_FONT_SIZE:     13,
  SUBTOTAL_FONT_SIZE: 13,

  AMOUNT_X_OFFSET: 120,  // distance from right edge for amount column
  DIVIDER_H:         1,
  DIVIDER_Y_GAP:     4,  // gap above subtotal text
};

// ── Default tier data (hardcoded ZBB example tiers) ──────────────────────────
export const DEFAULT_TIERS = [
  {
    title: 'Essential Needs',
    items: [
      { label: 'Rent',        amount: '$1,500.00' },
      { label: 'Groceries',   amount: '$400.00'   },
      { label: 'Utilities',   amount: '$120.00'   },
    ],
  },
  {
    title: 'Financial Goals',
    items: [
      { label: 'Emergency Fund', amount: '$200.00' },
      { label: 'Investments',    amount: '$300.00' },
    ],
  },
  {
    title: 'Lifestyle',
    items: [
      { label: 'Dining Out',    amount: '$150.00' },
      { label: 'Entertainment', amount: '$80.00'  },
      { label: 'Subscriptions', amount: '$45.00'  },
    ],
  },
];

// ── Builder ───────────────────────────────────────────────────────────────────
export function buildTierGroup(penpot, COLORS, { title, items }) {
  const { mkRect, mkBoard, mkText } = makeHelpers(penpot);

  // Dynamic height: header + one row per item + subtotal row + bottom padding
  const boardHeight =
    TIER_GROUP.HEADER_H +
    items.length * TIER_GROUP.ROW_H +
    TIER_GROUP.ROW_H +   // subtotal row
    TIER_GROUP.PADDING_Y;

  // ── 1. Container board ───────────────────────────────────────────────────────
  const board = mkBoard({
    name:   `Tier: ${title}`,
    width:  TIER_GROUP.WIDTH,
    height: boardHeight,
    fills:  [{ fillColor: COLORS.BG_SURFACE, fillOpacity: 1 }],
  });

  // ── 2. Header background strip ───────────────────────────────────────────────
  const headerBg = mkRect({
    name:   'header-bg',
    x:      0,
    y:      0,
    width:  TIER_GROUP.WIDTH,
    height: TIER_GROUP.HEADER_H,
    fills:  [{ fillColor: COLORS.BG_ELEVATED, fillOpacity: 1 }],
  });
  board.appendChild(headerBg);

  // ── 3. Title text ────────────────────────────────────────────────────────────
  const titleText = mkText(title, {
    name:       'title',
    x:          TIER_GROUP.PADDING_X,
    y:          TIER_GROUP.PADDING_Y + 8,
    fontSize:   TIER_GROUP.TITLE_FONT_SIZE,
    fontWeight: '600',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  });
  board.appendChild(titleText);

  // ── 4. Line-item rows ────────────────────────────────────────────────────────
  items.forEach((item, i) => {
    const rowY = TIER_GROUP.HEADER_H + i * TIER_GROUP.ROW_H + TIER_GROUP.PADDING_Y;

    const labelText = mkText(item.label, {
      name:       `item-label-${i}`,
      x:          TIER_GROUP.PADDING_X,
      y:          rowY,
      fontSize:   TIER_GROUP.ITEM_FONT_SIZE,
      fontWeight: '400',
      fills:      [{ fillColor: COLORS.TEXT_SECONDARY, fillOpacity: 1 }],
    });
    board.appendChild(labelText);

    const amountText = mkText(item.amount, {
      name:       `item-amount-${i}`,
      x:          TIER_GROUP.WIDTH - TIER_GROUP.AMOUNT_X_OFFSET,
      y:          rowY,
      fontSize:   TIER_GROUP.ITEM_FONT_SIZE,
      fontWeight: '400',
      fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
    });
    board.appendChild(amountText);
  });

  // ── 5. Divider line before subtotal ─────────────────────────────────────────
  const dividerY =
    TIER_GROUP.HEADER_H +
    items.length * TIER_GROUP.ROW_H +
    TIER_GROUP.PADDING_Y -
    TIER_GROUP.DIVIDER_Y_GAP;

  const divider = mkRect({
    name:   'divider',
    x:      TIER_GROUP.PADDING_X,
    y:      dividerY,
    width:  TIER_GROUP.WIDTH - TIER_GROUP.PADDING_X * 2,
    height: TIER_GROUP.DIVIDER_H,
    fills:  [{ fillColor: COLORS.BORDER_SUBTLE, fillOpacity: 1 }],
  });
  board.appendChild(divider);

  // ── 6. Subtotal row ──────────────────────────────────────────────────────────
  const subtotalY =
    TIER_GROUP.HEADER_H +
    items.length * TIER_GROUP.ROW_H +
    TIER_GROUP.PADDING_Y;

  const subtotal = mkText('Subtotal', {
    name:       'subtotal',
    x:          TIER_GROUP.PADDING_X,
    y:          subtotalY,
    fontSize:   TIER_GROUP.SUBTOTAL_FONT_SIZE,
    fontWeight: '600',
    fills:      [{ fillColor: COLORS.TEXT_PRIMARY, fillOpacity: 1 }],
  });
  board.appendChild(subtotal);

  return board;
}
