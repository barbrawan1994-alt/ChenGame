import React from 'react';

export default function ProgressBar({ value, max, color = '#4CAF50', height = 8, style, barStyle }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{
      width: '100%',
      height,
      background: 'rgba(255,255,255,0.1)',
      borderRadius: height / 2,
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        width: `${pct}%`,
        height: '100%',
        background: color,
        borderRadius: height / 2,
        transition: 'width 0.3s',
        ...barStyle,
      }} />
    </div>
  );
}
