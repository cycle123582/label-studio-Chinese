interface TransformCoordinate {
  x: number;
  y: number;
}

/**
 * Utility class for handling SVG transform operations
 * Supports parsing transform strings, combining matrices, and applying transformations to coordinates
 */
export class SVGTransformUtils {
  /**
   * Extract and combine transform matrix for element relative to parent
   */
  static getTransformMatrix(element: SVGElement, parent: Element): DOMMatrix | null {
    try {
      let combinedMatrix = new DOMMatrix();
      let currentElement: SVGElement | null = element;

      // Walk up the DOM tree to collect all transforms
      while (currentElement && currentElement !== parent) {
        const transform = currentElement.getAttribute("transform");
        const transformOrigin = currentElement.getAttribute("transform-origin");

        if (transform) {
          const elementMatrix = SVGTransformUtils.parseTransformString(transform, transformOrigin);
          if (elementMatrix) {
            // Multiply matrices (order matters: parent transforms are applied first)
            combinedMatrix = elementMatrix.multiply(combinedMatrix);
          }
        }

        currentElement = currentElement.parentElement as unknown as SVGElement;
      }

      return combinedMatrix.isIdentity ? null : combinedMatrix;
    } catch (error) {
      console.error(`Error getting transform matrix: ${error}`);
      return null;
    }
  }

  /**
   * Parse transform string to DOMMatrix
   */
  static parseTransformString(transformStr: string, transformOrigin?: string | null): DOMMatrix | null {
    try {
      const matrix = new DOMMatrix();

      // Handle transform-origin by translating to origin, applying transform, then translating back
      let originX = 0;
      let originY = 0;

      if (transformOrigin) {
        const origins = transformOrigin.split(/\s+/);
        originX = Number.parseFloat(origins[0]) || 0;
        originY = Number.parseFloat(origins[1]) || 0;
      }

      // Apply transform-origin offset
      if (originX !== 0 || originY !== 0) {
        matrix.translateSelf(originX, originY);
      }

      // Parse and apply transforms
      const transforms = transformStr.match(/(\w+)\s*\([^)]*\)/g) || [];

      for (const transform of transforms) {
        const [, type, params] = transform.match(/(\w+)\s*\(([^)]*)\)/) || [];
        if (!type || !params) continue;

        const values = params
          .split(/[\s,]+/)
          .map((v) => Number.parseFloat(v.trim()))
          .filter((v) => !isNaN(v));

        switch (type.toLowerCase()) {
          case "translate":
            matrix.translateSelf(values[0] || 0, values[1] || 0);
            break;
          case "translatex":
            matrix.translateSelf(values[0] || 0, 0);
            break;
          case "translatey":
            matrix.translateSelf(0, values[0] || 0);
            break;
          case "scale":
            matrix.scaleSelf(values[0] || 1, values[1] || values[0] || 1);
            break;
          case "scalex":
            matrix.scaleSelf(values[0] || 1, 1);
            break;
          case "scaley":
            matrix.scaleSelf(1, values[0] || 1);
            break;
          case "rotate":
            matrix.rotateSelf(values[0] || 0, values[1] || 0, values[2] || 0);
            break;
          case "skewx":
            matrix.skewXSelf(values[0] || 0);
            break;
          case "skewy":
            matrix.skewYSelf(values[0] || 0);
            break;
          case "matrix":
            if (values.length >= 6) {
              matrix.multiplySelf(new DOMMatrix([values[0], values[1], values[2], values[3], values[4], values[5]]));
            }
            break;
        }
      }

      // Apply inverse transform-origin offset
      if (originX !== 0 || originY !== 0) {
        matrix.translateSelf(-originX, -originY);
      }

      return matrix;
    } catch (error) {
      console.error(`Error parsing transform string "${transformStr}": ${error}`);
      return null;
    }
  }

  /**
   * Apply transform matrix to a coordinate point
   */
  static applyTransform(coord: TransformCoordinate, matrix: DOMMatrix): TransformCoordinate {
    const point = new DOMPoint(coord.x, coord.y);
    const transformedPoint = point.matrixTransform(matrix);

    return {
      x: transformedPoint.x,
      y: transformedPoint.y,
    };
  }

  /**
   * Apply transform matrix to multiple coordinate points
   */
  static applyTransformToCoordinates(coords: TransformCoordinate[], matrix: DOMMatrix | null): TransformCoordinate[] {
    return matrix ? coords.map((coord) => SVGTransformUtils.applyTransform(coord, matrix)) : coords;
  }
}

export type { TransformCoordinate };
