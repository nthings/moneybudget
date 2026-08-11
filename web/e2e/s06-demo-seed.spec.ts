/**
 * S06 UAT — Demo Seed, Sign-Up Flow, and Isolation
 *
 * Preconditions:
 *   - Stack running: docker compose up -d (project root)
 *
 * What this spec proves:
 *   1. The sign-up page is accessible (was previously a redirect stub).
 *   2. Signing up a new account triggers seedDemoData automatically.
 *   3. All four app screens show live seed data after sign-up.
 *   4. Signing in again with the same account does NOT duplicate seed data
 *      (idempotency guard on budgetPeriods uniqueness).
 *   5. A second account's seed runs independently — no data bleed between users.
 *
 * Cleanup:
 *   afterAll sends DELETE /api/test/seed { type:"account", email } for every
 *   test account created during the run, removing all app rows and the user row.
 *
 * Run: cd web && npx playwright test e2e/s06-demo-seed.spec.ts
 */

import { test, expect, type Page } from "@playwright/test"

const SEED_URL = "/api/test/seed"
const TEST_PASSWORD = "TestPassword123!"

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function signUp(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/sign-up")
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill(password)
  await page.getByRole("button", { name: "Sign up" }).click()
  // seedDemoData runs inline before the signIn redirect; allow extra time
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 })
}

async function signIn(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/sign-in")
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill(password)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 })
}

async function signOut(page: Page): Promise<void> {
  // Sign-out is a form submit — Sidebar renders <form action={signOutUser}>
  await page.getByRole("button", { name: "Sign out" }).click()
  await expect(page).toHaveURL(/\/sign-in/, { timeout: 10_000 })
}

async function cleanupAccount(page: Page, email: string): Promise<void> {
  await page.request.delete(SEED_URL, {
    data: { type: "account", email },
  })
}

// ─── UAT-01: Sign-up page loads (smoke) ──────────────────────────────────────

test("UAT-01: /sign-up renders the sign-up form", async ({ page }) => {
  await page.goto("/sign-up")
  await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible()
  await expect(page.getByLabel("Email")).toBeVisible()
  await expect(page.getByLabel("Password")).toBeVisible()
  await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible()
})

// ─── UAT-02 through UAT-09: serial flow sharing one browser page ──────────────

