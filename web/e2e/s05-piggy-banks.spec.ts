/**
 * S05 UAT — Piggy Banks Screen
 *
 * Preconditions:
 *   - Stack running: docker compose up -d (project root)
 *   - Seeded user exists (E2E_TEST_USER_EMAIL / REDACTED)
 *
 * Run: cd web && npx playwright test e2e/s05-piggy-banks.spec.ts
 *   Or: BASE_URL=http://192.168.68.12:3010 npx playwright test e2e/s05-piggy-banks.spec.ts
 *
 * Strategy:
 *   beforeAll clears all piggy-bank goals for the test user via clearAll:true so
 *   each run starts from a known empty state. afterAll deletes any rows seeded or
 *   created via the UI.
 *
 * Demo flow (covered by UAT-03 → UAT-06):
 *   Create goal  → card appears with 0% progress + correct target
 *   Deposit      → currentAmount increments, progress badge reflects new %
 */

import { test, expect, type Page } from "@playwright/test"

const USER = { email: "E2E_TEST_USER_EMAIL", password: "REDACTED" }
const SEED_URL = "/api/test/seed"

async function signIn(page: Page): Promise<void> {
  await page.goto("/sign-in")
  await page.getByLabel("Email").fill(USER.email)
  await page.getByLabel("Password").fill(USER.password)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
}

// ─── UAT-01: Unauthenticated redirect (isolated, no session) ──────────────────

test("UAT-01: unauthenticated /piggy-banks redirects to /sign-in", async ({ page }) => {
  await page.goto("/piggy-banks")
  await expect(page).toHaveURL(/\/sign-in/)
})

// ─── UAT-02 through UAT-07: serial tests sharing a signed-in page ─────────────

