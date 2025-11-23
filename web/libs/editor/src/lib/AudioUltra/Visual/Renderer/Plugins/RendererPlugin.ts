import type { WaveformAudio } from "../../../Media/WaveformAudio";
import type { RenderContext } from "../Renderer";

/**
 * Interface for renderer plugins that provide additional rendering functionality.
 * Plugins follow a similar lifecycle to renderers but receive their state from
 * the parent renderer.
 */
export interface RendererPlugin<Config = unknown> {
  /**
   * The plugin's configuration.
   */
  config: Config;

  /**
   * Initializes the plugin with audio data and render state.
   * @param audio - The WaveformAudio object.
   * @param state - The current rendering state.
   */
  init(audio: WaveformAudio, state: RenderContext): void;

  /**
   * Called by the parent renderer during the render cycle.
   * @param state - The current rendering state.
   */
  render(state: RenderContext): void;

  /**
   * Updates the plugin's configuration.
   * @param config - The new configuration to apply.
   */
  updateConfig(config: Partial<Config>): void;

  /**
   * Cleans up resources used by the plugin.
   */
  destroy(): void;

  /**
   * Optional resize handler for plugins
   */
  onResize?(): void;
}
