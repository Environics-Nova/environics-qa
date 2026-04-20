import React, { useState } from 'react';
import type { BoreLogData } from './types';
import BoreLogReport from './BoreLogReport';
import './bore-log-viewer.css';

interface BoreLogViewerProps {
  /** The full JSON data containing reports and images */
  data: BoreLogData;
}

/**
 * BoreLogViewer — Root component for rendering geological bore log reports.
 *
 * Accepts the standard ESlog JSON format and renders a professional bore log
 * viewer matching the eslog.esdat.net design.
 *
 * @example
 * ```tsx
 * import BoreLogViewer from '@/components/BoreLogViewer';
 * import sampleData from './sample-data.json';
 *
 * <BoreLogViewer data={sampleData} />
 * ```
 */
const BoreLogViewer: React.FC<BoreLogViewerProps> = ({ data }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const reports = data.reports || [];

  if (reports.length === 0) {
    return (
      <div className="bore-log-viewer" data-testid="bore-log-viewer-empty">
        <p style={{ padding: 16, color: '#666' }}>No reports available.</p>
      </div>
    );
  }

  const selectedReport = reports[selectedIndex];

  return (
    <div className="bore-log-viewer" data-testid="bore-log-viewer">
      {/* Report Selector */}
      {reports.length > 1 && (
        <div className="bore-log-selector" data-testid="report-selector">
          <label htmlFor="bore-log-select">Selected Log:</label>
          <select
            id="bore-log-select"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
          >
            {reports.map((r, i) => (
              <option key={r.id} value={i}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selected Report */}
      {selectedReport && (
        <BoreLogReport
          report={selectedReport}
          images={data.images}
        />
      )}
    </div>
  );
};

export default BoreLogViewer;
export { BoreLogViewer };
export type { BoreLogViewerProps };
