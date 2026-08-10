export async function register() {
  // Only run on the Node.js runtime — not on the Edge Runtime.
  // This executes once at server startup, before any request is handled.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("[instrumentation] Running Drizzle migrations...")
    try {
      const { migrate } = await import("drizzle-orm/node-postgres/migrator")
      const { db } = await import("./src/db")
      await migrate(db, { migrationsFolder: "./drizzle" })
      console.log("[instrumentation] Migrations complete ✓")
    } catch (err) {
      console.error("[instrumentation] Migration failed:", err)
      // Re-throw so the process exits with a non-zero code and Docker restarts the container.
      throw err
    }
  }
}
