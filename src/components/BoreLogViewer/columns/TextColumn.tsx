import React from 'react';
import type { TextColumn as TextColumnType, TextBlock } from '../types';
import { depthToY, clampDepth } from '../utils/depthUtils';

interface TextColumnProps {
  column: TextColumnType;
  startDepth: number;
  endDepth: number;
  bodyHeight: number;
  columnWidth: number;
  endDepthComment?: string;
}

const TextColumnComponent: React.FC<TextColumnProps> = ({
  column,
  startDepth,
  endDepth,
  bodyHeight,
  columnWidth,
  endDepthComment,
}) => {
  const isNarrow = columnWidth < 8;

  const renderBlock = (block: TextBlock) => {
    const d1 = clampDepth(block.d1, startDepth, endDepth);
    const d2 = clampDepth(block.d2, startDepth, endDepth);
    const top = depthToY(d1, startDepth, endDepth, bodyHeight);
    const bottom = depthToY(d2, startDepth, endDepth, bodyHeight);
    const height = bottom - top;

    if (height <= 0) return null;

    const hasTopLine =
      block.topLineDashes &&
      block.topLineDashes.length > 0 &&
      block.topLineDashes.some((v) => v > 0);

    return (
      <div
        key={block.id}
        className={`bore-log-text-block ${isNarrow ? 'narrow' : ''}`}
        style={{
          top,
          height: Math.max(height, 10),
          borderTop: hasTopLine ? '1px dashed #999' : undefined,
        }}
        data-testid={`text-block-${block.id}`}
        title={block.depthRange || `${block.d1} - ${block.d2}`}
      >
        <span className="block-text">{block.text}</span>
      </div>
    );
  };

  const renderWaterStrikes = () => {
    if (!column.waterStrikes || column.waterStrikes.length === 0) return null;

    return column.waterStrikes.map((ws) => {
      const depth = typeof ws.depth === 'string' ? parseFloat(ws.depth) : ws.depth;
      if (depth < startDepth || depth > endDepth) return null;

      const y = depthToY(depth, startDepth, endDepth, bodyHeight);
      const recovery = ws.recovery
        ? typeof ws.recovery === 'string'
          ? parseFloat(ws.recovery)
          : ws.recovery
        : null;
      const recoveryY = recovery
        ? depthToY(recovery, startDepth, endDepth, bodyHeight)
        : null;

      return (
        <React.Fragment key={ws.id}>
          {/* Water strike triangle */}
          <svg
            style={{
              position: 'absolute',
              left: 0,
              top: y - 6,
              width: '100%',
              height: 12,
              pointerEvents: 'none',
            }}
            data-testid={`water-strike-${ws.id}`}
          >
            <polygon
              points="4,0 8,8 0,8"
              fill="#4a90d9"
              transform="translate(0, 2)"
            />
          </svg>
          {/* Recovery level line */}
          {recoveryY !== null && (
            <div
              className="bore-log-depth-line"
              style={{
                top: recoveryY,
                borderTopColor: '#4a90d9',
                borderTopStyle: 'dashed',
              }}
            />
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div style={{ position: 'relative', height: bodyHeight }}>
      {column.blocks
        .filter((b) => b.d1 < endDepth && b.d2 > startDepth)
        .map(renderBlock)}

      {renderWaterStrikes()}

      {column.showEndDepthComment && endDepthComment && (
        <div
          className="bore-log-end-depth-comment"
          style={{
            top: depthToY(
              clampDepth(endDepth, startDepth, endDepth),
              startDepth,
              endDepth,
              bodyHeight,
            ) - 14,
          }}
          data-testid="end-depth-comment"
        >
          {endDepthComment}
        </div>
      )}
    </div>
  );
};

export default TextColumnComponent;
