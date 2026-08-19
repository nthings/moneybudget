/**
 * S04 UAT — Transaction Review Screen
 *
 * Preconditions:
 *   - Stack running: docker compose up -d (project root)
 *   - Seeded user exists (E2E_TEST_USER_EMAIL / REDACTED)
 *
 * Run: cd web && npx playwright test e2e/s04-transactions.spec.ts
 *   Or: BASE_URL=http://192.168.68.12:3010 npx playwright test e2e/s04-transactions.spec.ts
 *
 * Strategy:
 *   beforeAll seeds a deterministic state:
 *     - clears all current-month transactions via the dev-only seed API
 *     - sets income to $3,000 on /allocator for deterministic ZBB math
 *   afterAll removes any rows we seeded + those added via the form.
 *
 * ZBB math (S04 scope):
 *   Income       : $3,000.00 (set in beforeAll)
 *   Expense added: −$42.50  (Whole Foods / Groceries)
 *   Actual Balance: $3,000.00 − $42.50 = $2,957.50
 */

import { test, expect, type Page } from "@playwright/test"

const USER = { email: process.env.E2E_USER_EMAIL ?? "test@test.com", password: process.env.E2E_USER_PASSWORD ?? "12345" }
const SEED_URL = "/api/test/seed"

function currentMonthDate(day: number): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}-${String(day).padStart(2, "0")}`
}

// Today's date in YYYY-MM-DD (matches <input type="date"> defaultValue in AddTransactionForm)
const TODAY = currentMonthDate(new Date().getDate())

async function signIn(page: Page): Promise<void> {
  await page.goto("/sign-in")
  await page.getByLabel("Email").fill(USER.email)
  await page.getByLabel("Password").fill(USER.password)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
}

// ─── UAT-01: Unauthenticated redirect (isolated, no session) ─────────────────

test("UAT-01: unauthenticated /transactions redirects to /sign-in", async ({ page }) => {
  await page.goto("/transactions")
  await expect(page).toHaveURL(/\/sign-in/)
})

// ─── UAT-02 through UAT-08: serial tests sharing a signed-in page ─────────────

test.describe("Transaction Review Screen (authenticated)", () => {
  test.describe.configure({ mode: "serial" })

  let pg!: Page
  // IDs of rows seeded via the API for afterAll cleanup
  let seededIds: number[] = []
  // IDs added via the UI form — tracked so afterAll deletes them
  let formAddedIds: number[] = []

  test.beforeAll(async ({ browser }) => {
    pg = await browser.newPage()
    await signIn(pg)

    // ── Set known income ($3,000) via IncomeLedger on /allocator ──────────
    // S07 replaced the flat IncomeInput with IncomeLedger (income_entries).
    await pg.goto("/allocator")
    await expect(pg).toHaveURL(/\/allocator/)

    // Clear any pre-existing income entries so the $3,000 total is exact.
    const existingDeleteBtns = pg.getByRole("button", { name: /^Delete income entry:/i })
    let incomeCount = await existingDeleteBtns.count()
    while (incomeCount > 0) {
      await existingDeleteBtns.first().click({ force: true })
      await expect(existingDeleteBtns).toHaveCount(incomeCount - 1, { timeout: 5_000 })
      incomeCount -= 1
    }

    // Add a single $3,000 income entry.
    await pg.getByPlaceholder("Description (e.g. Salary, Freelance)").fill("Test Salary")
    await pg.locator('input[type="text"][name="amount"]').fill("3000")
    await pg.getByRole("button", { name: "Add", exact: true }).click()
    await expect(pg.getByText("Income entry added.")).toBeVisible({ timeout: 5_000 })

    // ── Clear current-month transactions for deterministic state ─────────
    // Seed a single placeholder row with clearCurrentMonth:true, then remove it.
    const res = await pg.request.post(SEED_URL, {
      data: {
        email: USER.email,
        rows: [{ merchant: "Setup", category: "Income", amount: "0.01", date: currentMonthDate(1) }],
        clearCurrentMonth: true,
      },
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    const placeholderIds: number[] = body.ids as number[]
    // Immediately remove the placeholder
    if (placeholderIds.length > 0) {
      await pg.request.delete(SEED_URL, { data: { ids: placeholderIds } })
    }

    // Navigate to the transactions page to start tests
    await pg.goto("/transactions")
    await expect(pg).toHaveURL(/\/transactions/)
  })

  test.afterAll(async () => {
    // Clean up anything seeded via the API
    const allIds = [...seededIds, ...formAddedIds]
    if (allIds.length > 0) {
      await pg.request.delete(SEED_URL, { data: { ids: allIds } })
    }
    await pg.close()
  })

  // ─── UAT-02: Page structure ───────────────────────────────────────────────

  test("UAT-02: /transactions renders heading, add form, and empty-state message", async () => {
    await expect(pg.getByRole("heading", { name: "Transactions" })).toBeVisible()
    await expect(pg.getByRole("heading", { name: "Add Transaction" })).toBeVisible()

    // Form fields
    await expect(pg.getByLabel("Merchant")).toBeVisible()
    await expect(pg.getByLabel("Category", { exact: true })).toBeVisible()
    await expect(pg.getByLabel("Amount", { exact: false })).toBeVisible()
    await expect(pg.getByLabel("Date")).toBeVisible()
    await expect(pg.getByRole("button", { name: "Add Transaction" })).toBeVisible()

    // Filter controls (rendered even when table is empty)
    await expect(pg.getByLabel("Search transactions")).toBeVisible()
    await expect(pg.getByLabel("Filter by category")).toBeVisible()

    // Empty-state message (no transactions seeded)
    await expect(pg.getByText("No transactions yet. Add your first transaction above.")).toBeVisible()
  })

  // ─── UAT-03: Add transaction via form → appears in table ─────────────────

  test("UAT-03: adding a transaction via the form shows it in the table", async () => {
    // Fill the form
    await pg.getByLabel("Merchant").fill("Whole Foods")
    await pg.getByLabel("Category", { exact: true }).selectOption("Groceries")
    await pg.getByLabel("Amount", { exact: false }).fill("-42.50")
    // Date defaults to today; confirm it has the expected value
    await expect(pg.getByLabel("Date")).toHaveValue(TODAY)

    await pg.getByRole("button", { name: "Add Transaction" }).click()

    // Success message appears
    await expect(pg.getByText("Transaction added!")).toBeVisible({ timeout: 5_000 })

    // Form resets (formKey counter): merchant field goes back to empty
    await expect(pg.getByLabel("Merchant")).toHaveValue("", { timeout: 5_000 })

    // New row appears in the table
    await expect(pg.getByRole("cell", { name: "Whole Foods", exact: true })).toBeVisible({ timeout: 5_000 })
    await expect(pg.getByRole("cell", { name: "Groceries", exact: true })).toBeVisible()
    // Amount formatted as expense: −$42.50 (unicode minus)
    await expect(pg.getByRole("cell", { name: "−$42.50" })).toBeVisible()

    // Capture the transaction ID for afterAll cleanup by reading the hidden input
    // in the delete form rendered for the Whole Foods row.
    const hiddenId = pg.locator(`input[name="id"]`).first()
    const idStr = await hiddenId.getAttribute("value")
    if (idStr) formAddedIds.push(parseInt(idStr, 10))
  })

  // ─── UAT-04: Dashboard stat cards reflect the new expense ────────────────

  test("UAT-04: dashboard stat cards show Total Spent matching added expense", async () => {
    await pg.goto("/dashboard")
    await expect(pg).toHaveURL(/\/dashboard/)

    // Total Spent: $42.50 from the single expense we added
    const spentCard = pg.locator("div").filter({ hasText: /^Total Spent/ }).first()
    await expect(spentCard.getByText("$42.50")).toBeVisible({ timeout: 5_000 })

    // Navigate back to transactions for subsequent tests
    await pg.goto("/transactions")
    await expect(pg).toHaveURL(/\/transactions/)
  })

  // ─── UAT-05: ZBB Actual Balance reflects current-month expenses ───────────

  test("UAT-05: /allocator Actual Balance = income − totalActuals ($3,000 − $42.50)", async () => {
    await pg.goto("/allocator")
    await expect(pg).toHaveURL(/\/allocator/)

    // Actual Balance: $3,000.00 (income) − $42.50 (expense) = $2,957.50
    const actualCard = pg.locator("div").filter({ hasText: /^Actual Balance/ }).first()
    await expect(actualCard.getByText("$2,957.50")).toBeVisible({ timeout: 5_000 })

    // No NaN in the ZBB counters
    await expect(pg.getByText(/NaN/)).not.toBeVisible()

    // Navigate back for subsequent tests
    await pg.goto("/transactions")
    await expect(pg).toHaveURL(/\/transactions/)
  })

  // ─── UAT-06: Delete transaction → removed from table ─────────────────────

  test("UAT-06: deleting a transaction removes it from the table", async () => {
    // Verify it's present first
    await expect(pg.getByRole("cell", { name: "Whole Foods", exact: true })).toBeVisible()

    // Click the delete button for this row
    await pg.getByRole("button", { name: /Delete transaction at Whole Foods/ }).click()

    // Row disappears after RSC revalidation
    await expect(pg.getByRole("cell", { name: "Whole Foods", exact: true })).not.toBeVisible({ timeout: 5_000 })

    // Empty-state message returns
    await expect(pg.getByText("No transactions yet. Add your first transaction above.")).toBeVisible()

    // Remove from afterAll tracking (already deleted)
    formAddedIds = formAddedIds.filter((id) => id !== formAddedIds[formAddedIds.length - 1])
  })

  // ─── UAT-07: Category dropdown filter narrows the table ──────────────────

  test("UAT-07: category filter shows only matching rows; 'All categories' restores all", async () => {
    // Seed three rows via the API: 2 Groceries, 1 Dining
    const rows = [
      { merchant: "Trader Joe's",   category: "Groceries", amount: "-30.00", date: currentMonthDate(2) },
      { merchant: "Whole Foods",    category: "Groceries", amount: "-55.00", date: currentMonthDate(3) },
      { merchant: "Shake Shack",    category: "Dining",    amount: "-18.75", date: currentMonthDate(4) },
    ]
    const res = await pg.request.post(SEED_URL, { data: { email: USER.email, rows } })
    expect(res.status()).toBe(200)
    const body = await res.json()
    seededIds.push(...(body.ids as number[]))

    // Reload so the RSC picks up the seeded rows
    await pg.reload()
    await expect(pg.getByRole("cell", { name: "Shake Shack", exact: true })).toBeVisible({ timeout: 5_000 })

    // ── Filter to Groceries ──────────────────────────────────────────────
    await pg.getByLabel("Filter by category").selectOption("Groceries")

    // Both grocery rows visible
    await expect(pg.getByRole("cell", { name: "Trader Joe's", exact: true })).toBeVisible()
    await expect(pg.getByRole("cell", { name: "Whole Foods", exact: true })).toBeVisible()

    // Dining row hidden
    await expect(pg.getByRole("cell", { name: "Shake Shack", exact: true })).not.toBeVisible()

    // Row count label reflects filter
    await expect(pg.getByText(/Showing 2 of 3 transactions/)).toBeVisible()

    // ── Reset to All categories ──────────────────────────────────────────
    await pg.getByLabel("Filter by category").selectOption("all")
    await expect(pg.getByRole("cell", { name: "Shake Shack", exact: true })).toBeVisible()
    await expect(pg.getByText(/Showing 3 of 3 transactions/)).toBeVisible()
  })

  // ─── UAT-08: Search text filter narrows by merchant name ─────────────────

  test("UAT-08: search input filters by merchant name (case-insensitive)", async () => {
    // Search for "whole" — should match "Whole Foods" only
    await pg.getByLabel("Search transactions").fill("whole")

    await expect(pg.getByRole("cell", { name: "Whole Foods", exact: true })).toBeVisible()
    await expect(pg.getByRole("cell", { name: "Trader Joe's", exact: true })).not.toBeVisible()
    await expect(pg.getByRole("cell", { name: "Shake Shack", exact: true })).not.toBeVisible()
    await expect(pg.getByText(/Showing 1 of 3 transactions/)).toBeVisible()

    // Clear search — all rows return
    await pg.getByLabel("Search transactions").fill("")
    await expect(pg.getByRole("cell", { name: "Trader Joe's", exact: true })).toBeVisible()
    await expect(pg.getByText(/Showing 3 of 3 transactions/)).toBeVisible()
  })

  // ─── UAT-09: No NaN in rendered output ───────────────────────────────────

  test("UAT-09: no NaN appears anywhere in the transactions page output", async () => {
    await expect(pg.getByText(/NaN/)).not.toBeVisible()
  })
})