test.describe("Piggy Banks Screen (authenticated)", () => {
  test.describe.configure({ mode: "serial" })

  let pg!: Page
  // IDs seeded via the API — cleaned up in afterAll
  let seededIds: number[] = []
  // IDs of goals created via the UI — discovered by querying the page after creation
  let uiCreatedIds: number[] = []

  test.beforeAll(async ({ browser }) => {
    pg = await browser.newPage()
    await signIn(pg)

    // Clear ALL piggy-bank goals for this user so the test starts from empty state.
    // Seed a single placeholder goal with clearAll:true, then remember its ID for cleanup.
    const res = await pg.request.post(SEED_URL, {
      data: {
        type: "goals",
        email: USER.email,
        goals: [{ name: "__setup__", targetAmount: "1.00" }],
        clearAll: true,
      },
    })
    const json = await res.json()
    // The placeholder row itself needs cleanup (it's the only row after clearAll)
    seededIds = json.ids ?? []

    // Delete the placeholder immediately so the page is truly empty on first load
    if (seededIds.length > 0) {
      await pg.request.delete(SEED_URL, {
        data: { type: "goals", ids: seededIds },
      })
      seededIds = []
    }
  })

  test.afterAll(async () => {
    // Clean up any goals seeded via the API
    if (seededIds.length > 0) {
      await pg.request.delete(SEED_URL, {
        data: { type: "goals", ids: seededIds },
      })
    }
    // Clean up goals created via the UI
    if (uiCreatedIds.length > 0) {
      await pg.request.delete(SEED_URL, {
        data: { type: "goals", ids: uiCreatedIds },
      })
    }
    await pg.close()
  })

  // ─── UAT-02: Empty-state page loads ─────────────────────────────────────────

  test("UAT-02: /piggy-banks loads and shows empty state", async () => {
    await pg.goto("/piggy-banks")
    await expect(pg).toHaveURL(/\/piggy-banks/)
    // Heading should be visible
    await expect(pg.getByRole("heading", { name: /piggy bank/i })).toBeVisible()
    // No goal cards present — empty-state message shown
    await expect(pg.getByText(/no savings goals yet/i)).toBeVisible()
    // CreateGoalForm is always rendered
    await expect(pg.getByRole("heading", { name: /new savings goal/i })).toBeVisible()
  })

  // ─── UAT-03: Create a new goal via the form ───────────────────────────────

  test("UAT-03: create a goal → card appears with 0% progress", async () => {
    await pg.goto("/piggy-banks")

    await pg.getByLabel("Goal Name").fill("Emergency Fund")
    await pg.getByLabel("Target Amount").fill("1000.00")
    await pg.getByRole("button", { name: "Create Goal" }).click()

    // Success feedback
    await expect(pg.getByText("Goal created!")).toBeVisible({ timeout: 5_000 })

    // Card appears
    await expect(pg.getByRole("heading", { name: "Emergency Fund" })).toBeVisible({
      timeout: 5_000,
    })

    // Progress badge shows 0%
    await expect(pg.getByText("0%")).toBeVisible()

    // Amounts: $0.00 of $1,000.00
    await expect(pg.getByText(/\$0\.00/)).toBeVisible()
    await expect(pg.getByText(/\$1,000\.00/)).toBeVisible()

    // Progress bar element is rendered (aria-role)
    const bar = pg.getByRole("progressbar", { name: /Emergency Fund progress/i })
    await expect(bar).toBeVisible()
    await expect(bar).toHaveAttribute("aria-valuenow", "0")
  })

  // ─── UAT-04: Deposit button reveals deposit form ──────────────────────────

  test("UAT-04: clicking Deposit reveals the deposit form", async () => {
    await pg.goto("/piggy-banks")

    // The goal from UAT-03 should be visible
    await expect(pg.getByRole("heading", { name: "Emergency Fund" })).toBeVisible()

    // Click Deposit toggle
    await pg.getByRole("button", { name: "Deposit" }).click()

    // Deposit amount input appears — use exact label to avoid matching "Target Amount"
    await expect(pg.getByRole("textbox", { name: "Amount", exact: true })).toBeVisible()

    // Cancel collapses the form
    await pg.getByRole("button", { name: "Cancel" }).click()
    await expect(pg.getByRole("textbox", { name: "Amount", exact: true })).not.toBeVisible()
  })

  // ─── UAT-05: Deposit updates current amount and progress bar ─────────────

  test("UAT-05: depositing $250 updates currentAmount and progress to 25%", async () => {
    await pg.goto("/piggy-banks")

    // Open deposit form for Emergency Fund
    await pg.getByRole("button", { name: "Deposit" }).click()

    const amountInput = pg.getByRole("textbox", { name: "Amount", exact: true })
    await expect(amountInput).toBeVisible()
    await amountInput.fill("250.00")

    await pg.getByRole("button", { name: "Deposit" }).last().click()

    // After deposit, the card reflects the new amount and 25% progress
    await expect(pg.getByText("25%")).toBeVisible({ timeout: 5_000 })
    await expect(pg.getByText(/\$250\.00/)).toBeVisible()

    const bar = pg.getByRole("progressbar", { name: /Emergency Fund progress/i })
    await expect(bar).toHaveAttribute("aria-valuenow", "25")
  })

  // ─── UAT-06: Second deposit accumulates ──────────────────────────────────

  test("UAT-06: second deposit of $250 brings total to $500 (50%)", async () => {
    await pg.goto("/piggy-banks")

    await pg.getByRole("button", { name: "Deposit" }).click()

    const amountInput = pg.getByRole("textbox", { name: "Amount", exact: true })
    await expect(amountInput).toBeVisible()
    await amountInput.fill("250.00")
    await pg.getByRole("button", { name: "Deposit" }).last().click()

    await expect(pg.getByText("50%")).toBeVisible({ timeout: 5_000 })
    await expect(pg.getByText(/\$500\.00/)).toBeVisible()

    const bar = pg.getByRole("progressbar", { name: /Emergency Fund progress/i })
    await expect(bar).toHaveAttribute("aria-valuenow", "50")
  })

  // ─── UAT-07: Pre-seeded goal with partial amount shows correct % ──────────

  test("UAT-07: seeded goal with $300 of $600 target shows 50%", async () => {
    // Seed a pre-filled goal via the API
    const res = await pg.request.post(SEED_URL, {
      data: {
        type: "goals",
        email: USER.email,
        goals: [{ name: "Vacation Fund", targetAmount: "600.00", currentAmount: "300.00" }],
      },
    })
    const json = await res.json()
    seededIds.push(...(json.ids ?? []))

    await pg.goto("/piggy-banks")

    await expect(pg.getByRole("heading", { name: "Vacation Fund" })).toBeVisible()
    await expect(pg.getByText(/\$300\.00/)).toBeVisible()
    await expect(pg.getByText(/\$600\.00/)).toBeVisible()

    // 50% progress badge
    const badges = pg.getByText("50%")
    await expect(badges.first()).toBeVisible()

    const bar = pg.getByRole("progressbar", { name: /Vacation Fund progress/i })
    await expect(bar).toHaveAttribute("aria-valuenow", "50")
  })

  // ─── UAT-08: Deposit capped at target (no over-deposit) ──────────────────

  test("UAT-08: depositing more than remaining target caps at 100%", async () => {
    // Seed a near-full goal: $950 of $1000
    const res = await pg.request.post(SEED_URL, {
      data: {
        type: "goals",
        email: USER.email,
        goals: [{ name: "Cap Test Goal", targetAmount: "1000.00", currentAmount: "950.00" }],
      },
    })
    const json = await res.json()
    const capGoalIds: number[] = json.ids ?? []
    seededIds.push(...capGoalIds)

    await pg.goto("/piggy-banks")

    // Locate the specific GoalCard by scoping on the card's root border div + heading
    const goalCard = pg.locator("div.border").filter({
      has: pg.getByRole("heading", { name: "Cap Test Goal" }),
    })
    await expect(goalCard).toBeVisible()
    await goalCard.getByRole("button", { name: "Deposit" }).click()

    const amountInput = goalCard.getByRole("textbox", { name: "Amount", exact: true })
    await expect(amountInput).toBeVisible()
    // Attempt to over-deposit ($200 > $50 remaining)
    await amountInput.fill("200.00")
    await goalCard.getByRole("button", { name: "Deposit" }).last().click()

    // Capped at 100% — goal reached badge shown
    await expect(goalCard.getByText("🎉 Goal reached!")).toBeVisible({ timeout: 5_000 })
    await expect(goalCard.getByText("100%")).toBeVisible()
  })
})
