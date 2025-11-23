import type { BezierPoint } from "../types";

// Calculate the bounding box of a cubic bezier curve
// Uses the derivative method to find extrema points
function getBezierCurveBoundingBox(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
): { left: number; top: number; right: number; bottom: number } {
  // Start with the endpoints
  let minX = Math.min(p0.x, p3.x);
  let maxX = Math.max(p0.x, p3.x);
  let minY = Math.min(p0.y, p3.y);
  let maxY = Math.max(p0.y, p3.y);

  // Calculate coefficients for the derivative (for finding extrema)
  const ax = 3 * (p1.x - p0.x);
  const bx = 3 * (p2.x - p1.x) - ax;
  const cx = p3.x - p0.x - ax - bx;

  const ay = 3 * (p1.y - p0.y);
  const by = 3 * (p2.y - p1.y) - ay;
  const cy = p3.y - p0.y - ay - by;

  // Find extrema for x (where derivative = 0)
  const xExtrema = solveQuadratic(bx, 2 * ax, cx);
  for (const t of xExtrema) {
    if (t >= 0 && t <= 1) {
      const x =
        p0.x + t * (3 * (p1.x - p0.x) + t * (3 * (p2.x - 2 * p1.x + p0.x) + t * (p3.x - 3 * p2.x + 3 * p1.x - p0.x)));
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
    }
  }

  // Find extrema for y (where derivative = 0)
  const yExtrema = solveQuadratic(by, 2 * ay, cy);
  for (const t of yExtrema) {
    if (t >= 0 && t <= 1) {
      const y =
        p0.y + t * (3 * (p1.y - p0.y) + t * (3 * (p2.y - 2 * p1.y + p0.y) + t * (p3.y - 3 * p2.y + 3 * p1.y - p0.y)));
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  return { left: minX, top: minY, right: maxX, bottom: maxY };
}

// Solve quadratic equation ax² + bx + c = 0
function solveQuadratic(a: number, b: number, c: number): number[] {
  if (Math.abs(a) < 1e-10) {
    // Linear equation
    if (Math.abs(b) < 1e-10) return [];
    return [-c / b];
  }

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return [];

  const sqrtDisc = Math.sqrt(discriminant);
  const solutions: number[] = [];

  const t1 = (-b + sqrtDisc) / (2 * a);
  if (t1 >= 0 && t1 <= 1) solutions.push(t1);

  const t2 = (-b - sqrtDisc) / (2 * a);
  if (t2 >= 0 && t2 <= 1) solutions.push(t2);

  return solutions;
}

// Calculate the bounding box of a shape including all bezier curves
export function calculateShapeBoundingBox(points: BezierPoint[]): {
  left: number;
  top: number;
  right: number;
  bottom: number;
} {
  if (points.length === 0) {
    return { left: 0, top: 0, right: 0, bottom: 0 };
  }

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  // Process each segment
  for (let i = 0; i < points.length; i++) {
    const currentPoint = points[i];
    const nextPoint = points[(i + 1) % points.length];

    // Add the current point to the bounding box
    minX = Math.min(minX, currentPoint.x);
    minY = Math.min(minY, currentPoint.y);
    maxX = Math.max(maxX, currentPoint.x);
    maxY = Math.max(maxY, currentPoint.y);

    // If this is a bezier curve, calculate its bounding box
    if (currentPoint.isBezier && currentPoint.controlPoint1 && currentPoint.controlPoint2) {
      const curveBBox = getBezierCurveBoundingBox(
        { x: currentPoint.x, y: currentPoint.y },
        { x: currentPoint.controlPoint1.x, y: currentPoint.controlPoint1.y },
        { x: currentPoint.controlPoint2.x, y: currentPoint.controlPoint2.y },
        { x: nextPoint.x, y: nextPoint.y },
      );

      minX = Math.min(minX, curveBBox.left);
      minY = Math.min(minY, curveBBox.top);
      maxX = Math.max(maxX, curveBBox.right);
      maxY = Math.max(maxY, curveBBox.bottom);
    }
  }

  return { left: minX, top: minY, right: maxX, bottom: maxY };
}
