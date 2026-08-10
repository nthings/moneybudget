/**
 * penpotUtils — normalised wrappers around the Penpot plugin API.
 *
 * Accepts the `penpot` API reference so the module is testable without globals.
 *
 * Usage:
 *   import { makeUtils } from './utils.js';
 *   const { penpotUtils } = makeUtils(penpot);
 *   const pages = penpotUtils.getPages();
 */
export function makeUtils(penpot) {
  const penpotUtils = {
    /**
     * Returns all pages in the current file as an array.
     * Normalises whether the runtime exposes penpot.getPages() directly.
     *
     * @returns {Array<{name: string, id: string}>}
     */
    getPages() {
      if (typeof penpot.getPages === 'function') {
        return penpot.getPages();
      }
      // Fallback: only currentPage is available
      if (penpot.currentPage) {
        return [penpot.currentPage];
      }
      return [];
    },

    /**
     * Find a page by name (case-insensitive).
     *
     * @param {string} name
     * @returns {{name: string, id: string} | undefined}
     */
    findPage(name) {
      return this.getPages().find(
        (p) => p.name.toLowerCase() === name.toLowerCase(),
      );
    },

    /**
     * Persist a JSON-serialisable value in Penpot plugin storage.
     * No-ops gracefully when storage is absent (e.g. in test mocks that omit it).
     *
     * @param {string} key
     * @param {unknown} value
     */
    store(key, value) {
      if (penpot.storage && typeof penpot.storage.setItem === 'function') {
        penpot.storage.setItem(key, JSON.stringify(value));
      }
    },

    /**
     * Retrieve a previously stored value.
     * Returns `undefined` when storage is absent or the key does not exist.
     *
     * @param {string} key
     * @returns {unknown}
     */
    retrieve(key) {
      if (penpot.storage && typeof penpot.storage.getItem === 'function') {
        const raw = penpot.storage.getItem(key);
        if (raw == null) return undefined;
        try { return JSON.parse(raw); } catch { return raw; }
      }
      return undefined;
    },
  };

  return { penpotUtils };
}
