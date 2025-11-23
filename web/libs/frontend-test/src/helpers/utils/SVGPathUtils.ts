interface PathCoordinate {
  x: number;
  y: number;
}

/**
 * Utility class for handling SVG path operations
 * Supports parsing path data and extracting coordinates
 */
export class SVGPathUtils {
  /**
   * Simple parser for extracting coordinates from SVG path data
   */
  static extractPathCoordinates(pathData: string): PathCoordinate[] {
    const coords: PathCoordinate[] = [];

    // Simple regex to extract numeric coordinates
    // Look for pairs of numbers after commands like M, L, C, etc.
    const matches = pathData.match(/[\d.-]+/g);

    if (matches && matches.length >= 2) {
      for (let i = 0; i < matches.length - 1; i += 2) {
        const x = Number.parseFloat(matches[i]);
        const y = Number.parseFloat(matches[i + 1]);

        if (!isNaN(x) && !isNaN(y)) {
          coords.push({ x, y });
        }
      }
    }

    return coords;
  }
}

export type { PathCoordinate };
