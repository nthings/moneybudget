/**
 * S08 UAT — Financial Goals Unified with Piggy Banks (M003)
 *
 * Preconditions:
 *   - Stack running: docker compose up -d (project root)
 *   - Seeded user exists (E2E_TEST_USER_EMAIL / REDACTED)
 *
 * Run: BASE_URL=http://localhost:3010 npx playwright test e2e/s08-financial-goals-unified.spec.ts
 */

import { test, expect, type Page } from "@playwright/test"

const USER = { email: process.env.E2E_USER_EMAIL ?? "test@test.com", password: process.env.E2E_USER_PASSWORD ?? "12345" }
const SEED_URL = "/api/test/seed"

test.describe.configure({ mode: "serial" })

async function signIn(page: Page): Promise<void> {
  await page.goto("/sign-in")
  await page.getByLabel("Email").fill(USER.email)
  await page.getByLabel("Password").fill(USER.password)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
}

let pg!: Page

test.beforeAll(async ({ browser }) => {
  pg = await browser.newPage()
  await signIn(pg)

  // Clear ALL piggy-bank goals. Seed endpoint requires non-empty goals array;
  // pass a dummy row then delete it.
  const res = await pg.request.post(SEED_URL, {
    data: {
      type: "goals",
      email: USER.email,
      clearAll: true,
      goals: [{ name: "__cleanup__", targetAmount: "1.00" }],
    },
  })
  expect(res.status()).toBe(200)
  const body = await res.json()
  if (body.ids?.length > 0) {
    await pg.request.delete(SEED_URL, { data: { type: "goals", ids: body.ids } })
  }
})

test.afterAll(async () => {
  await pg.close()
})

// ─── UAT-S08-01: Financial Goals empty state when no contributions ────────────

test("UAT-S08-01: Financial Goals shows empty state message and no + Add form when no piggy banks", async () => {
  await pg.goto("/allocator")
  await expect(pg).toHaveURL(/\/allocator/)

  // Tier header is visible
  await expect(pg.getByRole("heading", { name: "Financial Goals" })).toBeVisible()

  // Empty-state message
  await expect(
    pg.getByText("Set a monthly contribution on a Piggy Bank to populate this tier.")
  ).toBeVisible()

  // No NaN anywhere
  expect(await pg.content()).not.toContain("NaN")
})

// ─── UAT-S08-02: Create goal with monthly contribution → appears in Financial Goals ─

test("UAT-S08-02: create piggy bank with monthly contribution → auto-appears in Financial Goals", async () => {
  await pg.goto("/piggy-banks")

  await pg.getByLabel("Goal Name").fill("Vacation Fund")
  await pg.locator('input[name="targetAmount"]').fill("3000")
  await pg.locator('input[name="monthlyContribution"]').fill("250")
  await pg.getByRole("button", { name: "Create Goal", exact: true }).click()
  await expect(pg.getByText("Goal created!")).toBeVisible({ timeout: 5_000 })

  // Navigate to allocator
  await pg.goto("/allocator")
  await expect(pg.getByText("Vacation Fund")).toBeVisible({ timeout: 5_000 })
  await expect(pg.getByText("via Piggy Banks")).toBeVisible()

  // No NaN
  expect(await pg.content()).not.toContain("NaN")
})

// ─── UAT-S08-03: ZBB counters show no NaN with piggy bank contribution ────────

test("UAT-S08-03: ZBB counter cards render without NaN when piggy bank contribution is included", async () => {
  await pg.goto("/allocator")
  await expect(pg.getByText("BUDGET BALANCE")).toBeVisible()
  await expect(pg.getByText("ACTUAL BALANCE")).toBeVisible()
  expect(await pg.content()).not.toContain("NaN")
})

// ─── UAT-S08-04: Edit monthly contribution inline ────────────────────────────

test("UAT-S08-04: edit monthly contribution via pencil → Allocator reflects updated amount", async () => {
  await pg.goto("/piggy-banks")

  await pg.getByRole("button", { name: "Edit monthly contribution" }).click()
  await pg.locator('input[placeholder="0.00"]').fill("400")
  await pg.getByRole("button", { name: "Save" }).click()

  await expect(pg.getByText("Monthly: $400.00")).toBeVisible({ timeout: 5_000 })

  await pg.goto("/allocator")
  await expect(pg.getByText("Vacation Fund")).toBeVisible()
  // Financial Goals tier total includes $400
  const content = await pg.content()
  expect(content).toContain("400.00")
  expect(content).not.toContain("NaN")
})

// ─── UAT-S08-05: Clear monthly contribution → removed from Financial Goals ───

test("UAT-S08-05: clear monthly contribution → goal removed from Financial Goals tier", async () => {
  await pg.goto("/piggy-banks")

  await pg.getByRole("button", { name: "Edit monthly contribution" }).click()
  await pg.locator('input[placeholder="0.00"]').fill("")
  await pg.getByRole("button", { name: "Save" }).click()

  await expect(pg.getByText("No monthly target")).toBeVisible({ timeout: 5_000 })
  await expect(pg.getByText("Monthly: $400.00")).not.toBeVisible()

  await pg.goto("/allocator")
  await expect(pg.getByText("Vacation Fund")).not.toBeVisible({ timeout: 5_000 })
  await expect(
    pg.getByText("Set a monthly contribution on a Piggy Bank to populate this tier.")
  ).toBeVisible()
})
