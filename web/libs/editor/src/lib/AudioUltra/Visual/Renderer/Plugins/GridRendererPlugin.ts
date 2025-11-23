import type { Layer } from "../../Layer";
import type { SpectrogramScale } from "../../../Analysis/FFTProcessor";
import type { ColorMapper } from "../../ColorMapper";
import type { RendererPlugin } from "./RendererPlugin";
import type { WaveformAudio } from "../../../Media/WaveformAudio";
import type { RenderContext } from "../Renderer";

/**
 * Renders a frequency grid and labels on the spectrogram-grid layer.
 * All dependencies are passed via the constructor. Only runtime-tunable options are in config.
 */
export interface GridRendererPluginConfig {
  spectrogramScale: SpectrogramScale;
  visible: boolean;
}

export interface GridRendererPluginConstructorConfig {
  height: number;
  fontSize?: number;
}

export class GridRendererPlugin implements RendererPlugin<GridRendererPluginConfig> {
  private readonly layer: Layer;
  private readonly colorMapper: ColorMapper;
  public config: GridRendererPluginConfig;
  private audio: WaveformAudio | null = null;
  private height = 0;
  private fontSize = 11;
  private gridNeedsRedraw = false;

  constructor(
    layer: Layer,
    colorMapper: ColorMapper,
    config: GridRendererPluginConstructorConfig & GridRendererPluginConfig,
  ) {
    this.layer = layer;
    this.colorMapper = colorMapper;
    this.height = config.height;
    this.fontSize = config.fontSize ?? 11;
    this.config = {
      visible: config.visible,
      spectrogramScale: config.spectrogramScale,
    };
  }

  /**
   * Update runtime-tunable config options.
   */
  public updateConfig(config: Partial<GridRendererPluginConfig>) {
    const oldConfig = { ...this.config };

    // Handle SpectrogramScale updates
    if ("spectrogramScale" in config) {
      this.config = { ...this.config, ...config };
      if (oldConfig.spectrogramScale !== this.config.spectrogramScale) {
        this.gridNeedsRedraw = true;
      }
    }

    if ("visible" in config) {
      this.config.visible = config.visible ?? this.config.visible;
      this.gridNeedsRedraw = true;
    }

    if (!this.config.visible) {
      this.layer.clear();
    }
  }

  /**
   * RendererPlugin interface: store audio and state.
   */
  public init(audio: WaveformAudio, _state: RenderContext): void {
    this.audio = audio;
    this.gridNeedsRedraw = true;
  }

  /**
   * RendererPlugin interface: render the grid using current state.
   */
  public render(state: RenderContext): void {
    if (!this.config.visible) return;
    if (this.gridNeedsRedraw) {
      this.drawFrequencyGrid(state);
    }
    this.gridNeedsRedraw = false;
  }

  /**
   * RendererPlugin interface: clean up if needed.
   */
  public destroy(): void {
    this.layer.clear();
  }

  /**
   * Request a grid redraw on the next render cycle.
   */
  public requestGridRedraw(): void {
    this.gridNeedsRedraw = true;
  }

