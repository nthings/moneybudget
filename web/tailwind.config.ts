import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Backgrounds ─────────────────────────────────────────────────────
        bgApp:     '#0F1117',
        bgSurface: '#1A1D27',
        bgElevated:'#1E2130',
        bgHover:   '#252839',

        // ── Sidebar ──────────────────────────────────────────────────────────
        sidebarBg:          '#0D0F18',
        sidebarItemActive:  '#2A2D3E',
        sidebarItemHover:   '#1A1D27',

        // ── Typography ───────────────────────────────────────────────────────
        textPrimary:   '#FFFFFF',
        textSecondary: '#8B8FA8',
        textMuted:     '#4A4E63',

        // ── ZBB Counter States ───────────────────────────────────────────────
        budgetHealthy:   '#4CAF50',
        budgetWarning:   '#FFC107',
        budgetOverspent: '#F44336',

        // ── Accent / action ──────────────────────────────────────────────────
        accentBlue:   '#3B82F6',
        accentPurple: '#8B5CF6',

        // ── Borders ──────────────────────────────────────────────────────────
        borderSubtle: '#2A2D3E',
        borderMedium: '#363A52',
      },
    },
  },
  plugins: [],
}

export default config
