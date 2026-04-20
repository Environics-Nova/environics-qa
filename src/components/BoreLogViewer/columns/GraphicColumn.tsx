import React from 'react';
import type { GraphicColumn as GraphicColumnType } from '../types';
import { depthToY, clampDepth } from '../utils/depthUtils';
import { getAllPatterns } from '../utils/patternDefs';

interface GraphicColumnProps {
  column: GraphicColumnType;
  startDepth: number;
  endDepth: number;
  bodyHeight: number;
}

const GraphicColumnComponent: React.FC<GraphicColumnProps> = ({
  column,
  startDepth,
  endDepth,
  bodyHeight,
}) => {
  const allPatterns = getAllPatterns();

  // Check if this is a well construction diagram
  const hasWells = column.wells && column.wells.length > 0;

  if (hasWells) {
    return (
      <WellDiagram
        column={column}
        startDepth={startDepth}
        endDepth={endDepth}
        bodyHeight={bodyHeight}
      />
    );
  }

  return (
    <svg
      width="100%"
      height={bodyHeight}
      style={{ display: 'block' }}
      data-testid="graphic-column-svg"
    >
      <defs>
        {allPatterns.map((p) => (
          <pattern
            key={p.id}
            id={`pat-${p.id}`}
            patternUnits="userSpaceOnUse"
            width={p.width}
            height={p.height}
          >
            <g dangerouslySetInnerHTML={{ __html: p.content }} />
          </pattern>
        ))}
      </defs>

      {column.blocks
        .filter((b) => b.d1 < endDepth && b.d2 > startDepth)
        .map((block) => {
          const d1 = clampDepth(block.d1, startDepth, endDepth);
          const d2 = clampDepth(block.d2, startDepth, endDepth);
          const y1 = depthToY(d1, startDepth, endDepth, bodyHeight);
          const y2 = depthToY(d2, startDepth, endDepth, bodyHeight);
          const h = y2 - y1;

          if (h <= 0) return null;

          const fill = block.graphicId
            ? `url(#pat-${block.graphicId})`
            : block.background || '#eee';

          return (
            <g key={block.id} data-testid={`graphic-block-${block.id}`}>
              <rect
                x={0}
                y={y1}
                width="100%"
                height={h}
                fill={fill}
                stroke="#999"
                strokeWidth={0.3}
              />
              {/* Top boundary line */}
              {block.d1 > startDepth && (
                <line
                  x1={0}
                  y1={y1}
                  x2="100%"
                  y2={y1}
                  stroke="#000"
                  strokeWidth={0.5}
                  strokeDasharray={
                    block.topLineDashes && block.topLineDashes.some((v) => v > 0)
                      ? block.topLineDashes.join(',')
                      : undefined
                  }
                />
              )}
            </g>
          );
        })}
    </svg>
  );
};

// ── Well Construction Diagram ─────────────────
// Recreates the ESlog-style well diagram:
// - Outer borehole walls (L1, L4) define the drilled hole
// - Inner pipe walls (L2, L3) define the casing/screen tube
// - Annulus (L1↔L2 and L3↔L4) filled with backfill patterns
// - Pipe interior white for casing, horizontal ticks for screen
// - Multi-well (A/B/C) side by side with labels at top
// - Annotations with leader lines to the right
interface WellDiagramProps {
  column: GraphicColumnType;
  startDepth: number;
  endDepth: number;
  bodyHeight: number;
}

