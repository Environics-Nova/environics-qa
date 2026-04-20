import React from 'react';
import type { FooterRow } from './types';

interface BoreLogFooterProps {
  footerRows: FooterRow[];
  pageNumber?: number;
  totalPages?: number;
}

const BoreLogFooter: React.FC<BoreLogFooterProps> = ({
  footerRows,
  pageNumber = 1,
  totalPages = 1,
}) => {
  const resolveTemplate = (text: string): string => {
    return text
      .replace(/<%= pageNumber %>/g, String(pageNumber))
      .replace(/<%= totalPages %>/g, String(totalPages))
      .replace(/<%= appInfo %>/g, 'Environics Data Viewer');
  };

  return (
    <div className="bore-log-footer" data-testid="bore-log-footer">
      {footerRows.map((row) => (
        <div
          key={row.id}
          className="bore-log-footer-row"
          style={{
            minHeight: row.height ? `${row.height * 4}px` : undefined,
          }}
        >
          {row.columns.map((col) => (
            <div
              key={col.id}
              className={`bore-log-footer-col ${col.halign ? `halign-${col.halign}` : ''}`}
              style={{
                width: col.width ? `${col.width}%` : undefined,
                flex: col.width ? `0 0 ${col.width}%` : 1,
              }}
            >
              {col.items.map((item) => (
                <div key={item.id} className="bore-log-footer-item">
                  {item.label && (
                    <span className="item-label">{item.label}: </span>
                  )}
                  <span>
                    {item.text ? resolveTemplate(item.text) : ''}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BoreLogFooter;
