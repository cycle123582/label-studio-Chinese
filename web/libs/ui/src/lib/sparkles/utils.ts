import type { SparkleAreaOptions } from "./types";

/**
 * Generate a random position for a sparkle within an area, avoiding a cutout in the center.
 */
export function randomPositionAvoidingCenter(options: SparkleAreaOptions): { top: number; left: number } {
  const {
    areaShape,
    areaWidth = 28,
    areaHeight = 28,
    areaRadius = 14,
    cutoutShape,
    cutoutWidth = 0,
    cutoutHeight = 0,
    cutoutRadius = 12,
    center,
  } = options;

  for (let i = 0; i < 10; i++) {
    let top: number;
    let left: number;
    if (areaShape === "circle") {
      const angle = Math.random() * 2 * Math.PI;
      const r =
        cutoutShape === "circle"
          ? cutoutRadius + Math.random() * (areaRadius - cutoutRadius)
          : Math.random() * areaRadius;
      top = center.y + r * Math.sin(angle);
      left = center.x + r * Math.cos(angle);
    } else {
      // areaShape === 'rect'
      top = center.y - areaHeight / 2 + Math.random() * areaHeight;
      left = center.x - areaWidth / 2 + Math.random() * areaWidth;
    }
    // Check if inside cutout
    let inCutout = false;
    if (cutoutShape === "circle") {
      const dx = left - center.x;
      const dy = top - center.y;
      if (Math.sqrt(dx * dx + dy * dy) < cutoutRadius) inCutout = true;
    } else if (cutoutShape === "rect") {
      if (
        left > center.x - cutoutWidth / 2 &&
        left < center.x + cutoutWidth / 2 &&
        top > center.y - cutoutHeight / 2 &&
        top < center.y + cutoutHeight / 2
      ) {
        inCutout = true;
      }
    }
    // Check if inside area
    let inArea = true;
    if (areaShape === "circle") {
      const dx = left - center.x;
      const dy = top - center.y;
      if (Math.sqrt(dx * dx + dy * dy) > areaRadius) inArea = false;
    } else if (areaShape === "rect") {
      if (
        left < center.x - areaWidth / 2 ||
        left > center.x + areaWidth / 2 ||
        top < center.y - areaHeight / 2 ||
        top > center.y + areaHeight / 2
      ) {
        inArea = false;
      }
    }
    if (!inCutout && inArea) {
      return { top, left };
    }
  }
  // fallback: center of area
  return { top: center.y, left: center.x };
}
