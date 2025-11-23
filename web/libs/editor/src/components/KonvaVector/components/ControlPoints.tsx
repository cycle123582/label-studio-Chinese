import React from "react";
import { Line, Rect } from "react-konva";
import type { BezierPoint } from "../types";
import { CONTROL_POINT_DIAMOND, CONTROL_POINT_STYLING } from "../constants";

interface ControlPointsProps {
  initialPoints: BezierPoint[];
  selectedPointIndex: number | null;
  isDraggingNewBezier: boolean;
  draggedControlPoint: { pointIndex: number; controlIndex: number } | null;
  visibleControlPoints: Set<number>;
  transform: { zoom: number; offsetX: number; offsetY: number };
  fitScale: number;
}

export const ControlPoints: React.FC<ControlPointsProps> = ({
  initialPoints,
  selectedPointIndex,
  isDraggingNewBezier,
  draggedControlPoint,
  visibleControlPoints,
  transform,
  fitScale,
}) => {
  return (
    <>
      {initialPoints.map((point, index) => {
        if (!point.isBezier) return null;

        // Show control points if point is selected, we're creating this specific Bezier point, control points are marked as visible, or it's a bezier point
        const shouldShowControls =
          selectedPointIndex === index ||
          (isDraggingNewBezier && draggedControlPoint?.pointIndex === index) ||
          visibleControlPoints.has(index) ||
          point.isBezier;
        if (!shouldShowControls) return null;

        // Scale up radius to compensate for Layer scaling
        const scale = transform.zoom * fitScale;
        const scaledRadius = 4 / scale;

        return (
          <React.Fragment
            key={`control-group-${index}-${point.x.toFixed(2)}-${point.y.toFixed(2)}-${point.controlPoint1?.x.toFixed(2) || "null"}-${point.controlPoint1?.y.toFixed(2) || "null"}-${point.controlPoint2?.x.toFixed(2) || "null"}-${point.controlPoint2?.y.toFixed(2) || "null"}`}
          >
            {/* Control point lines - render first so they appear under the points */}
            {point.controlPoint1 && (
              <>
                {/* White solid background line */}
                <Line
                  points={[point.x, point.y, point.controlPoint1.x, point.controlPoint1.y]}
                  stroke={CONTROL_POINT_STYLING.LINE_STROKE}
                  strokeWidth={CONTROL_POINT_STYLING.LINE_STROKE_WIDTH}
                  strokeScaleEnabled={false}
                />
              </>
            )}
            {point.controlPoint2 && (
              <>
                {/* White solid background line */}
                <Line
                  points={[point.x, point.y, point.controlPoint2.x, point.controlPoint2.y]}
                  stroke={CONTROL_POINT_STYLING.LINE_STROKE}
                  strokeWidth={CONTROL_POINT_STYLING.LINE_STROKE_WIDTH}
                  opacity={CONTROL_POINT_STYLING.CONTROL_POINT_2_OPACITY}
                  strokeScaleEnabled={false}
                />
              </>
            )}
            {/* Control point diamonds - render after lines so they appear on top */}
            {point.controlPoint1 && (
              <Rect
                x={point.controlPoint1.x}
                y={point.controlPoint1.y}
                width={scaledRadius * CONTROL_POINT_DIAMOND.WIDTH_HEIGHT_MULTIPLIER}
                height={scaledRadius * CONTROL_POINT_DIAMOND.WIDTH_HEIGHT_MULTIPLIER}
                offsetX={scaledRadius * CONTROL_POINT_DIAMOND.OFFSET_MULTIPLIER}
                offsetY={scaledRadius * CONTROL_POINT_DIAMOND.OFFSET_MULTIPLIER}
                rotation={CONTROL_POINT_DIAMOND.ROTATION}
                fill={CONTROL_POINT_STYLING.DIAMOND_FILL}
                stroke={CONTROL_POINT_STYLING.DIAMOND_STROKE}
                strokeWidth={CONTROL_POINT_STYLING.DIAMOND_STROKE_WIDTH}
                strokeScaleEnabled={false}
                listening={true}
              />
            )}
            {point.controlPoint2 && (
              <Rect
                x={point.controlPoint2.x}
                y={point.controlPoint2.y}
                width={scaledRadius * CONTROL_POINT_DIAMOND.WIDTH_HEIGHT_MULTIPLIER}
                height={scaledRadius * CONTROL_POINT_DIAMOND.WIDTH_HEIGHT_MULTIPLIER}
                offsetX={scaledRadius * CONTROL_POINT_DIAMOND.OFFSET_MULTIPLIER}
                offsetY={scaledRadius * CONTROL_POINT_DIAMOND.OFFSET_MULTIPLIER}
                rotation={CONTROL_POINT_DIAMOND.ROTATION}
                fill={CONTROL_POINT_STYLING.DIAMOND_FILL}
                stroke={CONTROL_POINT_STYLING.DIAMOND_STROKE}
                strokeWidth={CONTROL_POINT_STYLING.DIAMOND_STROKE_WIDTH}
                strokeScaleEnabled={false}
                listening={true}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};
