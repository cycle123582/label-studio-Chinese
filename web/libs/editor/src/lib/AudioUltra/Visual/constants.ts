import type { WindowFunctionType } from "./WindowFunctions";
import type { ColorScheme } from "./ColorMapper";

export const SPECTROGRAM_DEFAULTS = {
  FFT_SAMPLES: 512,
  MEL_BANDS: 64,
  WINDOWING_FUNCTION: "blackman" as WindowFunctionType,
  COLOR_SCHEME: "viridis" as ColorScheme,
  MIN_DB: -80,
  MAX_DB: -10,
} as const;

export const FFT_SAMPLE_VALUES = [64, 128, 256, 512, 1024, 2048] as const;

export const WINDOWING_OPTIONS = [
  { value: "hann", label: "Hann" },
  { value: "hamming", label: "Hamming" },
  { value: "blackman", label: "Blackman" },
  { value: "rectangular", label: "Rectangular" },
] as const;

// Performance tuning constants for painting
export const DEBOUNCE_PAINT_AMOUNT = 0; // ms, for ~60fps

// Performance tuning constants
export const SPECTROGRAM_MAX_COMPUTATIONS = 2000;

// Target FPS for rate limited rendering
export const RATE_LIMITED_RENDER_FPS = 60;

// Pre-cache spectrogram data for the current window size
export const PRECACHE = true;
export const SPECTROGRAM_FEATURE_ENABLED = false;

// UI Constants
export const MIN_RECT_HEIGHT = 1;
export const DEFAULT_MODAL_MARGIN = 10;

// Maximum number of bins to display for linear scale spectrograms.
// This limits the number of rectangles drawn per column for performance and visual clarity.
export const MAX_LINEAR_DISPLAY_BINS = 128;
export const MAX_LOG_DISPLAY_BINS = 128;
export const MAX_MEL_DISPLAY_BINS = 140;

// Fraction of bins (from low to high) to use average pooling in hybrid linear downsampling.
// The remainder (high bins) will use max pooling. 0.5 = 50% average, 50% max.
export const HYBRID_LINEAR_DOWNSAMPLE_SPLIT = 0.5;

// If the number of cached FFT entries exceeds width * this factor, clear the computation queue
export const SPECTROGRAM_CACHE_CLEAR_FACTOR = 1;

// Buffer window configuration:
// For each priority, the buffer duration is the maximum of:
//   - SPECTROGRAM_BUFFER_*_WINDOWS windows (where a window = current visible window size in seconds)
//   - SPECTROGRAM_BUFFER_*_SEC seconds (fixed duration)
// This allows for flexible caching based on either a multiple of the visible window or a minimum seconds value.
export const SPECTROGRAM_BUFFER_NORMAL_WINDOWS = 5; // max(2 windows, 2 seconds) for normal priority
export const SPECTROGRAM_BUFFER_NORMAL_SEC = 3;

export const SPECTROGRAM_HIGH_BATCH_SIZE = 60;
export const SPECTROGRAM_NORMAL_BATCH_SIZE = 100;

// We will stitch an additional 3 px to the right or left to the data.
export const SEAM_GAP_FILL = 2;

// Waveform-specific seam gap fill (in pixels)
export const WAVEFORM_SEAM_GAP_FILL = 10;

// Maximum number of FFT cache entries per channel (for LRU cache)
export const SPECTROGRAM_FFT_CACHE_MAX_ENTRIES = 50000;

/**
 * Governed by the feature flag FF_AUDIO_SPECTROGRAMS
 * If the feature flag is enabled, this is ignored.
 * @deprecated
 */
export const CACHE_RENDER_THRESHOLD = 10000000;
