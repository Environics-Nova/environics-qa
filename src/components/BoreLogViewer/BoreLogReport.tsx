import React from 'react';
import type {
  BoreLogReport as ReportType,
  BoreLogImage,
  BoreLogColumn,
} from './types';
import {
  isTextColumn,
  isAxisColumn,
  isGraphicColumn,
  isChartColumn,
} from './types';
import {
  getVisibleColumns,
  getTotalWidth,
  getColumnWidthPercent,
  depthToY,
  calculateAxisTicks,
  getAxisConfig,
} from './utils/depthUtils';
import BoreLogHeader from './BoreLogHeader';
import BoreLogFooter from './BoreLogFooter';
import DepthAxisColumn from './columns/DepthAxisColumn';
import TextColumnComponent from './columns/TextColumn';
import GraphicColumnComponent from './columns/GraphicColumn';
import ChartColumnComponent from './columns/ChartColumn';

interface BoreLogReportProps {
  report: ReportType;
  images?: BoreLogImage[];
}

/** Pixels per depth unit — controls vertical scale */
const PX_PER_DEPTH = 50;

const BoreLogReport: React.FC<BoreLogReportProps> = ({ report, images = [] }) => {
  const { startDepth, endDepth, depthPerPage } = report;
  const visibleColumns = getVisibleColumns(report.columns);
  const totalWidth = getTotalWidth(visibleColumns);

  // Calculate body height based on depth range
  const depthRange = endDepth - startDepth;
  const bodyHeight = depthRange * PX_PER_DEPTH;

  // Determine if column header text should be rotated
  const shouldRotate = (col: BoreLogColumn): boolean => {
    const widthPercent = getColumnWidthPercent(col, totalWidth);
    return widthPercent < 7;
  };

  const renderColumn = (col: BoreLogColumn) => {
    const widthPercent = getColumnWidthPercent(col, totalWidth);

    if (isAxisColumn(col)) {
      return (
        <DepthAxisColumn
          column={col}
          startDepth={startDepth}
          endDepth={endDepth}
          bodyHeight={bodyHeight}
        />
      );
    }

    if (isTextColumn(col)) {
      return (
        <TextColumnComponent
          column={col}
          startDepth={startDepth}
          endDepth={endDepth}
          bodyHeight={bodyHeight}
          columnWidth={widthPercent}
          endDepthComment={report.endDepthComment}
        />
      );
    }

    if (isGraphicColumn(col)) {
      return (
        <GraphicColumnComponent
          column={col}
          startDepth={startDepth}
          endDepth={endDepth}
          bodyHeight={bodyHeight}
        />
      );
    }

    if (isChartColumn(col)) {
      return (
        <ChartColumnComponent
          column={col}
          startDepth={startDepth}
          endDepth={endDepth}
          bodyHeight={bodyHeight}
        />
      );
    }

    return null;
  };

  return (
    <div
      className="bore-log-report"
      style={{ fontSize: report.fontSize || 8 }}
      data-testid="bore-log-report"
    >
      {/* Header */}
      <BoreLogHeader
        headerRows={report.headerRows}
        images={images}
        fontSize={report.fontSize}
      />

      {/* Column Headers */}
      <div className="bore-log-column-headers" data-testid="column-headers">
        {visibleColumns.map((col) => {
          const widthPercent = getColumnWidthPercent(col, totalWidth);
          const rotate = shouldRotate(col);

          return (
            <div
              key={col.id}
              className="bore-log-col-header"
              style={{ width: `${widthPercent}%` }}
              data-testid={`col-header-${col.id}`}
            >
              <span
                className={`bore-log-col-header-text ${rotate ? 'rotated' : ''}`}
              >
                {col.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div
        className="bore-log-body"
        style={{ height: bodyHeight }}
        data-testid="bore-log-body"
      >
        {visibleColumns.map((col) => {
          const widthPercent = getColumnWidthPercent(col, totalWidth);

          return (
            <div
              key={col.id}
              className="bore-log-column"
              style={{ width: `${widthPercent}%` }}
              data-testid={`column-${col.id}`}
            >
              {renderColumn(col)}
            </div>
          );
        })}

        {/* ── Horizontal Ruler Lines (depth grid) ── */}
        {(() => {
          // Find the first axis column to get tick configuration
          const axisCol = visibleColumns.find(isAxisColumn);
          if (!axisCol) return null;

          const config = getAxisConfig(axisCol);
          const ticks = calculateAxisTicks(startDepth, endDepth, config.majorFreq, config.minorFreq);

          return ticks
            .filter((tick) => tick.isMajor && tick.depth > startDepth && tick.depth < endDepth)
            .map((tick, i) => {
              const y = depthToY(tick.depth, startDepth, endDepth, bodyHeight);
              return (
                <div
                  key={`ruler-${i}`}
                  className="bore-log-ruler-line"
                  style={{ top: y }}
                  data-testid="ruler-line"
                />
              );
            });
        })()}
      </div>

      {/* Footer */}
      <BoreLogFooter footerRows={report.footerRows} />
    </div>
  );
};

export default BoreLogReport;
