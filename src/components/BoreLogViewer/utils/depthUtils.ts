import type { BoreLogColumn, AxisColumn, YAxisConfig } from '../types';

/**
 * Convert a depth value to a Y pixel position within the body area.
 */
export function depthToY(
  depth: number,
  startDepth: number,
  endDepth: number,
  bodyHeight: number,
): number {
  const totalRange = endDepth - startDepth;
  if (totalRange <= 0) return 0;
  return ((depth - startDepth) / totalRange) * bodyHeight;
}

/**
 * Clamp a depth value within the visible range.
 */
export function clampDepth(depth: number, startDepth: number, endDepth: number): number {
  return Math.max(startDepth, Math.min(endDepth, depth));
}

/**
 * Filter out hidden columns.
 */
export function getVisibleColumns(columns: BoreLogColumn[]): BoreLogColumn[] {
  return columns.filter((col) => !col.hidden);
}

/**
 * Calculate the total width units of visible columns.
 */
export function getTotalWidth(columns: BoreLogColumn[]): number {
  return columns.reduce((sum, col) => sum + parseFloat(String(col.width)), 0);
}

/**
 * Get column width as a percentage of total.
 */
export function getColumnWidthPercent(col: BoreLogColumn, totalWidth: number): number {
  return (parseFloat(String(col.width)) / totalWidth) * 100;
}

export interface TickMark {
  depth: number;
  label: string;
  isMajor: boolean;
}

/**
 * Generate tick marks for a depth/elevation axis.
 */
export function calculateAxisTicks(
  startDepth: number,
  endDepth: number,
  majorFreq: number,
  minorFreq: number,
): TickMark[] {
  const ticks: TickMark[] = [];
  const eps = 1e-9;

  // Start from the first minor tick at or after startDepth
  const firstTick = Math.ceil(startDepth / minorFreq) * minorFreq;

  for (let d = firstTick; d <= endDepth + eps; d += minorFreq) {
    // Round to avoid floating point issues
    const depth = Math.round(d * 1000) / 1000;
    if (depth > endDepth + eps) break;

    const isMajor = Math.abs(depth % majorFreq) < eps || Math.abs(depth % majorFreq - majorFreq) < eps;
    ticks.push({
      depth,
      label: isMajor ? formatDepthLabel(depth) : '',
      isMajor,
    });
  }

  return ticks;
}

function formatDepthLabel(depth: number): string {
  if (Number.isInteger(depth)) return String(depth);
  // Keep up to 2 decimal places, remove trailing zeros
  const fixed2 = depth.toFixed(2);
  return fixed2.replace(/\.?0+$/, '') || '0';
}

/**
 * Evaluate a scale expression like "45.15 - d" given a depth value.
 */
export function evaluateScaleExpression(expression: string, depth: number): number {
  // Replace 'd' with the depth value
  const expr = expression.replace(/d/g, String(depth));
  // Simple safe evaluation for basic arithmetic
  try {
    return new Function(`return (${expr})`)() as number;
  } catch {
    return depth;
  }
}

/**
 * Get axis configuration defaults from an AxisColumn.
 */
export function getAxisConfig(col: AxisColumn): {
  majorFreq: number;
  minorFreq: number;
  valueType: string;
  scaleExpression?: string;
} {
  const yAxis: YAxisConfig | undefined = col.yAxis;
  return {
    majorFreq: yAxis?.majorTickFrequency ?? col.majorTickFrequency ?? 1,
    minorFreq: yAxis?.minorTickFrequency ?? col.minorTickFrequency ?? 0.1,
    valueType: yAxis?.valueType ?? 'depth',
    scaleExpression: yAxis?.scaleExpression ?? undefined,
  };
}

/**
 * Get the display value for an axis tick based on value type.
 */
export function getAxisTickLabel(
  depth: number,
  valueType: string,
  scaleExpression?: string,
): string {
  if (valueType === 'elevation' || valueType === 'scaleExpression') {
    if (scaleExpression) {
      const val = evaluateScaleExpression(scaleExpression, depth);
      return formatDepthLabel(Math.round(val * 100) / 100);
    }
  }
  return formatDepthLabel(depth);
}