test.describe("Demo Seed End-to-End Flow", () => {
  test.describe.configure({ mode: "serial" })

  let pg!: Page
  let emailA: string
  let emailB: string

  test.beforeAll(async ({ browser }) => {
    // Unique emails per run — avoids collisions when the stack isn't reset
    const ts = Date.now()
    emailA = `test-s06-a-${ts}@example.com`
    emailB = `test-s06-b-${ts}@example.com`
    pg = await browser.newPage()
  })

  test.afterAll(async () => {
    // Remove both test accounts created during this run.
    // cleanupAccount calls DELETE /api/test/seed { type:"account", email }.
    // Best-effort — don't let cleanup failures mask test failures.
    try {
      await cleanupAccount(pg, emailA)
    } catch { /* ignore */ }
    try {
      await cleanupAccount(pg, emailB)
    } catch { /* ignore */ }
    await pg.close()
  })

  // ─── UAT-02: Sign up account A → dashboard with seed data ──────────────

  test("UAT-02: sign up account A → auto-redirects to /dashboard", async () => {
    await signUp(pg, emailA, TEST_PASSWORD)
    // Sidebar shows all four nav links
    await expect(pg.getByRole("link", { name: "Dashboard" })).toBeVisible()
    await expect(pg.getByRole("link", { name: "The Allocator" })).toBeVisible()
    await expect(pg.getByRole("link", { name: "Transactions" })).toBeVisible()
    await expect(pg.getByRole("link", { name: "Piggy Banks" })).toBeVisible()
  })

  // ─── UAT-03: Dashboard shows live seed data ─────────────────────────────

  test("UAT-03: Dashboard screen shows stat cards and a seeded transaction", async () => {
    await pg.goto("/dashboard")
    await expect(pg.getByRole("heading", { name: "Dashboard" })).toBeVisible()

    // Three stat cards must be visible (labels from StatCard component)
    await expect(pg.getByText("Total Income")).toBeVisible()
    await expect(pg.getByText("Total Spent")).toBeVisible()
    await expect(pg.getByText("Remaining")).toBeVisible()

    // At least one seeded transaction appears in the "recent transactions" list.
    // seedDemoData plants "Acme Corp Payroll" on day 15 and several expenses.
    await expect(
      pg.getByText(/Acme Corp Payroll|Whole Foods Market|Sunrise Properties/),
    ).toBeVisible({ timeout: 5_000 })
  })

  // ─── UAT-04: Allocator shows 3 tier groups with seeded items ────────────

  test("UAT-04: Allocator screen shows 3 tier groups and seeded budget items", async () => {
    await pg.goto("/allocator")

    // The three fixed ZBB tier headings
    await expect(pg.getByText("Essential Needs")).toBeVisible()
    await expect(pg.getByText("Financial Goals")).toBeVisible()
    await expect(pg.getByText("Lifestyle")).toBeVisible()

    // A sample of seeded items across tiers
    await expect(pg.getByText("Rent / Mortgage")).toBeVisible()
    await expect(pg.getByText("Emergency Fund")).toBeVisible()
    await expect(pg.getByText("Dining Out")).toBeVisible()
  })

  // ─── UAT-05: Transactions page lists seeded transactions ────────────────

  test("UAT-05: Transactions screen shows seeded merchant names", async () => {
    await pg.goto("/transactions")
    await expect(pg.getByRole("heading", { name: "Transactions" })).toBeVisible()

    // seedDemoData inserts 12 transactions; spot-check a few merchants
    await expect(pg.getByText("Sunrise Properties")).toBeVisible()
    await expect(pg.getByText("Whole Foods Market")).toBeVisible()
    await expect(pg.getByText("Acme Corp Payroll")).toBeVisible()
  })

  // ─── UAT-06: Piggy Banks shows seeded goal ──────────────────────────────

  test("UAT-06: Piggy Banks screen shows the seeded Emergency Fund goal", async () => {
    await pg.goto("/piggy-banks")
    await expect(pg.getByRole("heading", { name: "Piggy Banks" })).toBeVisible()

    // seedDemoData creates: "Emergency Fund", $10,000 target, $3,200 current
    await expect(pg.getByRole("heading", { name: "Emergency Fund" })).toBeVisible()
    await expect(pg.getByText(/\$10,000\.00/)).toBeVisible()
    await expect(pg.getByText(/\$3,200\.00/)).toBeVisible()
  })

  // ─── UAT-07: Sign out redirects to /sign-in ─────────────────────────────

  test("UAT-07: Sign out button redirects to /sign-in", async () => {
    // Start from dashboard to ensure Sidebar is rendered
    await pg.goto("/dashboard")
    await signOut(pg)
    await expect(pg.getByRole("heading", { name: "Sign in" })).toBeVisible()
  })

  // ─── UAT-08: Second sign-in does NOT duplicate seed data (idempotency) ──

  test("UAT-08: signing in again with the same account does not duplicate seed", async () => {
    await signIn(pg, emailA, TEST_PASSWORD)

    // Navigate to Piggy Banks — the idempotency guard on budgetPeriods means
    // seedDemoData is a no-op on subsequent sign-ins, so "Emergency Fund"
    // must appear exactly once (not duplicated).
    await pg.goto("/piggy-banks")
    const efHeadings = pg.getByRole("heading", { name: "Emergency Fund" })
    await expect(efHeadings).toHaveCount(1)

    // Transactions screen should not show doubled rows.
    // seedDemoData plants "Sunrise Properties" once — confirm exactly 1 row.
    await pg.goto("/transactions")
    await expect(pg.getByText("Sunrise Properties")).toHaveCount(1)
  })

  // ─── UAT-09: Second account gets its own independent seed ───────────────

  test("UAT-09: signing up a second account seeds it independently", async () => {
    // Sign out from account A first
    await pg.goto("/dashboard")
    await signOut(pg)

    // Sign up account B
    await signUp(pg, emailB, TEST_PASSWORD)

    // Account B should also have the seeded Emergency Fund goal
    await pg.goto("/piggy-banks")
    await expect(pg.getByRole("heading", { name: "Emergency Fund" })).toBeVisible()
    await expect(pg.getByText(/\$10,000\.00/)).toBeVisible()

    // And account B's allocator should show seeded budget items
    await pg.goto("/allocator")
    await expect(pg.getByText("Essential Needs")).toBeVisible()
    await expect(pg.getByText("Rent / Mortgage")).toBeVisible()
  })
})