const WellDiagram: React.FC<WellDiagramProps> = ({
  column,
  startDepth,
  endDepth,
  bodyHeight,
}) => {
  const allPatterns = getAllPatterns();
  const wells = column.wells || [];
  const blocks = column.blocks || [];
  const showAnnotation = column.showAnnotation !== false;

  // ── Layout Constants ────────────────────────
  // The column is divided into: [annulus area] [wells] [annotation area]
  // We work in percentage-based x coordinates using viewBox
  const viewWidth = 200; // virtual coordinate width
  const wellCount = wells.length || 1;

  // Each well has: outer borehole width + gap
  const singleWellWidth = 30;
  const wellGap = 4;
  const totalWellsWidth = wellCount * singleWellWidth + (wellCount - 1) * wellGap;

  // Center the wells block in the available space
  const annotationWidth = showAnnotation ? 70 : 0;
  const availableWidth = viewWidth - annotationWidth;
  const wellsStartX = (availableWidth - totalWellsWidth) / 2;

  // Pipe is narrower than the borehole
  const boreholeHalfWidth = singleWellWidth / 2; // 15
  const pipeHalfWidth = boreholeHalfWidth * 0.45; // ~6.75, narrower pipe inside borehole
  const pipeWallThickness = 1.2;

  return (
    <div className="bore-log-well-diagram" style={{ height: bodyHeight, position: 'relative' }}>
      <svg
        width="100%"
        height={bodyHeight}
        viewBox={`0 0 ${viewWidth} ${bodyHeight}`}
        preserveAspectRatio="none"
        style={{ display: 'block' }}
        data-testid="well-diagram-svg"
      >
        <defs>
          {allPatterns.map((p) => (
            <pattern
              key={p.id}
              id={`well-pat-${p.id}`}
              patternUnits="userSpaceOnUse"
              width={p.width}
              height={p.height}
            >
              <g dangerouslySetInnerHTML={{ __html: p.content }} />
            </pattern>
          ))}
          {/* Clip path for each well's annulus region */}
          {wells.map((well, wi) => {
            const wellCenterX = wellsStartX + wi * (singleWellWidth + wellGap) + boreholeHalfWidth;
            const topCasing = parseFloat(String(well.topCasing));
            const bottomCap = well.bottomCap
              ? parseFloat(String(well.bottomCap))
              : parseFloat(String(well.bottomScreen));
            const casingY1 = depthToY(clampDepth(topCasing, startDepth, endDepth), startDepth, endDepth, bodyHeight);
            const capY = depthToY(clampDepth(bottomCap, startDepth, endDepth), startDepth, endDepth, bodyHeight);

            // L1 (left outer), L2 (left inner), L3 (right inner), L4 (right outer)
            const L1 = wellCenterX - boreholeHalfWidth;
            const L2 = wellCenterX - pipeHalfWidth;
            const L3 = wellCenterX + pipeHalfWidth;
            const L4 = wellCenterX + boreholeHalfWidth;

            return (
              <clipPath key={`clip-annulus-${well.id}`} id={`clip-annulus-${well.id}`}>
                {/* Left annulus rectangle */}
                <rect x={L1} y={casingY1} width={L2 - L1} height={capY - casingY1} />
                {/* Right annulus rectangle */}
                <rect x={L3} y={casingY1} width={L4 - L3} height={capY - casingY1} />
              </clipPath>
            );
          })}
        </defs>

        {/* ── Layer 1: Backfill patterns in annulus ── */}
        {wells.map((well, wi) => {
          const wellCenterX = wellsStartX + wi * (singleWellWidth + wellGap) + boreholeHalfWidth;
          const L1 = wellCenterX - boreholeHalfWidth;
          const L4 = wellCenterX + boreholeHalfWidth;

          return (
            <g key={`backfill-${well.id}`} clipPath={`url(#clip-annulus-${well.id})`}>
              {blocks
                .filter((b) => b.d1 < endDepth && b.d2 > startDepth)
                .map((block) => {
                  const d1 = clampDepth(block.d1, startDepth, endDepth);
                  const d2 = clampDepth(block.d2, startDepth, endDepth);
                  const y1 = depthToY(d1, startDepth, endDepth, bodyHeight);
                  const y2 = depthToY(d2, startDepth, endDepth, bodyHeight);
                  const h = y2 - y1;
                  if (h <= 0) return null;

                  const fill = block.graphicId
                    ? `url(#well-pat-${block.graphicId})`
                    : block.background || '#ddd';

                  return (
                    <g key={`bf-${well.id}-${block.id}`} data-testid={`backfill-block-${block.id}`}>
                      {/* Fill the full borehole width — clip path limits it to annulus */}
                      <rect
                        x={L1}
                        y={y1}
                        width={L4 - L1}
                        height={h}
                        fill={fill}
                      />
                      {/* Horizontal divider between backfill sections */}
                      {block.d1 > startDepth && (
                        <line
                          x1={L1} y1={y1} x2={L4} y2={y1}
                          stroke="#000" strokeWidth={0.5}
                        />
                      )}
                    </g>
                  );
                })}
            </g>
          );
        })}

        {/* ── Layer 2: Borehole walls + Pipe casing + Screen ── */}
        {wells.map((well, wi) => {
          const wellCenterX = wellsStartX + wi * (singleWellWidth + wellGap) + boreholeHalfWidth;
          const topCasing = parseFloat(String(well.topCasing));
          const bottomCasing = parseFloat(String(well.bottomCasing));
          const topScreen = parseFloat(String(well.topScreen));
          const bottomScreen = parseFloat(String(well.bottomScreen));
          const bottomCap = well.bottomCap
            ? parseFloat(String(well.bottomCap))
            : bottomScreen;

          const casingY1 = depthToY(clampDepth(topCasing, startDepth, endDepth), startDepth, endDepth, bodyHeight);
          const casingY2 = depthToY(clampDepth(bottomCasing, startDepth, endDepth), startDepth, endDepth, bodyHeight);
          const screenY1 = depthToY(clampDepth(topScreen, startDepth, endDepth), startDepth, endDepth, bodyHeight);
          const screenY2 = depthToY(clampDepth(bottomScreen, startDepth, endDepth), startDepth, endDepth, bodyHeight);
          const capY = depthToY(clampDepth(bottomCap, startDepth, endDepth), startDepth, endDepth, bodyHeight);

          // Four vertical lines
          const L1 = wellCenterX - boreholeHalfWidth;
          const L2 = wellCenterX - pipeHalfWidth;
          const L3 = wellCenterX + pipeHalfWidth;
          const L4 = wellCenterX + boreholeHalfWidth;

          // Slot spacing for screen section
          const screenHeight = screenY2 - screenY1;
          const slotSpacing = 3;
          const slotCount = Math.max(0, Math.floor(screenHeight / slotSpacing));

          return (
            <g key={`well-struct-${well.id}`} data-testid={`well-${well.id}`}>
              {/* ── Outer borehole walls (L1, L4) ── */}
              <line x1={L1} y1={casingY1} x2={L1} y2={capY} stroke="#000" strokeWidth={1.0} />
              <line x1={L4} y1={casingY1} x2={L4} y2={capY} stroke="#000" strokeWidth={1.0} />

              {/* ── White pipe interior (casing section) ── */}
              <rect
                x={L2}
                y={casingY1}
                width={L3 - L2}
                height={Math.max(0, casingY2 - casingY1)}
                fill="#fff"
                stroke="none"
              />

              {/* ── Pipe walls — solid casing section (L2, L3) ── */}
              <line x1={L2} y1={casingY1} x2={L2} y2={casingY2} stroke="#000" strokeWidth={pipeWallThickness} />
              <line x1={L3} y1={casingY1} x2={L3} y2={casingY2} stroke="#000" strokeWidth={pipeWallThickness} />

              {/* ── Top cap of casing ── */}
              <line x1={L1} y1={casingY1} x2={L4} y2={casingY1} stroke="#000" strokeWidth={1.5} />

              {/* ── Screen section ── */}
              {/* White background for screen interior */}
              <rect
                x={L2}
                y={screenY1}
                width={L3 - L2}
                height={Math.max(0, screenY2 - screenY1)}
                fill="#fff"
                stroke="none"
              />

              {/* Screen pipe walls (L2, L3) — same solid lines through screen */}
              <line x1={L2} y1={screenY1} x2={L2} y2={screenY2} stroke="#000" strokeWidth={pipeWallThickness} />
              <line x1={L3} y1={screenY1} x2={L3} y2={screenY2} stroke="#000" strokeWidth={pipeWallThickness} />

              {/* Horizontal slot ticks inside the screen */}
              {Array.from({ length: slotCount }).map((_, si) => {
                const slotY = screenY1 + (si + 0.5) * slotSpacing;
                if (slotY >= screenY2) return null;
                return (
                  <line
                    key={`slot-${well.id}-${si}`}
                    x1={L2 + 0.8}
                    y1={slotY}
                    x2={L3 - 0.8}
                    y2={slotY}
                    stroke="#000"
                    strokeWidth={0.4}
                  />
                );
              })}

              {/* ── Bottom cap ── */}
              <line x1={L2} y1={capY} x2={L3} y2={capY} stroke="#000" strokeWidth={1.5} />
              {/* Bottom of borehole */}
              <line x1={L1} y1={capY} x2={L4} y2={capY} stroke="#000" strokeWidth={1.0} />

              {/* ── Screen transition marker (horizontal line at top of screen) ── */}
              {topScreen > topCasing && (
                <line x1={L1} y1={screenY1} x2={L4} y2={screenY1} stroke="#000" strokeWidth={0.5} strokeDasharray="2,1" />
              )}

              {/* ── Well name label at top ── */}
              <text
                x={wellCenterX}
                y={casingY1 - 4}
                fontSize={8}
                fontWeight={700}
                textAnchor="middle"
                fill="#000"
                style={{ fontFamily: 'Arial, sans-serif' }}
              >
                {well.name || String.fromCharCode(65 + wi)}
              </text>
            </g>
          );
        })}

        {/* ── Layer 3: Annotation leader lines + labels ── */}
        {showAnnotation &&
          blocks
            .filter((b) => b.text && b.d1 < endDepth && b.d2 > startDepth)
            .map((block) => {
              const d1 = clampDepth(block.d1, startDepth, endDepth);
              const d2 = clampDepth(block.d2, startDepth, endDepth);
              const y1 = depthToY(d1, startDepth, endDepth, bodyHeight);
              const y2 = depthToY(d2, startDepth, endDepth, bodyHeight);
              const midY = (y1 + y2) / 2;

              // Leader line starts at the edge of the rightmost well's borehole
              const lastWellIdx = wells.length - 1;
              const lastWellCenterX =
                wellsStartX + lastWellIdx * (singleWellWidth + wellGap) + boreholeHalfWidth;
              const leaderStartX = lastWellCenterX + boreholeHalfWidth + 2;
              const leaderEndX = viewWidth - annotationWidth + 4;

              return (
                <g key={`ann-${block.id}`} data-testid={`annotation-${block.id}`}>
                  {/* Horizontal leader line */}
                  <line
                    x1={leaderStartX}
                    y1={midY}
                    x2={leaderEndX}
                    y2={midY}
                    stroke="#000"
                    strokeWidth={0.4}
                  />
                  {/* Small tick at the start of leader */}
                  <line
                    x1={leaderStartX}
                    y1={midY - 2}
                    x2={leaderStartX}
                    y2={midY + 2}
                    stroke="#000"
                    strokeWidth={0.4}
                  />
                  {/* Annotation text */}
                  <text
                    x={leaderEndX + 2}
                    y={midY + 3}
                    fontSize={7}
                    fill="#000"
                    style={{ fontFamily: 'Arial, sans-serif' }}
                  >
                    {block.text}
                  </text>
                </g>
              );
            })}
      </svg>
    </div>
  );
};

export default GraphicColumnComponent;
