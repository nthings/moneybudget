/**
 * Page setup for the MoneyBudget Penpot file.
 *
 * Ensures exactly four pages exist with the correct names:
 *   1. The Allocator      (renamed from the default "Page 1")
 *   2. Dashboard
 *   3. Transaction Review
 *   4. Piggy Banks
 *
 * Idempotent — safe to call multiple times; existing pages are never duplicated.
 *
 * @param {object} penpot  Penpot plugin API reference (global in plugin context)
 */
export function setupPages(penpot) {
  const REQUIRED_PAGES = [
    'The Allocator',
    'Dashboard',
    'Transaction Review',
    'Piggy Banks',
  ];

  // Rename the first / current page if it still has the default name
  const first = penpot.currentPage;
  if (first.name === 'Page 1' || first.name === 'page-1') {
    first.name = 'The Allocator';
  }

  // Snapshot existing page names after the rename
  const existing = (
    typeof penpot.getPages === 'function'
      ? penpot.getPages()
      : [first]
  ).map((p) => p.name);

  // Create any page that is still missing
  for (const name of REQUIRED_PAGES) {
    if (!existing.includes(name)) {
      penpot.createPage(name);
    }
  }
}
