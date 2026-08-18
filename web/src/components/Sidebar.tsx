"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOutUser } from "@/actions/auth"

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    shortLabel: "Home",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/allocator",
    label: "The Allocator",
    shortLabel: "Allocator",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2v20M2 12h20" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    href: "/transactions",
    label: "Transactions",
    shortLabel: "Spend",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/piggy-banks",
    label: "Piggy Banks",
    shortLabel: "Save",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M19 9a7 7 0 1 0-14 0c0 2.1.92 3.98 2.38 5.28L7 21h10l-.38-6.72A7 7 0 0 0 19 9z"
          strokeLinejoin="round"
        />
        <path d="M12 9v4M10 13h4" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* ── Desktop sidebar (hidden on mobile) ─────────────────────────────── */}
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col bg-sidebarBg border-r border-borderSubtle">
        {/* Logo / wordmark */}
        <div className="px-6 py-5 border-b border-borderSubtle">
          <span className="text-textPrimary font-semibold tracking-tight text-lg">
            moneybudget
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebarItemActive text-textPrimary"
                    : "text-textSecondary hover:bg-sidebarItemHover hover:text-textPrimary",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer — sign out + version */}
        <div className="px-3 py-4 border-t border-borderSubtle space-y-1">
          <form action={signOutUser}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-textSecondary hover:bg-sidebarItemHover hover:text-textPrimary transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sign out
            </button>
          </form>
          <p className="text-textMuted text-xs px-3 pt-1">MoneyBudget v0.1</p>
        </div>
      </aside>

      {/* ── Mobile bottom navigation (hidden on desktop) ────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 flex bg-sidebarBg border-t border-borderSubtle pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-textPrimary"
                  : "text-textSecondary hover:text-textPrimary",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
              <span>{item.shortLabel}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
