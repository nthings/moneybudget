/**
 * S07 UAT — Income Entries Ledger
 *
 * Tests the income_entries CRUD flow on /allocator:
 *   - Empty state (no entries) → no NaN, empty-state copy, add form visible
 *   - Add first entry → appears in list
 *   - Add second entry → both visible
 *   - Delete entry → removed from list
 *   - Budget/Actual Balance cards never show NaN throughout
 *
 * Preconditions:
 *   - Stack running: docker compose up -d (project root)
 *   - User account exists (run S01 UAT or sign up first)
 *
 * Run: cd web && npx playwright test e2e/s07-income-ledger.spec.ts
 *   Or: BASE_URL=http://192.168.68.12:3010 npx playwright test e2e/s07-income-ledger.spec.ts
 */

import { test, expect, type Page } from "@playwright/test"

const USER = { email: "E2E_TEST_USER_EMAIL", password: "REDACTED" }

async function signIn(page: Page): Promise<void> {
  await page.goto("/sign-in")
  await page.getByLabel("Email").fill(USER.email)
  await page.getByLabel("Password").fill(USER.password)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
}

/** Returns a date string in YYYY-MM-DD format for the given day in the current month. */
function currentMonthDate(day: number): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

test.describe("Income Entries Ledger (/allocator)", () => {
  test.describe.configure({ mode: "serial" })

  // pg is assigned in beforeAll before any test in this describe block runs.
  // eslint-disable-next-line prefer-const
  let pg!: Page

  test.beforeAll(async ({ browser }) => {
    pg = await browser.newPage()
    await signIn(pg)
    await pg.goto("/allocator")
    await expect(pg).toHaveURL(/\/allocator/)

    // ── Cleanup: delete all pre-existing income entries ────────────────────
    // aria-label starts with "Delete income entry:" — force:true bypasses
    // the opacity-0 group-hover visibility gate.
    const deleteButtons = pg.getByRole("button", { name: /^Delete income entry:/i })
    let count = await deleteButtons.count()
    while (count > 0) {
      await deleteButtons.first().click({ force: true })
      await expect(deleteButtons).toHaveCount(count - 1, { timeout: 5_000 })
      count -= 1
    }
  })

  test.afterAll(async () => {
    await pg.close()
  })

  // ─── UAT-S07-01: Empty state ──────────────────────────────────────────────

  test("UAT-S07-01: empty income state renders without NaN or crash", async () => {
    // Empty-state copy
    await expect(pg.getByText(/No income recorded this month/)).toBeVisible()
    // Add form is still accessible
    await expect(
      pg.getByPlaceholder("Description (e.g. Salary, Freelance)"),
    ).toBeVisible()
    // No NaN anywhere on the page
    await expect(pg.locator("body")).not.toContainText("NaN")
  })

  // ─── UAT-S07-02: Add first income entry ────────────────────────────────────

  test("UAT-S07-02: add first entry — appears in list", async () => {
    await pg
      .getByPlaceholder("Description (e.g. Salary, Freelance)")
      .fill("Salary Aug 1st")
    await pg.getByPlaceholder("0.00").fill("2500")
    await pg.locator('input[type="date"]').fill(currentMonthDate(1))
    await pg.getByRole("button", { name: "Add" }).click()

    await expect(pg.getByText("Income entry added.")).toBeVisible({ timeout: 5_000 })
    await expect(pg.getByText("Salary Aug 1st")).toBeVisible()
    await expect(pg.locator("body")).not.toContainText("NaN")
  })

  // ─── UAT-S07-03: Add second entry — both visible, counter accumulates ──────

  test("UAT-S07-03: add second entry — both entries visible in list", async () => {
    await pg
      .getByPlaceholder("Description (e.g. Salary, Freelance)")
      .fill("Freelance Aug 5th")
    await pg.getByPlaceholder("0.00").fill("800")
    await pg.locator('input[type="date"]').fill(currentMonthDate(5))
    await pg.getByRole("button", { name: "Add" }).click()

    await expect(pg.getByText("Income entry added.")).toBeVisible({ timeout: 5_000 })
    await expect(pg.getByText("Freelance Aug 5th")).toBeVisible()
    await expect(pg.getByText("Salary Aug 1st")).toBeVisible()
    await expect(pg.locator("body")).not.toContainText("NaN")
  })

  // ─── UAT-S07-04: Delete entry — removed from list ─────────────────────────

  test("UAT-S07-04: delete an entry — removed from list, other entry remains", async () => {
    const freelanceRow = pg.locator("li").filter({ hasText: "Freelance Aug 5th" })
    await freelanceRow.hover()
    await freelanceRow
      .getByRole("button", { name: /Delete income entry: Freelance Aug 5th/i })
      .click({ force: true })

    await expect(pg.getByText("Freelance Aug 5th")).not.toBeVisible({ timeout: 5_000 })
    // Salary entry still present
    await expect(pg.getByText("Salary Aug 1st")).toBeVisible()
    await expect(pg.locator("body")).not.toContainText("NaN")
  })

  // ─── UAT-S07-05: ZBB counter cards free of NaN ────────────────────────────

  test("UAT-S07-05: Budget Balance and Actual Balance cards show without NaN", async () => {
    await expect(pg.getByText("Budget Balance")).toBeVisible()
    await expect(pg.getByText("Actual Balance")).toBeVisible()
    await expect(pg.locator("body")).not.toContainText("NaN")
  })
})
