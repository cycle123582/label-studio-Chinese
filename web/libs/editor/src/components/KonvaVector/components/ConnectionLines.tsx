import type React from "react";
import { Line } from "react-konva";
import type { BezierPoint } from "../types";
import { CONNECTION_LINE_STYLING } from "../constants";

interface ConnectionLinesProps {
  branches: Array<{
    id: string;
    startPointId: string; // Use UUID instead of index
    points: BezierPoint[];
  }>;
  initialPoints: BezierPoint[];
  skeletonEnabled?: boolean;
  drawingStartPointIndex?: number | null;
  currentDrawingSegment?: BezierPoint[];
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  branches,
  initialPoints,
  skeletonEnabled = false,
  drawingStartPointIndex = null,
  currentDrawingSegment = [],
}) => {
  if (branches.length === 0 && (!skeletonEnabled || !drawingStartPointIndex || currentDrawingSegment.length === 0))
    return null;

  return (
    <>
      {/* Connection lines for finalized branches */}
      {branches.map((branch) => {
        if (branch.points.length === 0) return null;

        const startPoint = initialPoints.find((point) => point.id === branch.startPointId);
        const firstBranchPoint = branch.points[0];

        if (!startPoint) return null;

        return (
          <Line
            key={`connection-${branch.id}`}
            points={[startPoint.x, startPoint.y, firstBranchPoint.x, firstBranchPoint.y]}
            stroke={CONNECTION_LINE_STYLING.STROKE}
            strokeWidth={CONNECTION_LINE_STYLING.STROKE_WIDTH}
            tension={CONNECTION_LINE_STYLING.TENSION}
            lineCap={CONNECTION_LINE_STYLING.LINE_CAP}
            lineJoin={CONNECTION_LINE_STYLING.LINE_JOIN}
            strokeScaleEnabled={false}
          />
        );
      })}

      {/* Connection line for current drawing segment */}
      {skeletonEnabled && drawingStartPointIndex !== null && currentDrawingSegment.length > 0 && (
        <Line
          key="connection-current-segment"
          points={[
            initialPoints[drawingStartPointIndex].x,
            initialPoints[drawingStartPointIndex].y,
            currentDrawingSegment[0].x,
            currentDrawingSegment[0].y,
          ]}
          stroke={CONNECTION_LINE_STYLING.STROKE}
          strokeWidth={CONNECTION_LINE_STYLING.STROKE_WIDTH}
          tension={CONNECTION_LINE_STYLING.TENSION}
          lineCap={CONNECTION_LINE_STYLING.LINE_CAP}
          lineJoin={CONNECTION_LINE_STYLING.LINE_JOIN}
          strokeScaleEnabled={false}
        />
      )}
    </>
  );
};
