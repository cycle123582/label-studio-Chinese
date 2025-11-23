// This file has been refactored into smaller, more manageable chunks.
// The new structure is:
// - eventHandlers/types.ts - Type definitions
// - eventHandlers/utils.ts - Utility functions
// - eventHandlers/pointSelection.ts - Point selection logic
// - eventHandlers/drawing.ts - Drawing mode logic
// - eventHandlers/mouseHandlers.ts - Mouse event handlers
// - eventHandlers/index.ts - Main factory function

// Re-export the new refactored event handlers
export { createEventHandlers } from "./eventHandlers/index";
export type { EventHandlerProps, EventHandlers } from "./eventHandlers/types";
