/**
 * Utility functions for comparing and validating SVG bounding boxes
 * These are pure functions that don't depend on Cypress and can be unit tested
 */

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class BoundingBoxUtils {
  /**
   * Check if two bounding boxes are equal within tolerance
   */
  static isEqual(bbox1: BoundingBox, bbox2: BoundingBox, tolerance = 2): boolean {
    const xEqual = Math.abs(bbox1.x - bbox2.x) <= tolerance;
    const yEqual = Math.abs(bbox1.y - bbox2.y) <= tolerance;
    const widthEqual = Math.abs(bbox1.width - bbox2.width) <= tolerance;
    const heightEqual = Math.abs(bbox1.height - bbox2.height) <= tolerance;

    return xEqual && yEqual && widthEqual && heightEqual;
  }
}
