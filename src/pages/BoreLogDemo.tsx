import React from 'react';
import { BoreLogViewer } from '@/components/BoreLogViewer';
import sampleBoreLogData from '@/data/sampleBoreLogData';

/**
 * Demo page for the Bore Log Viewer component.
 * Navigate to /bore-log-demo to see it in action.
 */
const BoreLogDemo: React.FC = () => {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: '#1a1a1a' }}>
        Bore Log Viewer — Demo
      </h1>
      <p style={{ marginBottom: 24, color: '#666', fontSize: 14 }}>
        This demo renders geological bore log reports from JSON data,
        matching the ESlog viewer from{' '}
        <a href="https://eslog.esdat.net/" target="_blank" rel="noreferrer" style={{ color: '#5ba3c7' }}>
          eslog.esdat.net
        </a>
        .
      </p>
      <BoreLogViewer data={sampleBoreLogData} />
    </div>
  );
};

export default BoreLogDemo;
