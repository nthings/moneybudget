/**
 * Penpot plugin entry point.
 *
 * The `penpot` global is injected by the Penpot plugin runtime into the Web
 * Worker scope.  We pass it explicitly to runSetup so the rest of the code
 * stays testable without globals.
 */
import { runSetup } from './setup.js';

// eslint-disable-next-line no-undef
runSetup(penpot);
