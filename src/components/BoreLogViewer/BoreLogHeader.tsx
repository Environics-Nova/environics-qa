import React from 'react';
import type { HeaderRow, HeaderColumn, HeaderItem, BoreLogImage } from './types';

interface BoreLogHeaderProps {
  headerRows: HeaderRow[];
  images?: BoreLogImage[];
  fontSize?: number;
}

const BoreLogHeader: React.FC<BoreLogHeaderProps> = ({
  headerRows,
  images = [],
  fontSize = 8,
}) => {
  const imageMap = new Map(images.map((img) => [img.id, img]));

  const renderItem = (item: HeaderItem) => {
    // Image item
    if (item.image) {
      const img = imageMap.get(item.image);
      if (img) {
        return (
          <div key={item.id} className="bore-log-header-item item-image">
            <img
              src={`data:image/png;base64,${img.base64Data}`}
              alt={item.image}
              className="bore-log-header-logo"
              style={{ width: img.width, height: img.height }}
              data-testid="header-logo"
            />
          </div>
        );
      }
      return null;
    }

    // Title item (has fontSize > default)
    if (item.fontSize && item.fontSize > fontSize) {
      return (
        <div key={item.id} className="bore-log-header-item">
          <span className="item-title" style={{ fontSize: item.fontSize }}>
            {item.label}
          </span>
          {item.text && !item.text.startsWith('<%') && (
            <span className="item-title" style={{ fontSize: item.fontSize, fontWeight: 400, marginLeft: 8 }}>
              {item.text}
            </span>
          )}
        </div>
      );
    }

    // Label-value item
    return (
      <div key={item.id} className="bore-log-header-item" style={{ fontSize }}>
        {item.label && (
          <span className="item-label">{item.label}</span>
        )}
        {item.text && !item.text.startsWith('<%') && (
          <span
            className="item-value"
            style={{ wordBreak: item.wrap ? 'break-word' : undefined }}
          >
            {item.text}
          </span>
        )}
      </div>
    );
  };

  const renderColumn = (col: HeaderColumn) => {
    const classes = [
      'bore-log-header-col',
      col.borderTop ? 'border-top' : '',
      col.borderLeft ? 'border-left' : '',
      col.borderRight ? 'border-right' : '',
      col.border ? 'border-all' : '',
      col.valign ? `valign-${col.valign}` : '',
      col.halign ? `halign-${col.halign}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        key={col.id}
        className={classes}
        style={{
          width: col.width ? `${col.width}%` : undefined,
          flex: col.width ? `0 0 ${col.width}%` : 1,
        }}
        data-testid={`header-col-${col.id}`}
      >
        {col.items.map(renderItem)}
      </div>
    );
  };

  return (
    <div className="bore-log-header" data-testid="bore-log-header">
      {headerRows.map((row) => (
        <div
          key={row.id}
          className="bore-log-header-row"
          style={{
            minHeight: row.height ? `${parseFloat(String(row.height)) * 4}px` : undefined,
          }}
          data-testid={`header-row-${row.id}`}
        >
          {row.columns.map(renderColumn)}
        </div>
      ))}
    </div>
  );
};

export default BoreLogHeader;
