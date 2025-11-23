/**
 * Constants for tests
 */

/**
 * Wait time for processing a single animation frame (in ms)
 * Used for waiting for fast renders and DOM updates
 */
export const SINGLE_FRAME_TIMEOUT = 16;

/**
 * Wait time for processing two animation frames (in ms)
 * Used for waiting for fast renders which could be done in two steps for some reason
 */
export const TWO_FRAMES_TIMEOUT = SINGLE_FRAME_TIMEOUT * 2;

/**
 * Wait time for canvas rendering to stabilize (in ms)
 * Used for audio/video components that need canvas rendering to complete
 */
export const CANVAS_STABILIZATION_TIMEOUT = 100;

/**
 * Wait time for state transitions in audio components (in ms)
 * Used after user interactions that change visual state
 */
export const AUDIO_STATE_TRANSITION_TIMEOUT = 50;