  /**
   * Draws a frequency grid and labels on the spectrogram-grid layer.
   * Uses only constructor dependencies, config, and state.
   */
  private drawFrequencyGrid(state: RenderContext) {
    const audio = this.audio;
    if (!audio) return;
    const width = state.width;
    const height = this.height;
    const paddingLeft = (state as any).padding?.left ?? 0;
    const ctx = this.layer.context;
    const sampleRate = audio.sampleRate;
    const scale = this.config.spectrogramScale;
    const fontSize = this.fontSize;
    const colorMapper = this.colorMapper;
    const gridColor = colorMapper.magnitudeToColor(1);
    const gridShadowColor = colorMapper.magnitudeToColor(0);
    const labelBgColor = colorMapper.magnitudeToColor(0);
    const labelColor = colorMapper.magnitudeToColor(1);
    const labelPadding = 2;
    const pixelRatio = this.layer.pixelRatio ?? 1;
    this.layer.clear();
    this.layer.save();
    ctx.font = `${fontSize * pixelRatio}px sans-serif`;
    ctx.textBaseline = "middle";
    this.layer.strokeStyle = gridColor;
    this.layer.fillStyle = labelColor;
    this.layer.lineWidth = 1;

    let gridFreqs: number[] = [];
    const nyquist = sampleRate / 2;
    if (scale === "linear") {
      const approxStep = nyquist / 10;
      let step: number;
      if (approxStep > 2000) step = 2000;
      else if (approxStep > 1000) step = 1000;
      else if (approxStep > 500) step = 500;
      else if (approxStep > 100) step = 100;
      else step = 50;
      for (let f = 0; f <= nyquist; f += step) gridFreqs.push(f);
      if (gridFreqs[gridFreqs.length - 1] !== nyquist) gridFreqs.push(nyquist);
    } else if (scale === "log") {
      const decades = Math.floor(Math.log10(nyquist)) - 1;
      for (let d = 1; d <= decades; d++) {
        for (const m of [1, 2, 5]) {
          const f = m * 10 ** d;
          if (f > nyquist) break;
          gridFreqs.push(f);
        }
      }
      if (gridFreqs[0] !== 0) gridFreqs.unshift(0);
      if (gridFreqs[gridFreqs.length - 1] !== nyquist) gridFreqs.push(nyquist);
    } else if (scale === "mel") {
      const melGridPoints = [0, 500, 1000, 2000, 4000, 8000, 12000, 16000];
      const specificMelFreqs = melGridPoints.filter((f) => f <= nyquist);
      // Ensure 0Hz is present for Mel scale if not already by melGridPoints filter for f <= nyquist
      if (!specificMelFreqs.includes(0)) {
        specificMelFreqs.unshift(0);
      }
      if (!specificMelFreqs.includes(nyquist)) {
        specificMelFreqs.push(nyquist);
      }
      gridFreqs = [...new Set(specificMelFreqs)].sort((a, b) => a - b);
    }

    // Reduce label density if height is small
    if (height <= 200 && gridFreqs.length > 2) {
      // Check gridFreqs.length > 2 to ensure there are intermediate labels to remove
      const keptFreqs = [gridFreqs[0]]; // Always keep the first frequency (e.g., 0Hz)
      // Iterate through the intermediate frequencies and pick roughly half
      const intermediateFreqs = gridFreqs.slice(1, gridFreqs.length - 1);
      for (let i = 0; i < intermediateFreqs.length; i++) {
        if (i % 2 === 0) {
          // Take every other intermediate frequency
          keptFreqs.push(intermediateFreqs[i]);
        }
      }
      keptFreqs.push(gridFreqs[gridFreqs.length - 1]); // Always keep the last frequency (Nyquist)
      gridFreqs = [...new Set(keptFreqs)].sort((a, b) => a - b); // Remove duplicates and re-sort
    }

    const MEL_0HZ_SHIFT_PX = 5 * pixelRatio; // Define the upward shift for 0Hz on Mel scale

    for (const freq of gridFreqs) {
      let y: number;
      if (scale === "linear" || scale === "mel") {
        y = height * (1 - freq / nyquist);
        if (scale === "mel" && freq === 0) {
          y -= MEL_0HZ_SHIFT_PX; // Apply upward shift for 0Hz on Mel scale
        }
      } else if (scale === "log") {
        const minFreq = 10;
        if (freq < minFreq && freq !== 0) continue; // Allow 0Hz for log if it's in gridFreqs
        if (freq === 0) {
          y = height; // 0Hz at the bottom for log scale (if drawn)
        } else {
          y = height * (1 - Math.log10(freq / minFreq) / Math.log10(nyquist / minFreq));
        }
      } else {
        y = height * (1 - freq / nyquist); // Fallback, should not be reached if scale is one of the known types
      }

      // Clamp y to be within the drawable height to avoid lines outside the view
      y = Math.max(0, Math.min(height, y));

      this.layer.save();
      ctx.shadowColor = gridShadowColor;
      ctx.shadowBlur = 2 * pixelRatio;
      ctx.shadowOffsetY = 1 * pixelRatio;
      ctx.setLineDash([4 * pixelRatio, 4 * pixelRatio]);
      this.layer.beginPath();
      this.layer.moveTo(paddingLeft, y);
      this.layer.lineTo(paddingLeft + width, y);
      this.layer.stroke();
      this.layer.restore();

      let label: string;
      if (freq >= 1000) label = `${(freq / 1000).toFixed(freq % 1000 === 0 ? 0 : 1)} kHz`;
      else label = `${Math.round(freq)} Hz`;
      const textX = paddingLeft + labelPadding;
      const textMetrics = this.layer.measureText(label);
      const rectPaddingX = 4;
      const rectPaddingY = 2;
      const rectWidth = (textMetrics.width + rectPaddingX * 2) / pixelRatio;
      const rectHeight = fontSize + rectPaddingY * 2;
      const rectX = textX - rectPaddingX;
      let rectY: number;
      let textY: number;

      if (scale === "linear" && freq === 0) {
        rectY = y - rectHeight;
        textY = y - rectHeight / 2;
      } else if (scale === "mel" && freq === 0) {
        // New condition for Mel 0Hz label
        rectY = y - rectHeight; // Align bottom of label with the (shifted) grid line
        textY = y - rectHeight / 2;
      } else if (scale === "log" && freq === 10) {
        rectY = y - rectHeight;
        textY = y - rectHeight / 2;
      } else if (freq === nyquist) {
        rectY = y;
        textY = y + rectHeight / 2;
      } else {
        textY = y;
        rectY = textY - rectHeight / 2;
      }

      this.layer.save();
      this.layer.fillStyle = labelBgColor;
      this.layer.fillRect(rectX, rectY, rectWidth, rectHeight);
      this.layer.restore();
      this.layer.fillStyle = labelColor;
      this.layer.fillText(label, textX, textY);
    }
    this.layer.restore();
  }

  onResize() {
    // Plugin-specific resize logic can be added here if needed
    // For example, you might want to recalculate cached layout or mark for redraw
    this.requestGridRedraw();
  }
}
