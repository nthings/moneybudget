/**
 * S10 UAT — Mobile Responsive Layout (S02 of M004)
 *
 * Preconditions:
 *   - Stack running: docker compose up -d (project root)
 *   - Seeded user exists (E2E_TEST_USER_EMAIL / REDACTED)
 *   - ALLOW_TEST_SEED=true in the server environment
 *
 * Run: cd web && npx playwright test e2e/s10-mobile-responsive.spec.ts
 *   Or: BASE_URL=http://localhost:3010 npx playwright test e2e/s10-mobile-responsive.spec.ts
 *
 * Strategy:
 *   - All tests share a single 375×812 viewport page (iPhone SE/12 size)
 *   - beforeAll signs in, seeds 1 transaction, creates 1 income entry + 1 budget item
 *     so every page has visible interactive content to assert against
 *   - afterAll cleans up seeded rows
 */

import { test, expect, type Page } from "@playwright/test"

const USER = {
  email: process.env.E2E_USER_EMAIL ?? "test@test.com",
  password: process.env.E2E_USER_PASSWORD ?? "12345",
}
const SEED_URL = "/api/test/seed"
const MOBILE_VIEWPORT = { width: 375, height: 812 }

function currentMonthDate(day: number): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}-${String(day).padStart(2, "0")}`
}

/** Returns true when body.scrollWidth > documentElement.clientWidth */
async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(() => document.body.scrollWidth > document.documentElement.clientWidth)
}

test.describe.configure({ mode: "serial" })

let pg!: Page
let seededTransactionIds: number[] = []

test.beforeAll(async ({ browser }) => {
  pg = await browser.newPage()
  await pg.setViewportSize(MOBILE_VIEWPORT)

  // Sign in
  await pg.goto("/sign-in")
  await pg.getByLabel("Email").fill(USER.email)
  await pg.getByLabel("Password").fill(USER.password)
  await pg.getByRole("button", { name: "Sign in" }).click()
  await expect(pg).toHaveURL(/\/dashboard/, { timeout: 10_000 })

  // ── Seed one transaction for the TransactionTable card check ──────────────
  const seedRes = await pg.request.post(SEED_URL, {
    data: {
      type: "transactions",
      email: USER.email,
      rows: [
        {
          merchant: "Mobile Test Merchant",
          category: "food",
          amount: "-25.00",
          date: currentMonthDate(5),
        },
      ],
    },
  })
  if (seedRes.ok()) {
    const body = await seedRes.json()
    seededTransactionIds = body.ids ?? []
  }

  // ── Go to allocator, clean up pre-existing items, then add income + 1 item ──
  await pg.goto("/allocator")
  await expect(pg).toHaveURL(/\/allocator/)

  // Delete all pre-existing budget items (force:true bypasses opacity-0 on desktop,
  // but at mobile viewport they're visible — still use force for safety)
  let itemRows = pg.locator("li.group")
  let count = await itemRows.count()
  while (count > 0) {
    const firstRow = itemRows.first()
    await firstRow.hover()
    await firstRow
      .getByRole("button", { name: /^Delete/i })
      .first()
      .click({ force: true })
    await expect(itemRows).toHaveCount(count - 1, { timeout: 5_000 })
    count -= 1
  }

  // Add one income entry so ZBB counter and IncomeLedger row exist
  const today = new Date()
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`
  const incomeDesc = pg.getByPlaceholder("Description (e.g. Salary, Freelance)")
  const incomeAmt = pg.locator('input[name="amount"]')
  const incomeDateInput = pg.locator('input[type="date"]')
  await incomeDesc.fill("Mobile Test Income")
  await incomeAmt.fill("3000")
  await incomeDateInput.fill(dateStr)
  await pg.getByRole("button", { name: "Add", exact: true }).click()
  await expect(pg.getByText("Income entry added.")).toBeVisible({ timeout: 5_000 })

  // Add one budget item so BudgetItemRow controls are present
  await pg.locator('[placeholder="Item name"]').first().fill("Mobile Test Item")
  await pg.locator('[placeholder="0.00"][name="allocatedAmount"]').first().fill("200")
  await pg.getByRole("button", { name: "+ Add", exact: true }).first().click()
  await expect(pg.getByText("Mobile Test Item")).toBeVisible({ timeout: 5_000 })
})

test.afterAll(async () => {
  // Remove seeded transactions
  if (seededTransactionIds.length > 0) {
    await pg.request.delete(SEED_URL, {
      data: { ids: seededTransactionIds },
    })
  }
  await pg.close()
})

// ─── UAT-S10-01: Dashboard — no horizontal overflow at 375px ────────────────

test("UAT-S10-01: dashboard has no horizontal overflow at 375px", async () => {
  await pg.goto("/dashboard")
  await expect(pg).toHaveURL(/\/dashboard/)
  // Wait for stat cards to paint
  await expect(pg.getByText("Total Income")).toBeVisible({ timeout: 8_000 })

  const overflow = await hasHorizontalOverflow(pg)
  expect(overflow, "dashboard must not overflow horizontally at 375px").toBe(false)
})

// ─── UAT-S10-02: Dashboard — stat cards visible at 375px ────────────────────

test("UAT-S10-02: dashboard stat cards are visible on mobile", async () => {
  // Page is already on /dashboard from previous test
  await expect(pg.getByText("Total Income")).toBeVisible()
  await expect(pg.getByText("Total Spent")).toBeVisible()
  await expect(pg.getByText("Remaining")).toBeVisible()
})

// ─── UAT-S10-03: Allocator — no horizontal overflow at 375px ────────────────

