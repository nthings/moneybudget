/**
 * S01 UAT — Project Scaffold, Auth.js, and Drizzle Schema
 *
 * Preconditions:
 *   - Stack is running: `docker compose up -d` from project root
 *   - Seeded users exist (added by web/src/instrumentation.ts seed block or manually)
 *
 * Run: cd web && npx playwright test
 * Or:  cd web && BASE_URL=http://192.168.68.12:3010 npx playwright test
 */

import { test, expect } from "@playwright/test"

const USER = {
  email: "E2E_TEST_USER_EMAIL",
  password: "REDACTED",
}
const WRONG_PASSWORD = "wrongpassword"

// ─── UAT-01: Stack responds to HTTP ──────────────────────────────────────────

test("UAT-01: stack is up and sign-in page loads", async ({ page }) => {
  await page.goto("/sign-in")
  await expect(page).toHaveTitle(/MoneyBudget|moneybudget/i)
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
})

// ─── UAT-02: Unauthenticated redirect ────────────────────────────────────────

test("UAT-02: unauthenticated / redirects to /sign-in", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveURL(/\/sign-in/)
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
})

test("UAT-02b: unauthenticated /dashboard redirects to /sign-in", async ({
  page,
}) => {
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/sign-in/)
})

// ─── UAT-03: Sign-in with seeded credentials ─────────────────────────────────
// (Sign-up is disabled; seeded users are the canonical test accounts)

test("UAT-03: sign-in with valid credentials lands on /dashboard", async ({
  page,
}) => {
  await page.goto("/sign-in")
  await page.getByLabel("Email").fill(USER.email)
  await page.getByLabel("Password").fill(USER.password)
  await page.getByRole("button", { name: "Sign in" }).click()

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })

  // Sidebar present
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible()
  // All four nav items
  await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible()
  await expect(page.getByRole("link", { name: "The Allocator" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Transactions" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Piggy Banks" })).toBeVisible()
})

// ─── UAT-04: Session persists across reload ───────────────────────────────────

test("UAT-04: session persists after reload", async ({ page }) => {
  // Sign in first
  await page.goto("/sign-in")
  await page.getByLabel("Email").fill(USER.email)
  await page.getByLabel("Password").fill(USER.password)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })

  // Reload
  await page.reload()
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible()
})

// ─── UAT-05: Wrong password shows error, no redirect ─────────────────────────

test("UAT-05: wrong password shows error and stays on /sign-in", async ({
  page,
}) => {
  await page.goto("/sign-in")
  await page.getByLabel("Email").fill(USER.email)
  await page.getByLabel("Password").fill(WRONG_PASSWORD)
  await page.getByRole("button", { name: "Sign in" }).click()

  await expect(page).toHaveURL(/\/sign-in/)
  await expect(page.getByRole("alert").first()).toContainText(/invalid email or password/i)
})

// ─── UAT-06: Sidebar active-state per route ───────────────────────────────────

const routes = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/allocator", label: "The Allocator" },
  { href: "/transactions", label: "Transactions" },
  { href: "/piggy-banks", label: "Piggy Banks" },
]

for (const { href, label } of routes) {
  test(`UAT-06: sidebar highlights "${label}" on ${href}`, async ({ page }) => {
    // Sign in
    await page.goto("/sign-in")
    await page.getByLabel("Email").fill(USER.email)
    await page.getByLabel("Password").fill(USER.password)
    await page.getByRole("button", { name: "Sign in" }).click()
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })

    // Navigate to the target route
    await page.getByRole("link", { name: label }).click()
    await expect(page).toHaveURL(new RegExp(href))

    // The active link should have aria-current="page"
    await expect(
      page.getByRole("link", { name: label })
    ).toHaveAttribute("aria-current", "page")
  })
}
