/**
 * S03 UAT — Dashboard Screen
 *
 * Preconditions:
 *   - Stack running: docker compose up -d (project root)
 *   - Seeded user exists (E2E_TEST_USER_EMAIL / REDACTED)
 *
 * Run: cd web && npx playwright test e2e/s03-dashboard.spec.ts
 *   Or: BASE_URL=http://192.168.68.12:3010 npx playwright test e2e/s03-dashboard.spec.ts
 *
 * Strategy:
 *   beforeAll seeds 3 known current-month transactions via the dev-only seed API
 *   (POST /api/test/seed with clearCurrentMonth:true for deterministic totals).
 *   afterAll removes the seeded rows by the IDs returned from the seed API.
 *
 * Seeded values:
 *   Income:  Employer / income      +$4,000.00
 *   Expense: Landlord / housing     −$1,500.00
 *   Expense: Grocery Store / food   −$500.00
 *   ─────────────────────────────────────────
 *   Total Income : $4,000.00
 *   Total Spent  : $2,000.00
 *   Remaining    : $2,000.00
 */

import { test, expect, type Page } from "@playwright/test"

const USER = { email: "E2E_TEST_USER_EMAIL", password: "REDACTED" }
const SEED_URL = "/api/test/seed"

// Build current-month ISO date strings dynamically so the spec stays valid
// across month boundaries.
function currentMonthDate(day: number): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}-${String(day).padStart(2, "0")}`
}

const SEED_ROWS = [
  { merchant: "Employer",      category: "income",  amount: "4000.00",  date: currentMonthDate(1) },
  { merchant: "Landlord",      category: "housing", amount: "-1500.00", date: currentMonthDate(5) },
  { merchant: "Grocery Store", category: "food",    amount: "-500.00",  date: currentMonthDate(10) },
]

async function signIn(page: Page): Promise<void> {
  await page.goto("/sign-in")
  await page.getByLabel("Email").fill(USER.email)
  await page.getByLabel("Password").fill(USER.password)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
}

// ─── UAT-01: Unauthenticated redirect (isolated, no session) ─────────────────

test("UAT-01: unauthenticated /dashboard redirects to /sign-in", async ({ page }) => {
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/sign-in/)
})

// ─── UAT-02 through UAT-05: serial tests sharing a signed-in page ─────────────

test.describe("Dashboard Screen (authenticated)", () => {
  test.describe.configure({ mode: "serial" })

  let pg!: Page
  let seededIds: number[] = []

  test.beforeAll(async ({ browser }) => {
    pg = await browser.newPage()
    await signIn(pg)

    // Seed known current-month transactions via the dev-only API.
    // clearCurrentMonth removes any pre-existing current-month rows so totals
    // are deterministic regardless of prior test runs or manual data.
    const res = await pg.request.post(SEED_URL, {
      data: { email: USER.email, rows: SEED_ROWS, clearCurrentMonth: true },
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    seededIds = body.ids as number[]
    expect(seededIds.length).toBe(SEED_ROWS.length)

    // Navigate to dashboard now that seed is in place
    await pg.goto("/dashboard")
    await expect(pg).toHaveURL(/\/dashboard/)
  })

  test.afterAll(async () => {
    // Remove only the rows we inserted — leaves other user data intact
    if (seededIds.length > 0) {
      await pg.request.delete(SEED_URL, { data: { ids: seededIds } })
    }
    await pg.close()
  })

  // ─── UAT-02: Page structure ───────────────────────────────────────────────

  test("UAT-02: dashboard renders heading and three stat card labels", async () => {
    await expect(pg.getByRole("heading", { name: "Dashboard" })).toBeVisible()
    await expect(pg.getByText("Total Income")).toBeVisible()
    await expect(pg.getByText("Total Spent")).toBeVisible()
    await expect(pg.getByText("Remaining")).toBeVisible()
    await expect(pg.getByRole("heading", { name: "Recent Transactions" })).toBeVisible()
  })

  // ─── UAT-03: Stat cards show seeded totals ────────────────────────────────

  test("UAT-03: stat cards show correct totals matching seeded transactions", async () => {
    // Total Income: $4,000.00 (1 positive row)
    const incomeCard = pg.locator("div").filter({ hasText: /^Total Income/ }).first()
    await expect(incomeCard.getByText("$4,000.00")).toBeVisible({ timeout: 5_000 })

    // Total Spent: $1,500.00 + $500.00 = $2,000.00
    const spentCard = pg.locator("div").filter({ hasText: /^Total Spent/ }).first()
    await expect(spentCard.getByText("$2,000.00")).toBeVisible({ timeout: 5_000 })

    // Remaining: $4,000.00 − $2,000.00 = $2,000.00
    const remainingCard = pg.locator("div").filter({ hasText: /^Remaining/ }).first()
    await expect(remainingCard.getByText("$2,000.00")).toBeVisible({ timeout: 5_000 })
  })

  // ─── UAT-04: Recent Transactions list shows seeded rows ───────────────────

  test("UAT-04: Recent Transactions list shows seeded merchants, categories, and amounts", async () => {
    const list = pg.getByRole("list")

    // All three seeded merchants must appear
    await expect(list.getByText("Employer")).toBeVisible()
    await expect(list.getByText("Landlord")).toBeVisible()
    await expect(list.getByText("Grocery Store")).toBeVisible()

    // Categories (lowercase, capitalized by CSS)
    await expect(list.getByText("income")).toBeVisible()
    await expect(list.getByText("housing")).toBeVisible()
    await expect(list.getByText("food")).toBeVisible()

    // Amounts: income with '+' prefix, expenses with '−' prefix
    await expect(list.getByText("+$4,000.00")).toBeVisible()
    await expect(list.getByText("−$1,500.00")).toBeVisible()
    await expect(list.getByText("−$500.00")).toBeVisible()
  })

  // ─── UAT-05: No NaN in rendered output ───────────────────────────────────

  test("UAT-05: no NaN appears anywhere in the dashboard output", async () => {
    await expect(pg.getByText(/NaN/)).not.toBeVisible()
  })
})
