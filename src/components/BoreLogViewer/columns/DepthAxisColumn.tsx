import React from 'react';
import type { AxisColumn as AxisColumnType } from '../types';
import {
  depthToY,
  calculateAxisTicks,
  getAxisConfig,
  getAxisTickLabel,
} from '../utils/depthUtils';

interface DepthAxisColumnProps {
  column: AxisColumnType;
  startDepth: number;
  endDepth: number;
  bodyHeight: number;
}

const DepthAxisColumn: React.FC<DepthAxisColumnProps> = ({
  column,
  startDepth,
  endDepth,
  bodyHeight,
}) => {
  const config = getAxisConfig(column);
  const ticks = calculateAxisTicks(startDepth, endDepth, config.majorFreq, config.minorFreq);
  const isElevation = config.valueType === 'elevation' || config.valueType === 'scaleExpression';

  // Elevation axis: ticks on left, labels right — Depth axis: ticks on right, labels left
  const axisClass = isElevation ? 'bore-log-axis elevation' : 'bore-log-axis depth';

  return (
    <div className={axisClass} style={{ height: bodyHeight }}>
      {/* Vertical ruler spine along the tick side */}
      <div className="ruler-spine" />

      {ticks.map((tick, i) => {
        const y = depthToY(tick.depth, startDepth, endDepth, bodyHeight);
        const label = tick.isMajor
          ? getAxisTickLabel(tick.depth, config.valueType, config.scaleExpression)
          : '';

        return (
          <div
            key={`tick-${i}`}
            className={`ruler-tick ${tick.isMajor ? 'major' : 'minor'}`}
            style={{ top: y }}
            data-testid={tick.isMajor ? 'major-tick' : 'minor-tick'}
          >
            <div className="ruler-tick-line" />
            {label && (
              <span className="ruler-tick-label" data-testid="tick-label">
                {label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DepthAxisColumn;
