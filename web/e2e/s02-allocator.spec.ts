/**
 * S02 UAT — The Allocator Screen and ZBB Counter
 *
 * Preconditions:
 *   - Stack running: docker compose up -d (project root)
 *   - Seeded user exists (run S01 UAT or wait for instrumentation seed on first boot)
 *
 * Run: cd web && npx playwright test e2e/s02-allocator.spec.ts
 *   Or: BASE_URL=http://192.168.68.12:3010 npx playwright test e2e/s02-allocator.spec.ts
 *
 * NOTE: UAT-03 income section (IncomeInput) is replaced in S07 by IncomeLedger.
 * Update beforeAll and UAT-03 when S07 ships.
 *
 * ZBB state semantics (from zbb.ts):
 *   healthy  ("On Track")    — 0–10% of income remains unallocated (well-balanced)
 *   warning  ("Unallocated") — >10% unallocated (dollars still need assigning)
 *   overspent("Over Budget") — allocations exceed income (negative balance)
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

// ─── UAT-01: Auth redirect (isolated, no session) ────────────────────────────

test("UAT-01: unauthenticated /allocator redirects to /sign-in", async ({ page }) => {
  await page.goto("/allocator")
  await expect(page).toHaveURL(/\/sign-in/)
})

// ─── UAT-02 through UAT-09: serial tests sharing a signed-in page ─────────────
//
// Each test builds on the prior state.  beforeAll signs in, removes any leftover
// items from previous runs, and sets income to $5,000 for deterministic math.

test.describe("Allocator Screen (authenticated)", () => {
  test.describe.configure({ mode: "serial" })

  // pg is assigned in beforeAll before any test in this describe block runs.
  // eslint-disable-next-line prefer-const
  let pg!: Page

  test.beforeAll(async ({ browser }) => {
    pg = await browser.newPage()
    await signIn(pg)
    await pg.goto("/allocator")
    await expect(pg).toHaveURL(/\/allocator/)

    // ── Cleanup: delete all pre-existing budget items ──────────────────────
    // BudgetItemRow renders <li class="... group"> with aria-label delete buttons.
    // Buttons are CSS opacity-0 until the li is hovered; force:true bypasses
    // Playwright's actionability check without triggering mouseover.
    let itemRows = pg.locator("li.group")
    let count = await itemRows.count()
    while (count > 0) {
      const firstRow = itemRows.first()
      await firstRow.hover()
      await firstRow
        .getByRole("button", { name: /^Delete /i })
        .click({ force: true })
      // Wait for RSC revalidation to remove the row
      await expect(itemRows).toHaveCount(count - 1, { timeout: 5_000 })
      count -= 1
    }

    // ── Set known income ($5,000) ──────────────────────────────────────────
    // NOTE: replaced in S07 by the IncomeLedger add-entry form.
    await pg.getByLabel("Monthly income").fill("5000")
    await pg.getByRole("button", { name: "Set Income" }).click()
    await expect(pg.getByText("Income updated.")).toBeVisible({ timeout: 5_000 })
  })

  test.afterAll(async () => {
    await pg.close()
  })

  // ── Shared helper: add an item to the Essential Needs tier (first group) ──

  async function addItem(label: string, amount: string): Promise<void> {
    await pg.locator('[placeholder="Item name"]').first().fill(label)
    await pg.locator('[placeholder="0.00"]').first().fill(amount)
    await pg.getByRole("button", { name: "+ Add" }).first().click()
    // Wait for the new item row to appear after RSC revalidation
    await expect(
      pg.locator("li.group").filter({ hasText: label }),
    ).toBeVisible({ timeout: 5_000 })
  }

  // ─── UAT-02: Page structure ───────────────────────────────────────────────

  test("UAT-02: allocator renders tier groups, ZBB counter cards, and income form", async () => {
    await expect(pg.getByRole("heading", { name: "The Allocator" })).toBeVisible()
    for (const tier of ["Essential Needs", "Financial Goals", "Lifestyle"]) {
      await expect(pg.getByText(tier)).toBeVisible()
    }
    await expect(pg.getByText("Budget Balance")).toBeVisible()
    await expect(pg.getByText("Actual Balance")).toBeVisible()
    await expect(pg.getByLabel("Monthly income")).toBeVisible()
  })

  // ─── UAT-03: Zero allocations — warning state ─────────────────────────────
  // ZBB: having 100% unallocated is a warning — assign every dollar.

  test("UAT-03: zero allocations — Budget Balance shows income with Unallocated state", async () => {
    // Both counter cards show $5,000 (totalAllocations = 0, totalActuals = 0)
    await expect(pg.getByText("$5,000.00").first()).toBeVisible({ timeout: 5_000 })
    // 100% remaining > WARNING_THRESHOLD_PCT (10%) → warning → "Unallocated"
    await expect(pg.getByText("Unallocated").first()).toBeVisible()
  })

  // ─── UAT-04: Add budget item — counter decreases ──────────────────────────

  test("UAT-04: adding a budget item deducts from the Budget Balance", async () => {
    await addItem("Rent", "1500")
    // $5,000 − $1,500 = $3,500 (70% remaining → still "Unallocated")
    await expect(pg.getByText("$3,500.00")).toBeVisible({ timeout: 5_000 })
    await expect(pg.getByText("Unallocated").first()).toBeVisible()
  })

  // ─── UAT-05a: Well-allocated — healthy "On Track" state ───────────────────
  // Healthy = 0–10% of income unallocated. Must reach this with ≤ $500 spare.

  test("UAT-05a: well-allocated budget transitions to On Track healthy state", async () => {
    // Add $3,100 → total $4,600; $400 remaining = 8% ≤ 10% → healthy
    await addItem("Savings", "3100")
    await expect(pg.getByText("$400.00")).toBeVisible({ timeout: 5_000 })
    await expect(pg.getByText("On Track").first()).toBeVisible()
  })

  // ─── UAT-05b: Overspent — "Over Budget" state ────────────────────────────

  test("UAT-05b: allocations exceeding income shows Over Budget state", async () => {
    // Add $500 → total $5,100; −$100 over budget
    await addItem("Extra", "500")
    await expect(pg.getByText("-$100.00")).toBeVisible({ timeout: 5_000 })
    await expect(pg.getByText("Over Budget").first()).toBeVisible()
  })

  // ─── UAT-06: Edit budget item — counter adjusts ───────────────────────────

  test("UAT-06: editing a budget item updates the Budget Balance counter", async () => {
    // Hover reveals the Edit button (aria-label="Edit Extra")
    const extraRow = pg.locator("li.group").filter({ hasText: "Extra" })
    await extraRow.hover()
    await pg.getByRole("button", { name: "Edit Extra" }).click({ force: true })

    // The editing <li> loses the "group" class; it now contains a Save button.
    const editingRow = pg
      .locator("li")
      .filter({ has: pg.getByRole("button", { name: "Save" }) })
    await editingRow.locator('[name="allocatedAmount"]').fill("300")
    await editingRow.getByRole("button", { name: "Save" }).click()

    // Edit form closes; row shows updated amount; total $4,900 → $100 (2%) → healthy
    await expect(
      pg.locator("li.group").filter({ hasText: "Extra" }),
    ).toBeVisible({ timeout: 5_000 })
    await expect(pg.getByText("$100.00")).toBeVisible()
    await expect(pg.getByText("On Track").first()).toBeVisible()
  })

  // ─── UAT-07: Delete budget item — counter increases ───────────────────────

  test("UAT-07: deleting a budget item increases the Budget Balance counter", async () => {
    const extraRow = pg.locator("li.group").filter({ hasText: "Extra" })
    await extraRow.hover()
    await pg.getByRole("button", { name: "Delete Extra" }).click({ force: true })

    await expect(
      pg.locator("li.group").filter({ hasText: "Extra" }),
    ).not.toBeVisible({ timeout: 5_000 })
    // Remaining: Rent $1,500 + Savings $3,100 = $4,600 → $400 remaining = 8% → healthy
    await expect(pg.getByText("$400.00")).toBeVisible()
    await expect(pg.getByText("On Track").first()).toBeVisible()
  })

  // ─── UAT-09: Actual Balance card — no NaN, shows income ──────────────────
  // S02: totalActuals = 0; Actual Balance = income = $5,000.
  // State is shared with Budget Balance (8% remaining → healthy → "On Track").

  test("UAT-09: Actual Balance card shows income amount without NaN", async () => {
    await expect(pg.getByText("Actual Balance")).toBeVisible()
    // totalActuals = 0 in S02 → actualBalance = $5,000
    await expect(pg.getByText("$5,000.00")).toBeVisible()
    await expect(pg.getByText("On Track").first()).toBeVisible()
    // Explicit NaN guard
    await expect(pg.getByText(/NaN/)).not.toBeVisible()
  })
})
