import type { WaveformAudio } from "../../Media/WaveformAudio";

/**
 * Parameters representing the current state needed for rendering.
 */
export interface RenderContext {
  scrollLeftPx: number;
  width: number;
  zoom: number;
  samplesPerPx: number;
  dataLength: number;
  /**
   * Callback to notify the parent visualizer that the render is complete and a transferImage may be needed.
   */
  notifyRenderComplete?: () => void;
}

/**
 * Interface for decoupled rendering strategies.
 * @template Config - The configuration type specific to the renderer implementation.
 */
export interface Renderer<Config = unknown> {
  /**
   * The renderer's configuration.
   */
  config: Config;

  /**
   * Initializes the renderer with audio data and render context.
   * @param context - The current rendering context.
   * @param audio - The WaveformAudio object.
   */
  init(context: RenderContext, audio: WaveformAudio): void;

  /**
   * Draws the visualization based on the provided context.
   * @param context - The current rendering context (scroll, zoom, dimensions, etc.).
   */
  draw(context: RenderContext): void;

  /**
   * Updates the renderer's configuration.
   * @param config - The new configuration to apply.
   */
  updateConfig(config: Config): void;

  /**
   * Cleans up resources used by the renderer.
   */
  destroy(): void;

  /**
   * Optional resize handler for renderers
   */
  onResize?(): void;
}