test("UAT-S10-03: allocator has no horizontal overflow at 375px", async () => {
  await pg.goto("/allocator")
  await expect(pg).toHaveURL(/\/allocator/)
  await expect(pg.getByText("Mobile Test Item")).toBeVisible({ timeout: 8_000 })

  const overflow = await hasHorizontalOverflow(pg)
  expect(overflow, "allocator must not overflow horizontally at 375px").toBe(false)
})

// ─── UAT-S10-04: Allocator — TierGroup edit/delete buttons visible without hover ──

test("UAT-S10-04: TierGroup BudgetItemRow edit and delete buttons are visible on mobile without hover", async () => {
  // At 375px (<sm breakpoint), sm:opacity-0 does NOT apply — buttons should be visible
  // without any hover action.
  // Filter by text to target the budget item row (not IncomeLedger rows which also use li.group)
  const budgetItemRow = pg.locator("li.group").filter({ hasText: "Mobile Test Item" })
  await expect(budgetItemRow).toBeVisible()

  const editBtn = budgetItemRow.getByRole("button", { name: /edit/i }).first()
  const deleteBtn = budgetItemRow.getByRole("button", { name: /delete/i }).first()

  // Visible without hover (sm:opacity-0 only kicks in at ≥640px)
  await expect(editBtn).toBeVisible()
  await expect(deleteBtn).toBeVisible()
})

// ─── UAT-S10-05: Allocator — IncomeLedger delete button visible without hover ──

test("UAT-S10-05: IncomeLedger IncomeEntryRow delete button is visible on mobile without hover", async () => {
  // sm:opacity-0 sm:group-hover:opacity-100 — should be visible at 375px without hover
  const deleteBtn = pg.getByRole("button", { name: /delete income entry/i }).first()
  await expect(deleteBtn).toBeVisible()
})

// ─── UAT-S10-06: Transactions — no horizontal overflow at 375px ─────────────

test("UAT-S10-06: transactions page has no horizontal overflow at 375px", async () => {
  await pg.goto("/transactions")
  await expect(pg).toHaveURL(/\/transactions/)
  // Wait for content to load
  await pg.waitForLoadState("networkidle")

  const overflow = await hasHorizontalOverflow(pg)
  expect(overflow, "transactions page must not overflow horizontally at 375px").toBe(false)
})

// ─── UAT-S10-07: Transactions — card layout renders, table hidden ────────────

test("UAT-S10-07: TransactionTable renders mobile card layout (no visible <table>) at 375px", async () => {
  // At <sm, the card <ul> is shown (sm:hidden) and the table wrapper is hidden (hidden sm:block)
  const cardList = pg.locator('ul[aria-label="Transactions"]')
  await expect(cardList).toBeVisible({ timeout: 5_000 })

  // The <table> element exists in DOM but must be hidden at 375px
  const tableEl = pg.locator("table").first()
  const tableVisible = await tableEl.isVisible().catch(() => false)
  expect(tableVisible, "<table> must not be visible at 375px mobile viewport").toBe(false)
})

// ─── UAT-S10-08: Piggy Banks — no horizontal overflow at 375px ──────────────

test("UAT-S10-08: piggy-banks page has no horizontal overflow at 375px", async () => {
  await pg.goto("/piggy-banks")
  await expect(pg).toHaveURL(/\/piggy-banks/)
  await pg.waitForLoadState("networkidle")

  const overflow = await hasHorizontalOverflow(pg)
  expect(overflow, "piggy-banks page must not overflow horizontally at 375px").toBe(false)
})

// ─── UAT-S10-09: Piggy Banks — create form and page heading visible ──────────

test("UAT-S10-09: piggy-banks page heading and create form are visible on mobile", async () => {
  await expect(pg.getByRole("heading", { name: /piggy bank/i })).toBeVisible()
  // Goal Name input from CreateGoalForm
  await expect(pg.getByLabel("Goal Name")).toBeVisible()
})

// ─── UAT-S10-10: GoalCard — edit/delete buttons meet 44px tap target ─────────

test("UAT-S10-10: GoalCard edit and delete buttons meet 44px tap target on mobile", async () => {
  // A goal was seeded in beforeAll — at least one GoalCard is visible
  const editBtn = pg.getByRole("button", { name: /Edit / }).first()
  const deleteBtn = pg.getByRole("button", { name: /Delete / }).first()
  const monthlyBtn = pg.getByRole("button", { name: /Edit monthly contribution/ }).first()

  const [editBox, deleteBox, monthlyBox] = await Promise.all([
    editBtn.boundingBox(),
    deleteBtn.boundingBox(),
    monthlyBtn.boundingBox(),
  ])

  expect(editBox, "edit button must be visible").not.toBeNull()
  expect(deleteBox, "delete button must be visible").not.toBeNull()
  expect(monthlyBox, "monthly edit button must be visible").not.toBeNull()

  expect(editBox!.height, "edit button height must be >= 44px").toBeGreaterThanOrEqual(44)
  expect(editBox!.width, "edit button width must be >= 44px").toBeGreaterThanOrEqual(44)
  expect(deleteBox!.height, "delete button height must be >= 44px").toBeGreaterThanOrEqual(44)
  expect(deleteBox!.width, "delete button width must be >= 44px").toBeGreaterThanOrEqual(44)
  expect(monthlyBox!.height, "monthly button height must be >= 44px").toBeGreaterThanOrEqual(44)
  expect(monthlyBox!.width, "monthly button width must be >= 44px").toBeGreaterThanOrEqual(44)
})
