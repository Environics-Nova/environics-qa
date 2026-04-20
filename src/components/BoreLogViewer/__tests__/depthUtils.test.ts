import { describe, it, expect } from 'vitest';
import {
  depthToY,
  clampDepth,
  getVisibleColumns,
  getTotalWidth,
  getColumnWidthPercent,
  calculateAxisTicks,
  evaluateScaleExpression,
  getAxisTickLabel,
} from '../utils/depthUtils';
import type { BoreLogColumn } from '../types';

describe('depthToY', () => {
  it('converts depth 0 to Y=0 at top', () => {
    expect(depthToY(0, 0, 14, 700)).toBe(0);
  });

  it('converts end depth to body height', () => {
    expect(depthToY(14, 0, 14, 700)).toBe(700);
  });

  it('converts midpoint correctly', () => {
    expect(depthToY(7, 0, 14, 700)).toBe(350);
  });

  it('handles non-zero start depth', () => {
    expect(depthToY(5, 2, 12, 500)).toBe(150);
  });

  it('returns 0 for zero range', () => {
    expect(depthToY(5, 5, 5, 500)).toBe(0);
  });
});

describe('clampDepth', () => {
  it('clamps below start to start', () => {
    expect(clampDepth(-1, 0, 14)).toBe(0);
  });

  it('clamps above end to end', () => {
    expect(clampDepth(20, 0, 14)).toBe(14);
  });

  it('leaves in-range values unchanged', () => {
    expect(clampDepth(7, 0, 14)).toBe(7);
  });
});

describe('getVisibleColumns', () => {
  it('filters out hidden columns', () => {
    const columns = [
      { id: 1, text: 'A', type: 'text', width: 10, hidden: false },
      { id: 2, text: 'B', type: 'text', width: 10, hidden: true },
      { id: 3, text: 'C', type: 'text', width: 10 },
    ] as BoreLogColumn[];

    const result = getVisibleColumns(columns);
    expect(result).toHaveLength(2);
    expect(result.map((c) => c.id)).toEqual([1, 3]);
  });

  it('returns all columns when none are hidden', () => {
    const columns = [
      { id: 1, text: 'A', type: 'text', width: 10 },
      { id: 2, text: 'B', type: 'text', width: 10 },
    ] as BoreLogColumn[];

    expect(getVisibleColumns(columns)).toHaveLength(2);
  });
});

describe('getTotalWidth', () => {
  it('sums column widths', () => {
    const columns = [
      { id: 1, text: 'A', type: 'text', width: 10 },
      { id: 2, text: 'B', type: 'text', width: 20 },
      { id: 3, text: 'C', type: 'text', width: '5' },
    ] as BoreLogColumn[];

    expect(getTotalWidth(columns)).toBe(35);
  });
});

describe('getColumnWidthPercent', () => {
  it('calculates percentage correctly', () => {
    const col = { id: 1, text: 'A', type: 'text', width: 25 } as BoreLogColumn;
    expect(getColumnWidthPercent(col, 100)).toBe(25);
  });

  it('handles string widths', () => {
    const col = { id: 1, text: 'A', type: 'text', width: '10' } as BoreLogColumn;
    expect(getColumnWidthPercent(col, 50)).toBe(20);
  });
});

describe('calculateAxisTicks', () => {
  it('generates correct major ticks at 1m intervals', () => {
    const ticks = calculateAxisTicks(0, 5, 1, 0.5);
    const majorTicks = ticks.filter((t) => t.isMajor);
    expect(majorTicks).toHaveLength(6); // 0,1,2,3,4,5
    expect(majorTicks[0].depth).toBe(0);
    expect(majorTicks[0].label).toBe('0');
    expect(majorTicks[5].depth).toBe(5);
  });

  it('generates minor ticks between majors', () => {
    const ticks = calculateAxisTicks(0, 2, 1, 0.5);
    const minorTicks = ticks.filter((t) => !t.isMajor);
    expect(minorTicks.length).toBeGreaterThan(0);
    expect(minorTicks[0].label).toBe('');
  });

  it('handles fractional frequencies', () => {
    const ticks = calculateAxisTicks(0, 1, 0.5, 0.1);
    const majorTicks = ticks.filter((t) => t.isMajor);
    expect(majorTicks).toHaveLength(3); // 0, 0.5, 1
  });

  it('handles non-zero start', () => {
    const ticks = calculateAxisTicks(2, 4, 1, 0.5);
    const majorTicks = ticks.filter((t) => t.isMajor);
    expect(majorTicks[0].depth).toBe(2);
  });
});

describe('evaluateScaleExpression', () => {
  it('evaluates simple subtraction', () => {
    expect(evaluateScaleExpression('45.15 - d', 0)).toBeCloseTo(45.15);
  });

  it('evaluates with depth value', () => {
    expect(evaluateScaleExpression('45.15 - d', 6)).toBeCloseTo(39.15);
  });

  it('returns depth on invalid expression', () => {
    expect(evaluateScaleExpression('invalid', 5)).toBe(5);
  });
});

describe('getAxisTickLabel', () => {
  it('returns depth for depth type', () => {
    expect(getAxisTickLabel(5, 'depth')).toBe('5');
  });

  it('evaluates expression for scaleExpression type', () => {
    const label = getAxisTickLabel(0, 'scaleExpression', '45.15 - d');
    expect(parseFloat(label)).toBeCloseTo(45.15);
  });

  it('returns depth string for elevation without expression', () => {
    expect(getAxisTickLabel(3, 'elevation')).toBe('3');
  });
});
