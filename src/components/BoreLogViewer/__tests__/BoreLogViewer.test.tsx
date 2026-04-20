import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BoreLogViewer } from '../index';
import type { BoreLogData } from '../types';

/**
 * Minimal test data matching the JSON schema structure.
 */
const minimalReport: BoreLogData = {
  reports: [
    {
      id: 1,
      name: 'Test BH01',
      depthPerPage: 10,
      startDepth: 0,
      endDepth: 10,
      endDepthComment: 'Termination Depth at:10 m',
      fontSize: 8,
      headerRows: [
        {
          id: 100,
          showOnAllPages: true,
          height: '8',
          columns: [
            {
              id: 101,
              halign: 'left',
              items: [
                { id: 102, label: 'TEST LOG', text: 'BH01', fontSize: 12 },
              ],
            },
          ],
        },
        {
          id: 103,
          height: '9',
          columns: [
            {
              id: 104,
              borderTop: true,
              borderLeft: true,
              items: [
                { id: 105, label: 'PROJECT NUMBER', text: 'PRJ-001' },
                { id: 106, label: 'CLIENT', text: 'Test Corp' },
              ],
            },
            {
              id: 107,
              borderTop: true,
              borderRight: true,
              items: [
                { id: 108, label: 'TOTAL DEPTH', text: '10' },
              ],
            },
          ],
        },
      ],
      columns: [
        {
          id: 10,
          text: 'Depth (m)',
          type: 'axis' as const,
          width: 5,
          majorTickFrequency: 1,
          minorTickFrequency: 0.5,
          yAxis: { autoCalculateTicks: true, valueType: 'depth' as const },
        },
        {
          id: 20,
          text: 'Graphic Log',
          type: 'graphic' as const,
          width: 5,
          blocks: [
            { id: 21, d1: 0, d2: 5, graphicId: 'uscs-cl' },
            { id: 22, d1: 5, d2: 10, graphicId: 'uscs-gp' },
          ],
        },
        {
          id: 30,
          text: 'Material Description',
          type: 'text' as const,
          width: 30,
          showEndDepthComment: true,
          blocks: [
            {
              id: 31,
              d1: 0,
              d2: 5,
              text: 'CLAY: Brown, Dry, Stiff',
              depthRange: '0 - 5',
            },
            {
              id: 32,
              d1: 5,
              d2: 10,
              text: 'GRAVEL: Grey, Wet, Dense',
              depthRange: '5 - 10',
            },
          ],
        },
        {
          id: 40,
          text: 'Hidden Column',
          type: 'text' as const,
          width: 5,
          hidden: true,
          blocks: [],
        },
        {
          id: 50,
          text: '% Recovery',
          type: 'chart' as const,
          width: 5,
          colour: '#999',
          useDepthRange: true,
          xScaleStart: 0,
          xScaleEnd: 100,
          data: [
            { id: 51, d1: 0, d2: 5, value: 80 },
            { id: 52, d1: 5, d2: 10, value: 60 },
          ],
        },
      ],
      footerRows: [
        {
          id: 200,
          showOnAllPages: true,
          height: 4,
          columns: [
            {
              id: 201,
              width: 70,
              items: [
                {
                  id: 202,
                  label: 'Disclaimer',
                  text: 'This log is for testing purposes.',
                },
              ],
            },
            {
              id: 203,
              halign: 'right',
              items: [
                {
                  id: 204,
                  text: 'Page <%= pageNumber %> of <%= totalPages %>',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  images: [],
};

const multiReportData: BoreLogData = {
  reports: [
    { ...minimalReport.reports[0], id: 1, name: 'Report A' },
    { ...minimalReport.reports[0], id: 2, name: 'Report B' },
  ],
  images: [],
};

describe('BoreLogViewer', () => {
  describe('rendering', () => {
    it('renders the viewer container', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByTestId('bore-log-viewer')).toBeInTheDocument();
    });

    it('renders the report', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByTestId('bore-log-report')).toBeInTheDocument();
    });

    it('renders empty state when no reports', () => {
      render(<BoreLogViewer data={{ reports: [] }} />);
      expect(screen.getByTestId('bore-log-viewer-empty')).toBeInTheDocument();
      expect(screen.getByText('No reports available.')).toBeInTheDocument();
    });
  });

  describe('header', () => {
    it('renders the header section', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByTestId('bore-log-header')).toBeInTheDocument();
    });

    it('renders header items with labels and values', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByText('PROJECT NUMBER')).toBeInTheDocument();
      expect(screen.getByText('PRJ-001')).toBeInTheDocument();
      expect(screen.getByText('CLIENT')).toBeInTheDocument();
      expect(screen.getByText('Test Corp')).toBeInTheDocument();
    });

    it('renders the title', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByText('TEST LOG')).toBeInTheDocument();
    });
  });

  describe('columns', () => {
    it('renders column headers', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByTestId('column-headers')).toBeInTheDocument();
    });

    it('renders visible columns only (hides hidden columns)', () => {
      render(<BoreLogViewer data={minimalReport} />);
      // Should not render hidden column header
      expect(screen.queryByText('Hidden Column')).not.toBeInTheDocument();
      // Should render visible ones
      expect(screen.getByText('Depth (m)')).toBeInTheDocument();
      expect(screen.getByText('Material Description')).toBeInTheDocument();
    });

    it('renders text blocks at correct depths', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByText('CLAY: Brown, Dry, Stiff')).toBeInTheDocument();
      expect(screen.getByText('GRAVEL: Grey, Wet, Dense')).toBeInTheDocument();
    });

    it('renders graphic column SVG', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByTestId('graphic-column-svg')).toBeInTheDocument();
    });

    it('renders chart column SVG', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByTestId('chart-column-svg')).toBeInTheDocument();
    });

    it('renders chart bars', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByTestId('chart-bar-51')).toBeInTheDocument();
      expect(screen.getByTestId('chart-bar-52')).toBeInTheDocument();
    });

    it('renders end depth comment', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByTestId('end-depth-comment')).toBeInTheDocument();
      expect(screen.getByText('Termination Depth at:10 m')).toBeInTheDocument();
    });
  });

  describe('depth axis', () => {
    it('renders major ticks with labels', () => {
      render(<BoreLogViewer data={minimalReport} />);
      const labels = screen.getAllByTestId('tick-label');
      expect(labels.length).toBeGreaterThan(0);
      // Check first and last labels
      expect(labels[0].textContent).toBe('0');
    });

    it('renders both major and minor ticks', () => {
      render(<BoreLogViewer data={minimalReport} />);
      const majorTicks = screen.getAllByTestId('major-tick');
      const minorTicks = screen.getAllByTestId('minor-tick');
      expect(majorTicks.length).toBeGreaterThan(0);
      expect(minorTicks.length).toBeGreaterThan(0);
    });
  });

  describe('footer', () => {
    it('renders footer section', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByTestId('bore-log-footer')).toBeInTheDocument();
    });

    it('renders disclaimer text', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByText(/This log is for testing purposes/)).toBeInTheDocument();
    });

    it('resolves page number template', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    });
  });

  describe('report selector', () => {
    it('shows selector when multiple reports exist', () => {
      render(<BoreLogViewer data={multiReportData} />);
      expect(screen.getByTestId('report-selector')).toBeInTheDocument();
    });

    it('does not show selector for single report', () => {
      render(<BoreLogViewer data={minimalReport} />);
      expect(screen.queryByTestId('report-selector')).not.toBeInTheDocument();
    });

    it('switches reports on selection change', () => {
      render(<BoreLogViewer data={multiReportData} />);
      const select = screen.getByRole('combobox');
      expect(select).toHaveValue('0');

      fireEvent.change(select, { target: { value: '1' } });
      expect(select).toHaveValue('1');
    });
  });
});
