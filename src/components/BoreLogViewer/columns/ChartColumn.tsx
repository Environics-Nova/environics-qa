import React from 'react';
import type { ChartColumn as ChartColumnType } from '../types';
import { depthToY, clampDepth } from '../utils/depthUtils';

interface ChartColumnProps {
  column: ChartColumnType;
  startDepth: number;
  endDepth: number;
  bodyHeight: number;
}

const ChartColumnComponent: React.FC<ChartColumnProps> = ({
  column,
  startDepth,
  endDepth,
  bodyHeight,
}) => {
  const xStart = parseFloat(String(column.xScaleStart ?? 0));
  const xEnd = parseFloat(String(column.xScaleEnd ?? 100));
  const useLog = column.useLogScale ?? false;
  const colour = column.colour || column.color || '#999';
  const lineWeight = parseFloat(String(column.lineWeight ?? 1));
  const useDepthRange = column.useDepthRange ?? false;
  const guidelines = column.xScaleGuidelines || [];
  const showGuidelines = column.showXScaleGuidelines ?? false;
  const showLabels = column.showXScaleLabels ?? false;
  const guidelineColour = column.xScaleGuidelineColour || '#ccc';

  // Convert value to X position (0-100%)
  const valueToX = (value: number): number => {
    if (useLog) {
      if (value <= 0 || xStart <= 0 || xEnd <= 0) return 0;
      const logVal = Math.log10(value);
      const logStart = Math.log10(xStart);
      const logEnd = Math.log10(xEnd);
      return ((logVal - logStart) / (logEnd - logStart)) * 100;
    }
    return ((value - xStart) / (xEnd - xStart)) * 100;
  };

  // Filter data points that have numeric values
  const dataPoints = column.data.filter(
    (d) => d.value !== undefined && d.value !== null && d.value !== '',
  );

  // Scale label area height
  const scaleAreaHeight = showLabels || showGuidelines ? 15 : 0;

  return (
    <svg
      width="100%"
      height={bodyHeight + scaleAreaHeight}
      style={{ display: 'block', marginTop: -scaleAreaHeight }}
      data-testid="chart-column-svg"
    >
      {/* Scale labels at top */}
      {showLabels && guidelines.length > 0 && (
        <g>
          {guidelines.map((gl) => {
            const x = valueToX(gl.value);
            return (
              <text
                key={gl.id}
                x={`${x}%`}
                y={10}
                textAnchor="middle"
                fontSize={5}
                fill="#666"
              >
                {gl.label}
              </text>
            );
          })}
        </g>
      )}

      {/* Vertical guidelines */}
      {showGuidelines &&
        guidelines.map((gl) => {
          const x = valueToX(gl.value);
          return (
            <line
              key={`gl-${gl.id}`}
              x1={`${x}%`}
              y1={scaleAreaHeight}
              x2={`${x}%`}
              y2={bodyHeight + scaleAreaHeight}
              stroke={guidelineColour}
              strokeWidth={0.5}
              strokeDasharray="2,2"
            />
          );
        })}

      {/* Data rendering */}
      {useDepthRange
        ? // Bar chart mode (% Recovery style)
          dataPoints.map((point) => {
            const val = parseFloat(String(point.value));
            if (isNaN(val)) return null;

            const d1 = clampDepth(point.d1, startDepth, endDepth);
            const d2 = point.d2 !== null
              ? clampDepth(point.d2, startDepth, endDepth)
              : d1;
            const y1 = depthToY(d1, startDepth, endDepth, bodyHeight) + scaleAreaHeight;
            const y2 = depthToY(d2, startDepth, endDepth, bodyHeight) + scaleAreaHeight;
            const h = Math.max(y2 - y1, 1);
            const w = valueToX(val);

            return (
              <rect
                key={point.id}
                x={0}
                y={y1}
                width={`${w}%`}
                height={h}
                fill={colour}
                opacity={0.6}
                stroke={colour}
                strokeWidth={0.5}
                data-testid={`chart-bar-${point.id}`}
              />
            );
          })
        : // Line/point chart mode (Defect Spacing style)
          (() => {
            const points = dataPoints
              .filter((p) => {
                const val = parseFloat(String(p.value));
                return !isNaN(val);
              })
              .map((p) => {
                const val = parseFloat(String(p.value!));
                const midDepth = p.d2 !== null
                  ? (p.d1 + p.d2) / 2
                  : p.d1;
                const x = valueToX(val);
                const y = depthToY(
                  clampDepth(midDepth, startDepth, endDepth),
                  startDepth,
                  endDepth,
                  bodyHeight,
                ) + scaleAreaHeight;
                return { x, y, id: p.id };
              });

            // Build path
            const pathD = points
              .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}`)
              .join(' ');

            return (
              <g>
                {/* Line connecting points */}
                {points.length > 1 && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke={colour}
                    strokeWidth={lineWeight}
                  />
                )}
                {/* Data points */}
                {points.map((p) => (
                  <circle
                    key={p.id}
                    cx={`${p.x}%`}
                    cy={p.y}
                    r={parseFloat(String(column.dataPointSize ?? 2))}
                    fill={colour}
                    data-testid={`chart-point-${p.id}`}
                  />
                ))}
              </g>
            );
          })()}

      {/* Text annotations for data points with text but no value */}
      {column.data
        .filter(
          (d) =>
            d.text &&
            (d.value === undefined || d.value === null || d.value === ''),
        )
        .map((point) => {
          const y = depthToY(
            clampDepth(point.d1, startDepth, endDepth),
            startDepth,
            endDepth,
            bodyHeight,
          ) + scaleAreaHeight;

          return (
            <text
              key={point.id}
              x={4}
              y={y}
              fontSize={6}
              fill="#333"
              data-testid={`chart-text-${point.id}`}
            >
              {point.text}
            </text>
          );
        })}
    </svg>
  );
};

export default ChartColumnComponent;
