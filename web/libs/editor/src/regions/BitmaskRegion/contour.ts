import simplify from "simplify-js";

/**
 * Generates outline contours from a pixel-based region/mask
 *
 * @param item - Object containing the canvas with pixel data and rendering properties
 * @returns Array of flattened point coordinates forming contours around the shapes
 */
export function generateMultiShapeOutline(item: {
  highlighted: boolean;
  offscreenCanvasRef: HTMLCanvasElement;
  parent: any;
}) {
  if (!item.offscreenCanvasRef) return [];

  const ctx = item.offscreenCanvasRef.getContext("2d");
  if (!ctx) return [];

  const { width, height } = item.offscreenCanvasRef;
  const data = ctx.getImageData(0, 0, width, height).data;

  // Create a binary grid from the image data (1 for visible pixels, 0 for transparent)
  const grid: number[][] = [];
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      row.push(alpha > 0 ? 1 : 0);
    }
    grid.push(row);
  }

  const visited = Array.from({ length: height }, () => Array(width).fill(false));
  const dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  // Helper to check if two points are within 1 pixel (including diagonals)
  const isNear = (x1: number, y1: number, x2: number, y2: number) => Math.abs(x1 - x2) <= 1 && Math.abs(y1 - y2) <= 1;

  /**
   * Determines if a pixel is on the edge of a shape
   * A pixel is an edge if it's non-transparent and has at least one transparent neighbor
   */
  const isEdge = (x: number, y: number): boolean => {
    if (grid[y][x] === 0) return false;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height || grid[ny][nx] === 0) {
          return true;
        }
      }
    }
    return false;
  };

  /**
   * Traces a contour starting from a given point
   * Uses a boundary-following algorithm to create a closed path
   */
  const trace = (sx: number, sy: number) => {
    const path = [];
    const seen = new Set();
    let x = sx;
    let y = sy;
    let dir = 0;
    let closed = false;

    for (let steps = 0; steps < 5000; steps++) {
      path.push([x, y]);
      seen.add(`${x},${y}`);
      visited[y][x] = true;
      let moved = false;

      for (let i = 0; i < 4; i++) {
        const d = (dir + i) % 4;
        const [dx, dy] = dirs[d];
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < width && ny < height && isEdge(nx, ny) && !seen.has(`${nx},${ny}`)) {
          x = nx;
          y = ny;
          dir = d;
          moved = true;
          break;
        }
      }

      // Only close if we're back near the start and the path is long enough
      if (!moved || (path.length > 10 && isNear(x, y, sx, sy))) {
        closed = isNear(x, y, sx, sy) && path.length > 10;
        break;
      }
    }

    // Only accept closed contours
    if (closed) {
      return path;
    }
    return [];
  };

  // Find and trace all contours in the image
  const contours: number[][][] = [];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (isEdge(x, y) && !visited[y][x]) {
        const contour = trace(x, y);
        if (contour.length > 5) {
          contours.push(contour);
        }
      }
    }
  }

  // Scale and simplify the contours for rendering
  const scale = item.parent.stageZoom;
  return contours.map((contour) => {
    const simplified = simplify(
      contour.map(([x, y]) => ({ x: x * scale, y: y * scale })),
      1.5,
      true,
    );
    return simplified.flatMap(({ x, y }) => [x, y]);
  });
}
