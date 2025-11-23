/**
 * Available window function types for audio processing
 */
export type WindowFunctionType = "hann" | "hamming" | "blackman" | "rectangular";

/**
 * Applies a window function to a buffer of audio samples
 * @param buffer - The audio samples to apply the window function to
 * @param windowType - The type of window function to apply
 */
export function applyWindowFunction(buffer: Float32Array, windowType: WindowFunctionType = "hann"): void {
  const n = buffer.length;

  switch (windowType.toLowerCase()) {
    case "hann":
      for (let i = 0; i < n; i++) {
        buffer[i] *= 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
      }
      break;
    case "hamming":
      for (let i = 0; i < n; i++) {
        buffer[i] *= 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (n - 1));
      }
      break;
    case "blackman":
      for (let i = 0; i < n; i++) {
        buffer[i] *= 0.42 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1)) + 0.08 * Math.cos((4 * Math.PI * i) / (n - 1));
      }
      break;
    case "rectangular":
      // No window function (rectangular)
      break;
  }
}
