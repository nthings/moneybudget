/**
 * MoneyBudget color tokens.
 * Mirrors the design tokens that will be used in the final app.
 * Stored in penpot.storage under the key "colors" by the setup script.
 */
export const COLORS = {
  // ── Backgrounds ────────────────────────────────────────────────────────────
  BG_APP:      '#0F1117',   // root app background
  BG_SURFACE:  '#1A1D27',   // card / panel surface
  BG_ELEVATED: '#1E2130',   // elevated card
  BG_HOVER:    '#252839',   // interactive hover state

  // ── Sidebar ─────────────────────────────────────────────────────────────────
  SIDEBAR_BG:          '#0D0F18',
  SIDEBAR_ITEM_ACTIVE: '#2A2D3E',
  SIDEBAR_ITEM_HOVER:  '#1A1D27',

  // ── Typography ──────────────────────────────────────────────────────────────
  TEXT_PRIMARY:   '#FFFFFF',
  TEXT_SECONDARY: '#8B8FA8',
  TEXT_MUTED:     '#4A4E63',

  // ── ZBB Counter States ───────────────────────────────────────────────────────
  BUDGET_HEALTHY:   '#4CAF50',  // green  — fully allocated, positive balance
  BUDGET_WARNING:   '#FFC107',  // yellow — within 5 % of zero
  BUDGET_OVERSPENT: '#F44336',  // red    — balance is negative

  // ── Accent / action ──────────────────────────────────────────────────────────
  ACCENT_BLUE:   '#3B82F6',
  ACCENT_PURPLE: '#8B5CF6',

  // ── Borders ──────────────────────────────────────────────────────────────────
  BORDER_SUBTLE: '#2A2D3E',
  BORDER_MEDIUM: '#363A52',
};
