import { nanoid } from "nanoid";
import { rgba, type RgbaColorArray } from "../Common/Color";
import { Events } from "../Common/Events";
import { clamp, getCursorTime } from "../Common/Utils";
import { CursorSymbol } from "../Cursor/Cursor";
import type { Visualizer } from "../Visual/Visualizer";
import type { Waveform } from "../Waveform";

export interface PlayheadOptions {
  x?: number;
  color?: RgbaColorArray;
  fillColor?: RgbaColorArray;
  width?: number;
  capWidth?: number;
  capHeight?: number;
  hoveredStrokeMultiplier?: number;
  capPadding?: number;
  padding?: number;
}

export interface PlayheadGlobalEvents {
  playheadUpdate: (playhead: Playhead) => void;
  playheadRemoved: (playhead: Playhead) => void;
}

interface PlayheadEvents {
  mouseEnter: (event: MouseEvent) => void;
  mouseLeave: (event: MouseEvent) => void;
  mouseDown: (event: MouseEvent) => void;
  mouseMove: (event: MouseEvent) => void;
  mouseUp: (event: MouseEvent) => void;
  click: (event: MouseEvent) => void;
}

export class Playhead extends Events<PlayheadEvents> {
  private id: string;
  private color: RgbaColorArray = rgba("#ccc");
  private fillColor: RgbaColorArray = rgba("#eee");
  private visualizer: Visualizer;
  private layerName: string;
  private wf: Waveform;
  private capWidth: number;
  private hoveredStrokeMultiplier: number;
  private _x: number;

  capHeight: number;
  capPadding: number;
  width: number;
  isHovered = false;
  isDragging = false;

  private playheadCanvas: HTMLCanvasElement;
  private playheadCanvasWidth = 0;
  private playheadCanvasHeight = 0;

  constructor(options: PlayheadOptions, visualizer: Visualizer, wf: Waveform) {
    super();
    if ((options?.x ?? 0) < 0) throw new Error("Playhead start must be greater than 0");

    this.id = nanoid(5);
    this._x = options.x ?? 0;
    this.color = options.color ? options.color : this.color;
    this.fillColor = options.fillColor ? options.fillColor : this.fillColor;
    this.width = options.width ?? 1;
    this.visualizer = visualizer;
    this.layerName = "playhead";
    this.wf = wf;
    this.capWidth = options.capWidth ?? 8;
    this.capHeight = options.capHeight ?? 5;
    this.capPadding = options.capPadding ?? 3;
    this.hoveredStrokeMultiplier = options.hoveredStrokeMultiplier ?? 2;

    this.playheadCanvas = document.createElement("canvas");
  }

  public onInit() {
    this.drawPlayheadSlice();
    this.initialize();
  }

