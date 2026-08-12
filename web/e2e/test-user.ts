/**
 * Test user credentials — loaded from environment, never hardcoded.
 *
 * Set in .env.test (gitignored) or export before running:
 *   export E2E_USER_EMAIL=...
 *   export E2E_USER_PASSWORD=...
 */
export const TEST_USER = {
  email: process.env.E2E_USER_EMAIL ?? "",
  password: process.env.E2E_USER_PASSWORD ?? "",
}

if (!TEST_USER.email || !TEST_USER.password) {
  throw new Error(
    "E2E_USER_EMAIL and E2E_USER_PASSWORD must be set. " +
      "Copy web/.env.test.example to web/.env.test and fill in values."
  )
}
