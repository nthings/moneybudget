/**
 * Shape helper factories.
 *
 * Accepts the `penpot` API reference as a parameter so the helpers can be
 * called both inside the real Penpot plugin context (pass the global `penpot`)
 * and inside unit tests (pass a mock object).
 *
 * Usage:
 *   import { makeHelpers } from './helpers.js';
 *   const { mkRect, mkBoard, mkText } = makeHelpers(penpot);
 *
 *   const sidebar = mkBoard({ name: 'Sidebar', x: 0, y: 0, width: 240, height: 960 });
 */
export function makeHelpers(penpot) {
  /**
   * Create a styled rectangle using penpot.createRectangle().
   *
   * @param {{ name?: string, x?: number, y?: number,
   *           width?: number, height?: number,
   *           fills?: object[], strokes?: object[],
   *           borderRadius?: number }} params
   * @returns {PenpotRectangle}
   */
  function mkRect(params = {}) {
    const rect = penpot.createRectangle();
    if (params.name          !== undefined) rect.name         = params.name;
    if (params.x             !== undefined) rect.x            = params.x;
    if (params.y             !== undefined) rect.y            = params.y;
    if (params.width !== undefined || params.height !== undefined) {
      rect.resize(
        params.width  ?? rect.width,
        params.height ?? rect.height,
      );
    }
    if (params.fills        !== undefined) rect.fills        = params.fills;
    if (params.strokes      !== undefined) rect.strokes      = params.strokes;
    if (params.borderRadius !== undefined) rect.borderRadius = params.borderRadius;
    return rect;
  }

  /**
   * Create a styled board (artboard / frame) using penpot.createBoard().
   *
   * @param {{ name?: string, x?: number, y?: number,
   *           width?: number, height?: number,
   *           fills?: object[], clipsContent?: boolean }} params
   * @returns {PenpotBoard}
   */
  function mkBoard(params = {}) {
    const board = penpot.createBoard();
    if (params.name         !== undefined) board.name         = params.name;
    if (params.x            !== undefined) board.x            = params.x;
    if (params.y            !== undefined) board.y            = params.y;
    if (params.width !== undefined || params.height !== undefined) {
      board.resize(
        params.width  ?? board.width,
        params.height ?? board.height,
      );
    }
    if (params.fills        !== undefined) board.fills        = params.fills;
    if (params.clipsContent !== undefined) board.clipsContent = params.clipsContent;
    return board;
  }

  /**
   * Create a text node using penpot.createText().
   *
   * @param {string} content  Visible text string
   * @param {{ name?: string, x?: number, y?: number,
   *           fontSize?: number, fontWeight?: string,
   *           fills?: object[] }} params
   * @returns {PenpotText}
   */
  function mkText(content, params = {}) {
    const text = penpot.createText(content);
    if (params.name       !== undefined) text.name       = params.name;
    if (params.x          !== undefined) text.x          = params.x;
    if (params.y          !== undefined) text.y          = params.y;
    if (params.fontSize   !== undefined) text.fontSize   = params.fontSize;
    if (params.fontWeight !== undefined) text.fontWeight = params.fontWeight;
    if (params.fills      !== undefined) text.fills      = params.fills;
    return text;
  }

  return { mkRect, mkBoard, mkText };
}
