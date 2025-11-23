export interface SparkleAreaOptions {
  areaShape: "circle" | "rect";
  areaWidth?: number;
  areaHeight?: number;
  areaRadius?: number;
  cutoutShape: "circle" | "rect";
  cutoutWidth?: number;
  cutoutHeight?: number;
  cutoutRadius?: number;
  center: { x: number; y: number };
}

export interface Sparkle {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: {
    position: "absolute";
    top: string;
    left: string;
    pointerEvents: "none";
    zIndex: number;
  };
}