  /**
   * Redraw the playhead's offscreen canvas.
   * Should be called:
   * - On hover in/out (to update shadow or style)
   * - On drag start/end (if style changes)
   * - On construction (initial draw)
   * - On style/size changes (color, width, cap, height, etc.)
   * Should NOT be called on every time/position update.
   */
  public drawPlayheadSlice() {
    const pixelRatio = (this.visualizer as any).pixelRatio || window.devicePixelRatio || 1;
    const width = this.capWidth + 2;
    const height = this.visualizer.height;
    if (
      this.playheadCanvasWidth !== width ||
      this.playheadCanvasHeight !== height ||
      this.playheadCanvas.width !== width * pixelRatio ||
      this.playheadCanvas.height !== height * pixelRatio
    ) {
      this.playheadCanvas.width = width * pixelRatio;
      this.playheadCanvas.height = height * pixelRatio;
      this.playheadCanvasWidth = width;
      this.playheadCanvasHeight = height;
    }
    const ctx = this.playheadCanvas.getContext("2d")!;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    if (this.isHovered) {
      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = 12;
    } else {
      ctx.shadowColor = "rgba(0,0,0,0.45)";
      ctx.shadowBlur = 16;
    }
    const x = width / 2;
    const y = this.visualizer.reservedSpace;
    ctx.fillStyle = this.fillColor.toString();
    ctx.strokeStyle = this.color.toString();
    ctx.lineWidth = this.width;
    this.moveTo(ctx, x, y, height);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

  private moveTo(ctx: CanvasRenderingContext2D, x: number, y: number, height: number) {
    const { capWidth, capHeight, capPadding } = this;
    const playheadCapY = y - capHeight - capPadding;
    const halfCapWidth = capWidth / 2;
    ctx.moveTo(x - halfCapWidth, playheadCapY);
    ctx.lineTo(x + halfCapWidth, playheadCapY);
    ctx.lineTo(x + halfCapWidth, playheadCapY + capHeight - 1);
    ctx.lineTo(x, playheadCapY + capHeight);
    ctx.lineTo(x, height);
    ctx.lineTo(x, playheadCapY + capHeight);
    ctx.lineTo(x - halfCapWidth, playheadCapY + capHeight - 1);
  }

  public renderTo(ctx: CanvasRenderingContext2D, x: number) {
    if (
      !ctx ||
      this.playheadCanvas.width === 0 ||
      this.playheadCanvas.height === 0 ||
      ctx.canvas.width === 0 ||
      ctx.canvas.height === 0
    ) {
      return;
    }
    ctx.save();
    const pixelRatio = (this.visualizer as any).pixelRatio || window.devicePixelRatio || 1;
    ctx.globalAlpha = 1.0;
    ctx.drawImage(this.playheadCanvas, (x - this.playheadCanvasWidth / 2) * pixelRatio, 0);
    ctx.restore();
  }

  updatePositionFromTime(time: number, _renderVisible = false, useClamp = true) {
    const newX = (time / this.wf.duration - this.scroll) * this.fullWidth;
    const x = useClamp ? clamp(newX, 0, this.fullWidth) : newX;

    this.setX(x);
  }

  private mouseDown = (e: MouseEvent) => {
    if (this.isHovered) {
      e.preventDefault();
      e.stopPropagation();
      this.isDragging = true;
      this.wf.cursor.set(CursorSymbol.grabbing, "playhead");

      const handleMouseMove = (e: MouseEvent) => {
        if (this.isDragging) {
          e.preventDefault();
          e.stopPropagation();
          const parentOffset = (this.visualizer.container as HTMLElement).getBoundingClientRect();
          const cursorOffset = e.clientX - parentOffset.left;
          const x = clamp(cursorOffset, 0, this.visualizer.width);

          if (x !== this._x) {
            this.setX(x);
            this.wf.currentTime = getCursorTime(e, this.visualizer, this.wf.duration);
            this.drawPlayheadSlice();
            this.visualizer.transferImage();
          }
        }
      };

      const handleMouseUp = (e: MouseEvent) => {
        if (this.isDragging) {
          e.preventDefault();
          e.stopPropagation();
          this.isDragging = false;
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
          this.drawPlayheadSlice();
          this.visualizer.draw();
          this.wf.cursor.set(CursorSymbol.default);
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      this.drawPlayheadSlice();
      this.visualizer.transferImage();
    }
  };

  private mouseEnter = () => {
    if (!this.isDragging) {
      if (!this.wf.cursor.hasFocus()) {
        this.wf.cursor.set(CursorSymbol.grab, "playhead");
      }
      this.isHovered = true;
      this.drawPlayheadSlice();
      this.visualizer.transferImage();
    }
  };

  private mouseLeave = () => {
    if (!this.isDragging) {
      this.isHovered = false;
      this.drawPlayheadSlice();
      this.visualizer.transferImage();
      if (this.wf.cursor.isFocused("playhead")) {
        this.wf.cursor.set(CursorSymbol.default);
      }
    }
  };

  private playing = (time: number, useClamp = true) => {
    if (!this.isDragging) {
      this.updatePositionFromTime(time, true, useClamp);
    }
  };

  private onZoom = () => {
    this.playing(this.time, false);
  };

  private onScroll = () => {
    this.playing(this.time, false);
  };

  private initialize() {
    this.on("mouseDown", this.mouseDown);
    this.on("mouseEnter", this.mouseEnter);
    this.on("mouseLeave", this.mouseLeave);
    this.wf.on("playing", this.playing);
    this.wf.on("zoom", this.onZoom);
    this.wf.on("scroll", this.onScroll);
  }

  private removeEvents() {
    this.off("mouseDown", this.mouseDown);
    this.off("mouseEnter", this.mouseEnter);
    this.off("mouseLeave", this.mouseLeave);
    this.wf.off("playing", this.playing);
    this.wf.off("zoom", this.onZoom);
    this.wf.off("scroll", this.onScroll);
  }

  private get scroll() {
    return this.visualizer.getScrollLeft();
  }

  private get zoom() {
    return this.wf.zoom;
  }

  get time() {
    return this.wf.currentTime;
  }

  get x() {
    return this._x + this.scroll;
  }

  get containerWidth() {
    return this.visualizer.container.clientWidth;
  }

  get fullWidth() {
    return this.visualizer.fullWidth;
  }

  setX(x: number) {
    this._x = x;
  }

  toJSON() {
    return {
      x: this.x,
      color: this.color.toString(),
      layerName: this.layerName,
      id: this.id,
    };
  }

  /**
   * Destroy playhead
   * Remove all event listeners and remove the playhead from the canvas
   */
  destroy() {
    if (this.isDestroyed) return;

    this.removeEvents();
    super.destroy();
  }
}
